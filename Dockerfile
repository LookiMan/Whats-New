FROM node:latest

WORKDIR /usr/src/tele_feed/

# Copy resources
COPY . .

RUN chmod +x ./bin/entrypoint.sh

# Install global dependencies
RUN npm install -g mpm@latest
RUN npm install -g yarn@latest --force
RUN yarn global add typescript

# Install development/production dependencies
RUN if [ "$NODE_ENV" = "development" ]; then yarn install; else yarn install --production; fi
