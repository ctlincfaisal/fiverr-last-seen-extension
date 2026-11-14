# Contributing

Thanks for helping improve Inbox Last Seen! Please open a GitHub Issue describing a bug or proposed enhancement before larger changes.

## Local development

1. Clone the repository.
2. Review `manifest.json`, `AGENTS.md`, and the source files.
3. Open `chrome://extensions`, turn on Developer mode, and select **Load unpacked**.
4. Choose the repository folder containing `manifest.json`.
5. After source changes, click **Reload** on the extension card in Chrome; then use an inbox conversation normally to check functionality.
6. Keep bug reports free of client names, private messages, session tokens, and other personal data.

## Requirements for pull requests

- Do not introduce an auto-reload or extension-initiated Fiverr requests.
- Do not add analytics, remote telemetry, third-party backends, or persistent buyer tracking.
- Do not attempt to bypass CAPTCHA or Fiverr platform protections.
- Keep the timestamp display inside the Chrome popup.
- Do not add or expand permissions without clear explanation and discussion.
- Test basic popup states (loading, no data, successful capture) before submitting.

Submit a pull request with a brief summary, screenshots for visible changes, and testing notes.
