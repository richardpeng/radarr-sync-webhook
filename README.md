# Radarr Sync Webhook

Radarr Sync Webhook adds downloaded Ultra-HD movies on a Radarr instance to another Radarr instance automatically.

## Requirements

- Two Radarr instances
- Node.js / Docker

## Usage

### Radarr Setup

1. On your main Radarr instance, create a new webhook:
    1. Run "On Download" and "On Upgrade"
    1. URL should point to `/import`. For example, `http://localhost:3000/import`
    1. Method: `POST`
1. On your secondary Radarr instance, check only the resolutions you want to download in the `Any` profile and, optionally, set an appropriate cutoff.

### Manual methods

In addition to the `/import` webhook, you can also trigger syncs manually.

#### `/import/:id`

Adds movie `id` from the main instance to the secondary instance. You can get a list of ids using the [API](https://github.com/Radarr/Radarr/wiki/API:Movie#get).

Example: `curl -XPOST http://localhost:3000/import/1`

#### `/import_all` 

Adds all Ultra-HD movies from the main instance to the secondary instance.

Example: `curl -XPOST http://localhost:3000/import_all`

## Installation

### Node.js

Install node modules: `npm install`

### Docker

Create Docker image:
```
docker create \
--name=radarr-sync \
-p 3000:3000 \
-e SRC_APIKEY=apikey \
-e DST_APIKEY=apikey \
-e SRC_ROOT="/my/UHD/Movies" \
-e DST_ROOT="/my/HD/Movies" \
-e SRC_HOST=http://localhost:7878 \
-e DST_HOST=http://localhost:9090 \
--restart unless-stopped \
radarr-sync:latest
```

## Running

### Node.js

```
PORT=3000 \
SRC_APIKEY=apikey \
DST_APIKEY=apikey \
SRC_ROOT="/my/UHD/Movies" \
DST_ROOT="/my/HD/Movies" \
SRC_HOST=http://localhost:7878 \
DST_HOST=http://localhost:9090 \
npm start
```

### Docker

```
docker start radarr-sync
```
