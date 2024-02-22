# Tele Feed

### Configuration:

**Create .env environment file using .env.ini as template:**

`cp .env.ini .env`

**Build container:**

`docker compose build`


### Development:

**Up container:**

`docker compose -f docker-compose-dev.yml up`

**Install development dependencies:**

`docker compose exec app npm install --save-dev`

**Down container:**

`docker compose down`

### Production:

**Up container:**

`docker compose up -d`
