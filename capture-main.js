// Observe only responses already initiated by the Fiverr page. No network calls.
(() => {
  if (window.__localLastSeenCaptureInstalled) return;
  window.__localLastSeenCaptureInstalled = true;

  function matchesInfo(url) {
    try {
      const parsed = new URL(url, location.href);
      return parsed.hostname.endsWith('fiverr.com') && /(^|\/)info\/?$/.test(parsed.pathname);
    } catch { return false; }
  }

  function publish(body, url, route) {
    if (!matchesInfo(url) || !route.startsWith('/inbox/')) return;
    try {
      const obj = typeof body === 'string' ? JSON.parse(body) : body;
      if (obj && Number.isFinite(obj.lastSeen) && obj.lastSeen > 0) {
        document.dispatchEvent(new CustomEvent('__localLastSeenCaptured', {
          detail: { lastSeen: obj.lastSeen, route }
        }));
      }
    } catch { /* Ignore non-JSON responses. */ }
  }

  const nativeFetch = window.fetch;
  window.fetch = function(...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
    const route = location.pathname;
    const promise = Reflect.apply(nativeFetch, this, args);
    if (matchesInfo(url)) {
      promise.then(response => {
        response.clone().text().then(body => publish(body, url, route)).catch(() => {});
      }).catch(() => {});
    }
    return promise;
  };

  const nativeOpen = XMLHttpRequest.prototype.open;
  const nativeSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    this.__localLastSeenUrl = String(url);
    return Reflect.apply(nativeOpen, this, [method, url, ...rest]);
  };
  XMLHttpRequest.prototype.send = function(...args) {
    const url = this.__localLastSeenUrl;
    const route = location.pathname;
    if (matchesInfo(url)) {
      this.addEventListener('load', function() {
        try {
          if (!this.responseType || this.responseType === 'text') publish(this.responseText, url, route);
          else if (this.responseType === 'json') publish(this.response, url, route);
        } catch { /* Ignore unsupported response types. */ }
      }, { once: true });
    }
    return Reflect.apply(nativeSend, this, args);
  };
})();
