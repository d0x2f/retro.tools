import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 15000,
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'firefox') {
          // Firefox doesn't auto-download files; configure it to save
          // directly to the Cypress downloads folder without prompting.
          launchOptions.preferences['browser.download.folderList'] = 2;
          launchOptions.preferences['browser.download.dir'] =
            config.downloadsFolder;
          launchOptions.preferences[
            'browser.helperApps.neverAsk.saveToDisk'
          ] =
            'text/csv,application/octet-stream,application/yaml,text/yaml,text/plain,application/x-yaml';
          launchOptions.preferences['pdfjs.disabled'] = true;
        }
        return launchOptions;
      });
    },
  },
});
