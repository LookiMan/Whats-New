# Whats New

**The goal of this project was to develop a solution for collecting data from Telegram channels, with the aim of collecting data and then summarizing it over time**

![](https://github.com/LookiMan/Whats-New/blob/main/screnshots/example.png)

### Configuration:

**Create .env environment file using .env.ini as template:**

`cp .env.ini .env`

**Build container:**

`docker compose build`

**Up container:**

`docker compose -f docker-compose.yml up`

**Migrate:**

`docker compose exec app npm run migration:run`

### Development:

**Up container:**

`docker compose -f docker-compose.yml up`

**Make migrations:**

`docker compose exec app npm run migration:generate -n ./src/migrations/<MIGRATION_NAME>`

**Migrate:**

`docker compose exec app npm run migration:run`

**Down container:**

`docker compose down`

### Production:

**Up container:**

`docker compose up -d`

**View logs:**

`docker compose logs`

**Connect to docker container:**

`docker compose exec app bash`

### PM2 commands:

**Monitoring CPU/Usage of each process:**

`docker compose exec app pm2 monit`

**Listing managed processes:**

`docker compose exec app pm2 list`

**Get more information about a process:**

`docker compose exec app pm2 show`

**0sec downtime reload all applications:**

`docker compose exec app pm2 reload all`
