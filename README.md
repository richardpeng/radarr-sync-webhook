# Radarr Sync

Radarr Sync is a Radarr webhook that automatically adds downloaded Ultra-HD movies to another Radarr instance

## Requirements

- Two Radarr instances
- Node.js / Docker

## Setup

1. On your main Radarr instance, create a new webhook:
    1. Run "On Download" and "On Upgrade"
    1. URL should point to `/import`. For example, `http://localhost:3000/import`
    1. Method: `POST`
1. On your secondary Radarr instance, check only the resolutions you want to download in the `Any` profile and, optionally, set an appropriate cutoff.

## Usage

### Node.js

#### Installation

Install node modules: `npm install`

#### Running

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

#### Installation

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

#### Running

```
docker start radarr-sync
```
