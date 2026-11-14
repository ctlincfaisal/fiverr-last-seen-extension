# Instructions for AI coding agents

Read README.md first. This is an unofficial Chrome Manifest V3 extension for observing a timestamp already delivered in a normal Fiverr inbox page request.

## Hard requirements
- NEVER initiate a Fiverr API request, reload a Fiverr page, poll buyer activity, automate messaging, or bypass robot verification.
- Never add a third-party analytics service, remote telemetry, password handling, token scraping, or persistent storage of buyers' activity.
- Keep activity data local to the browser tab and display it only in the toolbar popup.
- Do not claim the extension is approved by Fiverr or that use is risk-free.
- Review permissions and disclose any changes that increase their scope.

## Installation task
1. Clone repository to a stable local directory.
2. Inspect manifest.json and source; explain risks before enabling it.
3. Validate the manifest JSON and JavaScript syntax, if tools are available.
4. Tell user the absolute path containing manifest.json.
5. Instruct user: chrome://extensions → Developer mode → Load unpacked → select that directory.
6. Do not assert installation or successful live capture unless directly verified.
7. If no access to user's local Chrome, clearly explain the manual action necessary.

## Technical limitations
A standard popup cannot access previous DevTools network response bodies. This extension intercepts normal page-initiated Fetch/XHR responses using a MAIN-world script, publishes a minimal timestamp to an ISOLATED content script, and returns a route-specific timestamp to the popup. It may fail if Fiverr changes APIs or routes, or changes the page timing.
