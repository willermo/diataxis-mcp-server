# Release the package

This guide describes the manual release process for `diataxis-mcp-server`.

Use it when preparing an experimental `0.x` release.

## Prerequisites

- `main` is protected.
- CI is green.
- The working tree is clean.
- The release commit is already merged to `main`.
- You have npm publish permissions for the package.

## Check the package locally

From the repository root:

```sh
npm run build
npm test
npm pack --dry-run
npm publish --dry-run
```

Check that the package includes:

- `dist/`
- `examples/`
- `LICENSE`
- `LICENSE-CODE.md`
- `LICENSE-CONTENT.md`
- `LICENSING.md`
- `NOTICE.md`
- `README.md`
- `package.json`

Check that the package does not include:

- `node_modules/`
- `coverage/`
- `references/`
- `.env`
- local private files

## Create the tag

```sh
git checkout main
git pull --ff-only origin main
git tag -a v0.1.0 -m "v0.1.0"
git push origin v0.1.0
```

## Create the GitHub release

Create a GitHub release from the tag.

Suggested title:

```text
v0.1.0 - Diataxis MCP server MVP
```

Suggested notes:

```text
Initial MVP release of diataxis-mcp-server.

Includes:
- deterministic Diataxis classification;
- page audit;
- documentation tree audit;
- advisory refactor planning;
- documentation set planning;
- MCP tools, resources, and prompts;
- IDE configuration examples;
- split licensing and Diataxis attribution;
- self-audit sample outputs.

This release is experimental. Outputs are advisory and should be reviewed by maintainers before applying documentation refactors.
```

## Publish to npm

Only publish when ready to make the package installable through npm and usable via `npx`.

```sh
npm login
npm publish --access public
```

After publishing, update README and IDE examples so the npm-based configuration is no longer described as future-only.
