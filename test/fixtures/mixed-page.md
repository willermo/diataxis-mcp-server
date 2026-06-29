# Deploy with Docker

This guide shows how to deploy the service with Docker.

1. Build the image.
2. Run the container.
3. Verify the health endpoint.

```sh
docker build -t service .
docker run service
```

## Configuration options

| Option | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `LOG_LEVEL` | `info` | Logging detail |

## Why this works

The image uses a small runtime base because startup time matters more than shell tooling.
