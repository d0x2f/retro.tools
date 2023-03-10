import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 15000,
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:4173',
  },
})
