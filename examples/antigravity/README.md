# Antigravity MCP configuration example

Use this as a generic local stdio MCP configuration placeholder. Replace `<absolute-path-to-checkout>` with the absolute path to your checkout and adapt the surrounding file format to your client.

Build before using the local `dist/index.js` configuration:

```sh
npm run build
```

## Local built server

```json
{
  "mcpServers": {
    "diataxis": {
      "command": "node",
      "args": ["<absolute-path-to-checkout>/dist/index.js"]
    }
  }
}
```

## Future npm package

This configuration is valid only after `diataxis-mcp-server` is published to npm.

```json
{
  "mcpServers": {
    "diataxis": {
      "command": "npx",
      "args": ["diataxis-mcp-server"]
    }
  }
}
```
