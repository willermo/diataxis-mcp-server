import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const binPath = resolve("dist/index.js");
const stat = statSync(binPath);

if (!stat.isFile()) {
  throw new Error("dist/index.js exists but is not a file");
}

const firstLine = readFileSync(binPath, "utf8").split(/\r?\n/, 1)[0];

if (firstLine !== "#!/usr/bin/env node") {
  throw new Error("dist/index.js is missing the Node shebang required by the npm bin entry");
}

console.log("Verified dist/index.js bin entry");
