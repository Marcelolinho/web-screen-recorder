import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['scripting', 'tabs', 'activeTab', 'tabCapture', 'offscreen', 'webRequest'],
    host_permissions: ['<all_urls>'],
  },
});
