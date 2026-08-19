import { definePlugin } from "@yolnoma/plugin-sdk";
import { ValidatorPage } from "./pages/ValidatorPage.js";

/**
 * JSON Validator Plugin
 *
 * A proof-of-concept Yolnoma plugin that validates JSON input
 * with precise error location (line, column, excerpt).
 *
 * This plugin demonstrates:
 * - How to define a plugin using definePlugin()
 * - How to register routes with api.router.addRoute()
 * - How to register navigation items with api.navigation.addItem()
 */
export default definePlugin({
  id: "com.jksoftware.json-validator",
  name: "JSON Validator",
  version: "0.1.0",
  description: "Validate and inspect JSON with precise error reporting.",
  author: { name: "JK Software" },

  activate(api) {
    // Register the main validator page at the plugin root
    api.router.addRoute({
      path: "/",
      component: ValidatorPage,
      meta: { title: "JSON Validator" },
    });

    // Register a single sidebar entry pointing to the validator
    api.navigation.addItem({
      label: "JSON Validator",
      path: "/",
    });
  },
});
