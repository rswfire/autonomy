# @rswfire/builtwithautonomy.com

[![Next.js](https://img.shields.io/badge/Next.js-16.0-blue)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-orange)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-brightgreen)](https://www.prisma.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Developer](https://img.shields.io/badge/Creator-@rswfire-red)](https://rswfire.com/handshake)

## Setup Documentation

### Prerequisites

- **Node.js** 18+ and npm.
- **PostgreSQL** 14+ with PostGIS extension.
    - OR **MySQL** 8+ (with reduced geospatial features).
- **nginx** (for production).
- **systemd** (for service management).

---

## Installation

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/rswfire/autonomy.git
cd builtwithautonomy.com
npm install
```

### 2. Environment Configuration

Create `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/autonomy"
# For MySQL: DATABASE_URL="mysql://user:password@localhost:3306/autonomy"

# Application
NODE_ENV=production
PORT=3000

# See `.env.example` for other variables.
```

### 3. Database Setup

**Generate schema and push to database:**

```bash
npm run db:push
```

This auto-detects your database type (PostgreSQL/MySQL) and generates the appropriate schema.

**For PostgreSQL with PostGIS, create indexes manually:**

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Geospatial index
CREATE INDEX idx_signal_location 
ON signals 
USING GIST (signal_location);

-- Vector similarity index (requires pgvector extension)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE INDEX idx_signal_embedding
ON signals
USING ivfflat (signal_embedding vector_cosine_ops)
WITH (lists = 100);
```

**For MySQL, indexes are created automatically via Prisma.**

### 4. Create Owner Account

**Run the setup script to create your owner account:**

```bash
npm run create-owner
```

Follow the prompts to set:
- Email address
- Name (optional)
- Password (minimum 8 characters, must include uppercase, lowercase, number, and special character)

**⚠️ Security Note:** This script shows the password on screen. Run this only via SSH/console on the server. This is a one-time setup operation.

### 5. Build Application

```bash
npm run build
```

---

## Running the Application

### Development Mode

```bash
npm run dev
```

Access at `http://localhost:3000`

### Production Mode

**Option 1: Direct (testing)**

```bash
npm run start
```

**Option 2: systemd Service (recommended)**

Create service file:

```bash
sudo nano /etc/systemd/system/builtwithautonomy.service
```

```ini
[Unit]
Description=Autonomy Platform - builtwithautonomy.com
After=network.target postgresql.service
# Or: After=network.target mysql.service

[Service]
Type=simple
User=rswfire
WorkingDirectory=/home/rswfire/www/builtwithautonomy.com
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

# Environment
Environment=NODE_ENV=production
Environment=PORT=3000

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=read-only
ReadWritePaths=/home/rswfire/www/builtwithautonomy.com

[Install]
WantedBy=multi-user.target
```

**Enable and start:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable builtwithautonomy
sudo systemctl start builtwithautonomy
```

**Check status:**

```bash
sudo systemctl status builtwithautonomy
sudo journalctl -u builtwithautonomy -f
```

---

## nginx Configuration

**Create nginx config:**

```bash
sudo nano /etc/nginx/sites-available/builtwithautonomy.com
```

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name builtwithautonomy.com www.builtwithautonomy.com;
    return 301 https://builtwithautonomy.com$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name builtwithautonomy.com;

    # SSL certificates (use certbot/letsencrypt)
    ssl_certificate /etc/letsencrypt/live/builtwithautonomy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/builtwithautonomy.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Optional: HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Privacy headers
    add_header Permissions-Policy "interest-cohort=()" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffering
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: Serve static files directly
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 60m;
        proxy_cache_bypass $http_cache_control;
        add_header Cache-Control "public, max-age=3600, immutable";
    }
}
```

**Enable and test:**

```bash
sudo ln -s /etc/nginx/sites-available/builtwithautonomy.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Security Considerations

1. **Authentication**: All mutations require OWNER role.
2. **Visibility**: Read operations filtered by user role + signal visibility.
3. **Passwords**: Bcrypt hashed with 10 rounds.
4. **IDs**: ULIDs prevent enumeration attacks.
5. **Environment**: Never commit `.env` file.
6. **HTTPS**: Always use SSL in production.
7. **Headers**: Privacy and security headers in nginx config.

---

> [Readme](/docs/readme.md) | [Roadmap](/docs/roadmap.md) | [Setup](/docs/setup.md) | [Myth](/docs/myth.md)
