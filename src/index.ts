#!/usr/bin/env node
import { startStdioServer } from "./mcp/server.js";

startStdioServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exit(1);
});
