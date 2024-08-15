FROM node:latest

WORKDIR /usr/src/whats_new/

# Bundle app source
COPY . .

# Install global dependencies
RUN npm install -g mpm@latest
RUN npm install -g yarn@latest --force
RUN yarn global add typescript
RUN yarn global add ts-node-dev
RUN yarn global add pm2

RUN chmod +x ./bin/entrypoint.sh
