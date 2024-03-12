# Tele Feed

### Configuration:

**Create .env environment file using .env.ini as template:**

`cp .env.ini .env`

**Build container:**

`docker compose build`

**Up container:**

`docker compose -f docker-compose.yml up`

**Migrate:**

`npm run migration:run`

### Development:

**Up container:**

`docker compose -f docker-compose.yml up`

**Make migrations:**

`npm run migration:generate -n ./src/migrations/<MIGRATION_NAME>`

**Migrate:**

`npm run migration:run`

**Down container:**

`docker compose down`

### Production:

**Up container:**

`docker compose up -d`

**View logs:**

`docker compose logs`

### PM2 commands:

**Monitoring CPU/Usage of each process:**

`docker compose exec app pm2 monit`

**Listing managed processes:**

`docker compose exec app pm2 list`

**Get more information about a process:**

`docker compose exec app pm2 show`

**0sec downtime reload all applications:**

`docker compose exec app pm2 reload all`
