# FAQ

Q: Where are requests stored?

A: The app stores snapshots in `localStorage` and attempts to persist them to your configured backend. When the backend is unavailable it continues to work locally.

Q: How do I package a desktop app?

A: Use the `package` script (electron-builder). See `package.json` for build scripts and `release/build` for generated installers.

Q: How can I add authentication headers by default?

A: You can add default headers in the request editor or extend the app to include workspace-level default headers in future updates.
