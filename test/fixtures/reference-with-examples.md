# Widget API reference

The Widget API reference describes endpoints, parameters, defaults, return values, and error codes.

## `createWidget(options)`

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Widget name |
| `mode` | `string` | `standard` | Allowed values: `standard`, `fast` |
| `timeout` | `number` | `30` | Timeout in seconds |

Returns: a widget record.

Raises: `WidgetConflictError` when the name already exists.

## Example

```ts
const widget = await client.createWidget({ name: "demo" });
```
