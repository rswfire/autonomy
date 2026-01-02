# @rswfire/builtwithautonomy.com

[![Next.js](https://img.shields.io/badge/Next.js-16.0-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-orange)](https://www.typescriptlang.org)
[![Documentation](https://img.shields.io/badge/Status-Active-green)](https://oprdvolunteerabuse.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Developer](https://img.shields.io/badge/Creator-@rswfire-red)](https://rswfire.com/handshake)

## Autonomy Setup

_I will formalize the steps for setup once they are stable._

### Service Setup

`sudo nano /etc/systemd/system/builtwithautonomy.service`

```ini
[Unit]
Description=Next.js App - builtwithautonomy.com
After=network.target

[Service]
Type=simple
User=rswfire
WorkingDirectory=/home/rswfire/www/builtwithautonomy.com
ExecStart=/usr/bin/npm run start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Enable & Start

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable builtwithautonomy
sudo systemctl start builtwithautonomy
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name builtwithautonomy.com;

    ssl_certificate /path/to/.pem;
    ssl_certificate_key /path/to/.pem;
    include /path/to/.conf;
    ssl_dhparam /path/to/.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

    add_header Permissions-Policy "interest-cohort=()" always;
}
```

### Database Schema

We use PostGIS extension in Postgres because it is awesome. Other databases do not support it, so I have provided an adaptable script for managing database schema.

`package.json`:
```json
{
  "scripts": {
    "db:generate-schema": "node scripts/generate-schema.js",
    "db:push": "npm run db:generate-schema && npx prisma db push",
    "db:generate": "npm run db:generate-schema && npx prisma generate",
    "build": "npm run db:generate && next build"
  },
}
```

Run `npm run db:push` to generate the schema and push to the database you configured in `.env`.

Postgres will need indexes manually created for features that use extensions.

```sql
CREATE INDEX `idx_signal-location` ON signals USING GIST (signal_location);

CREATE INDEX `idx_signal-embedding`
ON signals
USING ivfflat (signal_embedding vector_cosine_ops)
WITH (lists = 100);
```
