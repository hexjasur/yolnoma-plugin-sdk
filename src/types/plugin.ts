import type { NavigationItem } from "./navigation.js";
import type { RouteDefinition } from "./router.js";
import type { PluginAPI } from "./api.js";

/**
 * Plugin manifest — static metadata embedded in the plugin.
 * This is what the Yolnoma runtime reads to understand a plugin
 * before activating it.
 */
export interface PluginManifest {
  /** Reverse-DNS identifier. e.g. "com.example.json-validator" */
  readonly id: string;
  /** Human-readable display name */
  readonly name: string;
  /** Semantic version string. e.g. "0.1.0" */
  readonly version: string;
  /** Short description shown in the plugin list */
  readonly description?: string | undefined;
  /** Author name or object */
  readonly author?: string | { name: string; email?: string; url?: string } | undefined;
  /**
   * Relative path to the plugin entry point within the .yplugin bundle.
   * Defaults to "index.js" if omitted.
   */
  readonly entry?: string | undefined;

  // ── Future fields (not required in Phase 1) ──────────────────────────────
  /** Minimum Yolnoma version required (semver range). e.g. ">=1.0.0" */
  readonly minYolnomaVersion?: string | undefined;
  /** Permissions the plugin requests. e.g. ["filesystem:read"] */
  readonly permissions?: readonly string[] | undefined;
  /** Icon path relative to bundle root */
  readonly icon?: string | undefined;
}

/**
 * The complete plugin definition returned by definePlugin().
 *
 * A plugin is a manifest + optional lifecycle hooks.
 *
 * The Yolnoma runtime receives this object when it loads a plugin.
 */
export interface PluginDefinition {
  readonly manifest: PluginManifest;

  /**
   * Called when Yolnoma activates the plugin.
   * The plugin should register its routes and navigation items here.
   *
   * @param api - The PluginAPI instance provided by the Yolnoma runtime.
   */
  activate(api: PluginAPI): void | Promise<void>;

  /**
   * Called when Yolnoma deactivates the plugin (e.g. user disables it).
   * The plugin should clean up any side effects here.
   */
  deactivate?: (() => void | Promise<void>) | undefined;
}
