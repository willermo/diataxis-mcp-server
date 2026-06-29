# Security Policy

## Reporting security issues

Please do not report security issues in public GitHub issues.

For now, report security concerns by opening a private security advisory on GitHub if available, or by contacting the maintainer directly through their GitHub profile.

Do not include secrets, tokens, private repository data, or sensitive logs in public issues or pull requests.

## Scope

This project is an MCP server that exposes deterministic documentation-audit tools over stdio.

Security-relevant reports may include:

- unsafe file-system behavior;
- accidental secret exposure;
- dependency vulnerabilities;
- MCP tool behavior that could mislead clients into unsafe actions;
- documentation or examples that encourage insecure configuration.

The server should not perform hidden file writes, network calls, telemetry, persistence, crawling, or destructive actions.