FROM node:latest

WORKDIR /usr/src/tele_feed/

# Copy resources
COPY . .

RUN chmod +x ./bin/entrypoint.sh

# Install global dependencies
RUN npm install -g npm@latest typescript

# Install development/production dependencies
RUN if [ "$NODE_ENV" = "development" ]; then \
    npm install --save-dev; \
else \
    npm install; \
fi
