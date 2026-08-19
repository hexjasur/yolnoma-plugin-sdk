# @yolnoma/plugin-sdk

> Official SDK for building Yolnoma plugins.

This is a **Phase 1 architecture proof-of-concept**.

It establishes the plugin contract between plugin developers and the Yolnoma runtime.
It does **not** yet include the Yolnoma runtime, plugin installation, or `.yplugin` packaging.

---

## Table of Contents

1. [What are Yolnoma plugins?](#what-are-yolnoma-plugins)
2. [What is this SDK?](#what-is-this-sdk)
3. [Plugin structure](#plugin-structure)
4. [definePlugin()](#defineplugin)
5. [Lifecycle](#lifecycle)
6. [Navigation](#navigation)
7. [Routes](#routes)
8. [JSON Validator example](#json-validator-example)
9. [What is NOT implemented yet](#what-is-not-implemented-yet)

---

## What are Yolnoma plugins?

Yolnoma is a desktop application (Tauri-based) that allows developers to
extend its functionality through plugins.

Plugins are loaded from the local filesystem:

```
com.jksoftware.yolnoma-app/
└── plugins/
    ├── json-validator.yplugin
    └── my-custom-plugin.yplugin
```

A `.yplugin` is a packaged plugin bundle (similar to a ZIP).
It contains compiled JavaScript, metadata, and assets.

Plugins are sandboxed and interact with Yolnoma through the **Plugin API**
defined in this SDK.

---

## What is this SDK?

This SDK defines the **contract** between plugin developers and the Yolnoma runtime:

```
Plugin
   ↕
@yolnoma/plugin-sdk     ← this package
   ↕
Yolnoma Plugin Runtime  ← implemented inside Yolnoma
   ↕
Yolnoma App
```

The SDK is a **public** package.
The Yolnoma runtime is **private** and implements the SDK interfaces.

The SDK provides:
- `definePlugin()` — factory for defining a plugin
- `PluginAPI` — the interface the runtime provides to your plugin
- TypeScript types for everything

---

## Plugin structure

```
my-plugin/
├── src/
│   ├── index.ts          ← plugin entry (must export default from definePlugin())
│   ├── pages/
│   │   └── MainPage.tsx
│   └── ...
├── package.json
└── tsconfig.json
```

The entry file must have a default export produced by `definePlugin()`.

---

## definePlugin()

```ts
import { definePlugin } from "@yolnoma/plugin-sdk";

export default definePlugin({
  // ── Manifest ──────────────────────────────────────────
  id: "com.example.my-plugin",       // Reverse-DNS unique ID
  name: "My Plugin",                 // Human-readable name
  version: "0.1.0",                  // Semantic version
  description: "Does something useful.",
  author: { name: "Jane Dev", email: "jane@example.com" },

  // ── Lifecycle ─────────────────────────────────────────
  activate(api) {
    // Register pages and navigation here
    api.router.addRoute({ path: "/", component: MainPage });
    api.navigation.addItem({ label: "My Plugin", path: "/" });
  },

  deactivate() {
    // Optional cleanup (remove listeners, cancel timers, etc.)
  },
});
```

### Manifest fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✓ | Reverse-DNS unique identifier |
| `name` | `string` | ✓ | Human-readable display name |
| `version` | `string` | ✓ | Semantic version (e.g. `"0.1.0"`) |
| `description` | `string` | — | Short description |
| `author` | `string \| object` | — | Author name or `{ name, email?, url? }` |
| `entry` | `string` | — | Entry file path in bundle (default: `"index.js"`) |
| `minYolnomaVersion` | `string` | — | Minimum Yolnoma version required |
| `permissions` | `string[]` | — | Permissions the plugin requests |
| `icon` | `string` | — | Icon path relative to bundle root |

---

## Lifecycle

Yolnoma manages plugin lifecycle as follows:

```
load        → Yolnoma imports the plugin module
activate    → api.activate(pluginAPI) is called
               Plugin registers routes and navigation
deactivate  → api.deactivate() is called (if defined)
               Plugin cleans up resources
```

Your `activate()` function receives a `PluginAPI` object:

```ts
activate(api: PluginAPI) {
  // api.pluginId  → your plugin's ID
  // api.router    → RouterAPI
  // api.navigation → NavigationAPI
}
```

---

## Navigation

Register sidebar items with `api.navigation.addItem()`:

```ts
api.navigation.addItem({
  label: "My Plugin",   // Shown in sidebar
  path: "/",            // Plugin-relative path
  icon: <MyIcon />,     // Optional React element or URL string
});
```

Nested navigation:

```ts
api.navigation.addItem({
  label: "My Plugin",
  path: "/",
  children: [
    { label: "Dashboard", path: "/" },
    { label: "Settings",  path: "/settings" },
  ],
});
```

Paths are **plugin-relative**.
Yolnoma mounts them under `/plugin/<plugin-id>/`:

```
/plugin/com.example.my-plugin/
/plugin/com.example.my-plugin/settings
```

---

## Routes

Register pages with `api.router.addRoute()`:

```ts
api.router.addRoute({
  path: "/",
  component: MainPage,
  meta: { title: "My Plugin" },
});

api.router.addRoute({
  path: "/settings",
  component: SettingsPage,
  meta: { title: "Settings" },
});
```

Lazy loading is supported:

```ts
api.router.addRoute({
  path: "/heavy-page",
  component: React.lazy(() => import("./pages/HeavyPage")),
});
```

---

## JSON Validator example

See [`examples/json-validator/`](./examples/json-validator/).

This plugin demonstrates the full SDK contract:

```ts
// examples/json-validator/src/index.tsx

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

The validator reports:
- ✓ `Valid JSON` for correct input
- ✕ `Invalid JSON` with line, column, and source excerpt for errors

Error example output:
```
✕ Invalid JSON
Trailing comma before '}'
Line 3, column 18
…"name": "Jasur",↵}…
```

---

## What is NOT implemented yet

This is **Phase 1**. The following is intentionally out of scope:

| Feature | Status |
|---|---|
| Yolnoma runtime (loading plugins at runtime) | Not implemented — in private Yolnoma repo |
| `.yplugin` packaging/bundling | Not implemented — planned in `yolnoma-plugin-dev` |
| Plugin installation UI / Workshop | Not implemented |
| Plugin Store / marketplace | Not implemented |
| Plugin permissions enforcement | Not implemented |
| Filesystem / network API for plugins | Not implemented |
| Hot reload / dev server | Not implemented |
| Plugin signing / copyright protection | Not implemented |

These will be built incrementally in subsequent phases.

---

## Repository structure

```
yolnoma-plugin-sdk/
├── src/
│   ├── index.ts              ← public API exports
│   ├── types/
│   │   ├── api.ts            ← PluginAPI, RouterAPI, NavigationAPI
│   │   ├── plugin.ts         ← PluginManifest, PluginDefinition
│   │   ├── navigation.ts     ← NavigationItem
│   │   └── router.ts         ← RouteDefinition
│   └── plugin/
│       └── definePlugin.ts   ← definePlugin() factory
│
├── examples/
│   └── json-validator/       ← proof-of-concept plugin
│       ├── src/
│       │   ├── index.tsx
│       │   ├── pages/
│       │   │   └── ValidatorPage.tsx
│       │   └── lib/
│       │       └── jsonValidator.ts
│       ├── package.json
│       └── tsconfig.json
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## License

MIT — JK Software
