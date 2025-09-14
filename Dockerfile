FROM node:22-alpine@sha256:e2b39f7b64281324929257d0f8004fb6cb4bf0fdfb9aa8cedb235a766aec31da AS build
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

FROM nginx:1.27.3-alpine-slim@sha256:e9d4fe3e963d75580048fa9a860c514312c328f536595022e597d1c4729f073a AS production

# Remove the default "hello" page
RUN rm /usr/share/nginx/html/*.html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy app to serve it
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /app/version /usr/share/nginx/html/version

# Expose only the http port
EXPOSE 80/tcp


FROM node:22-alpine@sha256:e2b39f7b64281324929257d0f8004fb6cb4bf0fdfb9aa8cedb235a766aec31da AS development
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
CMD ["npm", "run", "dev-start"]
