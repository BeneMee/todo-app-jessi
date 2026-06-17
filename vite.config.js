import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Unique id for every build. It is both baked into the app bundle (via
// `define`) and written to a standalone version.json, so the running app
// can detect when a newer version has been deployed.
const buildId = Date.now().toString()

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'emit-version-json',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'version.json',
          source: JSON.stringify({ buildId }),
        })
      },
    },
  ],
  base: '/todo-app-jessi/',
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
  },
})
