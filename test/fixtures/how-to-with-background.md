# How to configure cache storage

This guide shows how to configure cache storage for production.

1. Set the cache backend.
2. Configure the cache size.
3. Restart the service.
4. Verify the cache status.

```sh
service config set cache.backend redis
service config set cache.size 512mb
service restart
```

## Background

The cache exists because repeated reads can overload the database.

A useful mental model is to treat cache storage as a temporary acceleration layer. This trade-off matters when stale reads are more acceptable than extra database load.
