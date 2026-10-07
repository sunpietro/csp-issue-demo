import { defineConfig } from '@playwright/test'

// Runs against a production build with the policy enforced - the combination
// that local development usually skips.
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    channel: 'chrome',
  },
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
