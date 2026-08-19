# JSON Validator — Example Yolnoma Plugin

> A proof-of-concept plugin built with `@yolnoma/plugin-sdk`.

This plugin validates JSON input and reports precise error diagnostics including:
- Line and column number
- Human-readable error message
- Source excerpt around the error location

## Purpose

This example exists to prove that the `@yolnoma/plugin-sdk` architecture works
for a real, useful tool — **before** the Yolnoma runtime or `.yplugin` build
tooling is implemented.

## Plugin entry

```ts
// src/index.tsx
import { definePlugin } from "@yolnoma/plugin-sdk";
import { ValidatorPage } from "./pages/ValidatorPage";

export default definePlugin({
  id: "com.jksoftware.json-validator",
  name: "JSON Validator",
  version: "0.1.0",
  description: "Validate and inspect JSON with precise error reporting.",
  author: { name: "JK Software" },

  activate(api) {
    api.router.addRoute({ path: "/", component: ValidatorPage });
    api.navigation.addItem({ label: "JSON Validator", path: "/" });
  },
});
```

## Validator behaviour

### Valid input

```json
{
  "name": "Jasur",
  "age": 20
}
```

Output:
```
✓ Valid JSON
```

### Invalid input — syntax error

```json
{
  "name": "Jasur",
  "age": 20,
}
```

Output:
```
✕ Invalid JSON
Trailing comma before '}'
Line 4, column 14
…"age": 20,↵}
```

### Invalid input — unquoted key

```json
{
  name: "Jasur"
}
```

Output:
```
✕ Invalid JSON
Unquoted key 'name' — JSON keys must be double-quoted strings
Line 2, column 3
name: "Jasur"
```

## Error detection capabilities

The validator can detect:

| Error type | Detected |
|---|---|
| Syntax errors (unexpected token) | ✓ |
| Trailing commas | ✓ |
| Unquoted keys | ✓ |
| Single-quoted strings | ✓ |
| JavaScript comments (`//`, `/* */`) | ✓ |
| Line + column position | ✓ |
| Source excerpt around error | ✓ |

## File structure

```
json-validator/
├── src/
│   ├── index.tsx               ← Plugin entry — definePlugin()
│   ├── pages/
│   │   └── ValidatorPage.tsx   ← Main UI component
│   └── lib/
│       └── jsonValidator.ts    ← Validation logic
├── package.json
├── tsconfig.json
└── README.md
```
