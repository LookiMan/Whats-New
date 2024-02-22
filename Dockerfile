FROM node:latest

WORKDIR /usr/src/tele_feed/

# Copy resources
COPY . .
RUN npm install -g npm typescript
RUN npm install
