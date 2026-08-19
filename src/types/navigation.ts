import type React from "react";

/**
 * A navigation item that a plugin registers in the Yolnoma sidebar.
 *
 * Plugins may register one or more items.
 * Items may optionally have nested children.
 */
export interface NavigationItem {
  /**
   * Plugin-relative path this item should navigate to.
   * e.g. "/" or "/settings"
   *
   * The Yolnoma runtime will prefix this with the plugin namespace:
   * /plugin/<plugin-id><path>
   */
  readonly path: string;

  /** Label shown in the sidebar */
  readonly label: string;

  /**
   * Optional icon.
   * Phase 1: accepts a React element or a URL string.
   * Future: may be expanded to support icon identifiers from Yolnoma's icon system.
   */
  readonly icon?: React.ReactNode | string;

  /** Optional nested items for sub-navigation */
  readonly children?: readonly NavigationItem[];
}
