// Content script maintains only timestamps, in memory in this tab. No remote storage.
(() => {
  const byRoute = new Map();
  document.addEventListener('__localLastSeenCaptured', event => {
    const { route, lastSeen } = event.detail || {};
    if (typeof route === 'string' && /^\/inbox\/[^/]+/.test(route) && Number.isFinite(lastSeen)) {
      byRoute.set(route, { lastSeen, capturedAt: Date.now() });
    }
  });
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== 'GET_LAST_SEEN') return;
    sendResponse({ route: location.pathname, data: byRoute.get(location.pathname) || null });
  });
})();
