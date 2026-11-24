import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    web_accessible_resources: [
      { resources: ['scripts/injectFetch.ts'], matches: ['<all_urls>'] },
    ]
  }
});
