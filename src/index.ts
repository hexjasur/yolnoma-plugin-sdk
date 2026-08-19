/**
 * @yolnoma/plugin-sdk
 *
 * Official SDK for building Yolnoma plugins.
 *
 * ## Quick Start
 *
 * ```ts
 * import { definePlugin } from "@yolnoma/plugin-sdk";
 *
 * export default definePlugin({
 *   id: "com.example.my-plugin",
 *   name: "My Plugin",
 *   version: "0.1.0",
 *
 *   activate(api) {
 *     api.router.addRoute({ path: "/", component: MainPage });
 *     api.navigation.addItem({ label: "My Plugin", path: "/" });
 *   },
 * });
 * ```
 */

// ── Primary API ───────────────────────────────────────────────────────────────
export { definePlugin } from "./plugin/definePlugin.js";

// ── Types (re-exported for plugin authors) ────────────────────────────────────
export type { DefinePluginOptions } from "./plugin/definePlugin.js";
export type { PluginManifest, PluginDefinition } from "./types/plugin.js";
export type { PluginAPI, RouterAPI, NavigationAPI } from "./types/api.js";
export type { RouteDefinition } from "./types/router.js";
export type { NavigationItem } from "./types/navigation.js";
