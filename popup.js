const statusEl = document.getElementById('status');
const stateIcon = document.getElementById('state-icon');
const resultEl = document.getElementById('result');
const dateEl = document.getElementById('date');
const relativeEl = document.getElementById('relative');
const detailEl = document.getElementById('detail');
const helpEl = document.getElementById('help');
const retryBtn = document.getElementById('retry');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let refreshTimer = null;

function formatExact(date) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  }).format(date);
}

function formatRelative(date) {
  const seconds = (date.getTime() - Date.now()) / 1000;
  const abs = Math.abs(seconds);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (abs < 45) return 'just now';
  const units = [
    ['year', 365 * 24 * 3600],
    ['month', 30 * 24 * 3600],
    ['week', 7 * 24 * 3600],
    ['day', 24 * 3600],
    ['hour', 3600],
    ['minute', 60]
  ];
  const [unit, divisor] = units.find(([, divisor]) => abs >= divisor) || ['minute', 60];
  const amount = Math.round(seconds / divisor);
  const label = formatter.format(amount || (seconds < 0 ? -1 : 1), unit);
  return label === '1 minute ago' ? 'a minute ago' : label;
}

function setStatus(message, tone = '') {
  statusEl.textContent = message;
  stateIcon.className = `state-icon${tone ? ` ${tone}` : ''}`;
}

function showError(message, help = '') {
  setStatus(message, 'error');
  resultEl.hidden = true;
  detailEl.textContent = '';
  helpEl.textContent = help;
  helpEl.hidden = !help;
  retryBtn.hidden = false;
}

async function load() {
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  retryBtn.hidden = true;
  resultEl.hidden = true;
  helpEl.hidden = true;
  detailEl.textContent = '';
  setStatus('Checking current conversation…');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url;
  try { url = new URL(tab?.url || ''); } catch { /* invalid or unavailable URL */ }
  if (!url || !['fiverr.com', 'www.fiverr.com', 'pro.fiverr.com'].includes(url.hostname) || !/^\/inbox\/[^/]+/.test(url.pathname)) {
    showError('Open a Fiverr inbox conversation first.', 'Select a buyer conversation in Fiverr, then click this extension icon.');
    return;
  }

  // Only ask the existing content script for a locally captured timestamp.
  // No page reload and no extension-initiated network request.
  for (let i = 0; i < 8; i++) {
    let response;
    try {
      response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_LAST_SEEN' });
    } catch {
      showError('Capture is not active on this page yet.', 'Open another inbox conversation normally, then check again.');
      return;
    }
    if (response?.route === url.pathname && response?.data) {
      const { lastSeen, capturedAt } = response.data;
      const date = new Date(lastSeen);
      if (!Number.isFinite(date.getTime())) break;
      setStatus('Last activity found', 'success');
      dateEl.textContent = formatExact(date);
      relativeEl.textContent = formatRelative(date);
      resultEl.hidden = false;
      const capture = new Date(capturedAt);
      detailEl.textContent = Number.isFinite(capture.getTime())
        ? `Your local time · Captured ${formatExact(capture)}`
        : 'Your local time';
      // Update the relative display while popup stays open; no network use.
      refreshTimer = setInterval(() => {
        relativeEl.textContent = formatRelative(date);
      }, 30000);
      return;
    }
    await sleep(350);
  }
  showError('No timestamp captured for this conversation.',
    'Chrome cannot recover past Network response bodies. Open another conversation normally while the extension is enabled.');
}

retryBtn.addEventListener('click', () => { load().catch(error => showError(error.message || 'Unable to read this page.')); });
load().catch(error => showError(error.message || 'Unable to read this page.'));
