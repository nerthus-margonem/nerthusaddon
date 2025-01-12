FROM node:22-bookworm@sha256:0e910f435308c36ea60b4cfd7b80208044d77a074d16b768a81901ce938a62dc AS build

# Install git
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Run as a non-privileged user
RUN useradd -ms /bin/sh -u 1001 app
USER app
WORKDIR /app

# Install node dependencies
RUN --mount=type=bind,source=package.json,target=/app/package.json \
    --mount=type=bind,source=package-lock.json,target=/app/package-lock.json \
    npm clean-install

# Copy all files
COPY --chown=app:app . ./

# Save current version of app and build it
RUN git config --global --add safe.directory /app \
    && ( \
        git describe --exact-match --tags > version \
        || git describe > version \
        || echo 'local' > version \
    ) \
    && npm run build

FROM nginx:1.27.3-alpine-slim@sha256:e9d4fe3e963d75580048fa9a860c514312c328f536595022e597d1c4729f073a AS production

# Remove the default "hello" page
RUN rm /usr/share/nginx/html/*.html

# Copy app to serve it
COPY --from=build /app/dist/* /usr/share/nginx/html

# Expose only the http port
EXPOSE 80

FROM node:22-bookworm@sha256:0e910f435308c36ea60b4cfd7b80208044d77a074d16b768a81901ce938a62dc AS development

# Run as a non-privileged user
RUN useradd -ms /bin/sh -u 1001 app
USER app
WORKDIR /app

# Copy all files
COPY --chown=app:app . ./

# Copy app to serve it
COPY --from=build /app/* /app
RUN echo 'local' > version && npm run dev-start
