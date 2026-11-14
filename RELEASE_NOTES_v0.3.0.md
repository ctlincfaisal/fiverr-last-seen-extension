# Inbox Last Seen v0.3.0

A visual refresh for the unofficial, free Chrome extension that shows a locally observed buyer-activity timestamp in the browser toolbar popup.

### New in this release

- Modern dark popup design with green accents and extension icon.
- Exact local time with AM/PM and a friendly relative label, such as **3 days ago**.
- Clearer loading and troubleshooting states.
- Relative label stays up to date while the popup is open, without extra requests.
- GitHub README installation graphics, developer profile, contribution guidelines, and AI-agent instructions.

### Install

1. Download the ZIP source for this release and extract it.
2. In Chrome, open `chrome://extensions`, enable Developer mode, and click **Load unpacked**.
3. Select the extracted folder containing `manifest.json`.
4. Pin the extension using Chrome's Extensions (puzzle) menu.
5. Open a Fiverr inbox conversation normally and click the pinned icon.

**Existing users:** After replacing your local files with the new version, click **Reload** on the extension card in Chrome. Open a new Fiverr conversation normally after updating.

### Notes

- No automatic page reloads or extension-initiated Fiverr requests.
- No remote service or third-party analytics.
- The extension cannot recover older Network responses that occurred before its capture scripts ran.
- Unofficial, not endorsed by Fiverr. Use may conflict with Fiverr's rules.
