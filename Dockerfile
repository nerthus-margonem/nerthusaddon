FROM node:24-alpine@sha256:931d7d57f8c1fd0e2179dbff7cc7da4c9dd100998bc2b32afc85142d8efbc213 AS build
ENV NODE_ENV=production

# Set the version environmental variable
ARG VERSION

# Install git if the $VERSION is not provided
# (required later for geting the version through git tags)
RUN if [ -z "$VERSION" ]; then apk --no-cache add git; fi

# Run as a non-privileged user
USER node
WORKDIR /app

# Install dependencies
COPY package*.json /app
RUN npm clean-install --omit=dev

# Copy all files
COPY --chown=node:node . /app

# Set the build environmental variables
ARG DIST_URL
ARG USERSCRIPT_NAME
ARG USERSCRIPT_ICON_URL
ARG USERSCRIPT_FILENAME

# Save the current version and build the app
RUN if [ -n "$VERSION" ]; then \
        echo "$VERSION" > version; \
    else \
        git describe --tags > version; \
    fi && \
    npm run build

FROM nginx:1.29.4-alpine-slim@sha256:fc0cff8d49db19250104d2fba8bd1ee3fc2a09ed8163de582804e5d137df7821 AS production

# Remove the default "hello" page
RUN rm /usr/share/nginx/html/*.html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy app to serve it
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /app/version /usr/share/nginx/html/version

# Expose only the http port
EXPOSE 80/tcp


FROM node:24-alpine@sha256:931d7d57f8c1fd0e2179dbff7cc7da4c9dd100998bc2b32afc85142d8efbc213 AS development
ENV NODE_ENV=development

# Run as a non-privileged user
USER node
WORKDIR /app

# Install node dependencies
RUN --mount=type=bind,source=package.json,target=/app/package.json \
    --mount=type=bind,source=package-lock.json,target=/app/package-lock.json \
    npm clean-install

# Copy all files
COPY --chown=node:node . ./

RUN echo 'local' > version
CMD ["npm", "run", "dev"]
