import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  
  manifest:{
    content_scripts: [
    {
      "matches": ["*://www.linkedin.com/messaging/*"],
      "css": ["content-scripts/content.css"],
      "js": ["content-scripts/content.js"]
    }
  ],
}
});
