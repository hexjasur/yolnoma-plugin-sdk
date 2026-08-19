import type React from "react";

/**
 * A route that a plugin registers.
 *
 * The plugin uses plugin-relative paths (e.g. "/" or "/settings").
 * The Yolnoma runtime mounts these under the plugin namespace:
 * /plugin/<plugin-id><path>
 */
export interface RouteDefinition {
  /**
   * Plugin-relative path.
   * e.g. "/", "/formatter", "/settings"
   */
  readonly path: string;

  /**
   * The React component to render for this route.
   *
   * May be lazy-loaded: () => import("./pages/Settings")
   */
  readonly component: React.ComponentType;

  /** Optional route metadata */
  readonly meta?: {
    /** Human-readable title for this page */
    readonly title?: string;
  };
}
