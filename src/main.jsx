import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// On GitHub Pages the index.html (and thus the references to the hashed
// JS/CSS bundles) can be served from cache for a while after a new deploy.
// We fetch version.json without using the cache and, if a newer build is
// available, force a one-time reload so the freshest assets are loaded.
async function ensureLatestVersion() {
  const RELOAD_KEY = 'reloadedForBuild'
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}version.json`, {
      cache: 'no-store',
    })
    if (!res.ok) return
    const { buildId } = await res.json()
    if (!buildId || buildId === __BUILD_ID__) return

    // Guard against reload loops: only reload once per deployed build.
    if (sessionStorage.getItem(RELOAD_KEY) === buildId) return
    sessionStorage.setItem(RELOAD_KEY, buildId)
    window.location.reload()
  } catch {
    // Offline or fetch failed — keep running with what we have.
  }
}

ensureLatestVersion()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
