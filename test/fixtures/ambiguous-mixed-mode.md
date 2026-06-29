# Getting started and API reference

In this tutorial, you will deploy the service and review the API reference.

1. Install the CLI.
2. Deploy the service.
3. Verify the endpoint.

## Configuration reference

| Option | Default | Description |
| --- | --- | --- |
| `REGION` | `us-east-1` | Deployment region |
| `RETRIES` | `3` | Retry count |

## Why deployments are staged

Deployments are staged because rollback safety matters. The design favors predictable recovery over raw speed.
