import type { NavigationItem } from "./navigation.js";
import type { RouteDefinition } from "./router.js";

/**
 * The RouterAPI — provided to the plugin during activation.
 *
 * The Yolnoma runtime implements this interface.
 * The SDK only defines the contract.
 */
export interface RouterAPI {
  /**
   * Register a route owned by this plugin.
   *
   * @param route - Route definition with a plugin-relative path.
   *
   * @example
   * api.router.addRoute({ path: "/", component: ValidatorPage });
   * api.router.addRoute({ path: "/settings", component: SettingsPage });
   */
  addRoute(route: RouteDefinition): void;
}

/**
 * The NavigationAPI — provided to the plugin during activation.
 *
 * Allows the plugin to add items to the Yolnoma sidebar.
 */
export interface NavigationAPI {
  /**
   * Register a navigation item in the Yolnoma sidebar.
   *
   * @param item - Navigation item with a plugin-relative path.
   *
   * @example
   * api.navigation.addItem({ label: "JSON Validator", path: "/" });
   */
  addItem(item: NavigationItem): void;
}

/**
 * The PluginAPI — the complete API object passed to plugin.activate().
 *
 * This is the ONLY object through which a plugin interacts with Yolnoma.
 *
 * The Yolnoma runtime creates and provides this object.
 * The SDK defines what it must contain.
 *
 * Future APIs (filesystem, events, preferences, etc.) will be added here
 * as new namespaces.
 */
export interface PluginAPI {
  /** The ID of the plugin being activated */
  readonly pluginId: string;

  /** Router API for registering plugin pages */
  readonly router: RouterAPI;

  /** Navigation API for registering sidebar items */
  readonly navigation: NavigationAPI;
}
