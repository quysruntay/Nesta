import { useEffect } from "react";

const CHECK_INTERVAL_MS = 60_000;
const LAST_RELOAD_KEY = "nesta:last-auto-reload-build";

/**
 * GitHub Pages + Vite:
 * Automatically reload an open tab when a new Vite build is deployed.
 * No need to edit vite.config.ts or the GitHub Actions workflow.
 */
function AutoUpdate() {
  useEffect(() => {
    // Only check the deployed site; Vite's dev server uses hot reload already.
    if (import.meta.env.DEV) return;

    let stopped = false;
    let checking = false;

    async function checkForUpdate() {
      if (stopped || checking || document.visibilityState === "hidden") return;

      // Don't interrupt someone currently typing in a form/search field.
      const focused = document.activeElement;
      if (
        focused instanceof HTMLElement &&
        focused.matches('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }

      // Vite's production index.html has a fingerprinted module JS file.
      const currentScript = document.querySelector<HTMLScriptElement>(
        'script[type="module"][src]',
      );
      if (!currentScript?.src) return;

      checking = true;
      try {
        const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
        const indexUrl = new URL("index.html", baseUrl);
        indexUrl.searchParams.set("_nesta_version_check", String(Date.now()));

        const response = await fetch(indexUrl.href, { cache: "no-store" });
        if (!response.ok || stopped) return;

        const html = await response.text();
        const remoteDoc = new DOMParser().parseFromString(html, "text/html");
        const remoteScript = remoteDoc.querySelector<HTMLScriptElement>(
          'script[type="module"][src]',
        );
        const remoteSrc = remoteScript?.getAttribute("src");
        if (!remoteSrc) return;

        const deployedScriptUrl = new URL(remoteSrc, baseUrl).href;
        if (deployedScriptUrl === currentScript.src) return;

        // A guard against continuous reloads if an older HTML page is cached.
        try {
          if (sessionStorage.getItem(LAST_RELOAD_KEY) === deployedScriptUrl) return;
          sessionStorage.setItem(LAST_RELOAD_KEY, deployedScriptUrl);
        } catch {
          // If browser storage is unavailable, don't risk a reload loop.
          return;
        }

        if (!stopped) window.location.reload();
      } catch {
        // Ignore offline/transient network failures; try again later.
      } finally {
        checking = false;
      }
    }

    // Check on initial load, every minute, and when returning to the tab.
    void checkForUpdate();
    const interval = window.setInterval(() => void checkForUpdate(), CHECK_INTERVAL_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void checkForUpdate();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}

export default AutoUpdate;
