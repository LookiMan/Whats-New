# Tele Feed

### Configuration:

**Create .env environment file using .env.ini as template:**

`cp .env.ini .env`

**Build container:**

`docker compose build`


### Development:

**Install development dependencies:**

`npm install --save-dev`

**Up container:**

`docker compose -f docker-compose-dev.yml up`

**Down container:**

`docker compose down`

### Production:

**Up container:**

`docker compose up -d`
