import type { PluginManifest, PluginDefinition } from "../types/plugin.js";
import type { PluginAPI } from "../types/api.js";

/**
 * Options accepted by definePlugin().
 *
 * Combines the plugin manifest fields with lifecycle hooks in a single object
 * for a clean developer experience.
 */
export interface DefinePluginOptions extends PluginManifest {
  /**
   * Called when Yolnoma activates the plugin.
   *
   * Register routes and navigation items here.
   *
   * @param api - The Yolnoma runtime-provided plugin API.
   *
   * @example
   * activate(api) {
   *   api.router.addRoute({ path: "/", component: MainPage });
   *   api.navigation.addItem({ label: "My Plugin", path: "/" });
   * }
   */
  activate(api: PluginAPI): void | Promise<void>;

  /**
   * Optional: called when Yolnoma deactivates the plugin.
   *
   * Clean up any listeners, timers, or allocated resources here.
   */
  deactivate?(): void | Promise<void>;
}

/**
 * Define a Yolnoma plugin.
 *
 * This is the primary entry point for plugin developers.
 *
 * @param options - Plugin manifest + lifecycle hooks.
 * @returns A PluginDefinition that Yolnoma runtime can load and activate.
 *
 * @example
 * import { definePlugin } from "@yolnoma/plugin-sdk";
 *
 * export default definePlugin({
 *   id: "com.example.json-validator",
 *   name: "JSON Validator",
 *   version: "0.1.0",
 *   description: "Validate and inspect JSON in real time.",
 *
 *   activate(api) {
 *     api.router.addRoute({ path: "/", component: ValidatorPage });
 *     api.navigation.addItem({ label: "JSON Validator", path: "/" });
 *   },
 * });
 */
export function definePlugin(options: DefinePluginOptions): PluginDefinition {
  const { activate, deactivate, ...manifest } = options;

  return {
    manifest,
    activate,
    ...(deactivate !== undefined ? { deactivate } : {}),
  };
}
