# Built preview - do not edit here

This branch holds a **built static export** of the app's web target,
deployed via GitHub Pages, for previewing in a browser without any local
setup: https://expressrecruitment.github.io/websiteapp/

It's generated from the `main` branch (`npx expo export --platform web`,
then patched to resolve correctly under the `/websiteapp/` subpath GitHub
Pages serves project sites from). It is **not** the source code - go to
the `main` branch for that.

Notes on this preview specifically:

- It's the **web** build (React Native Web), not a native iOS/Android
  build - it's a close approximation of the real app, useful for
  clicking through the UI and flows, but a few things behave differently
  than on-device (e.g. document/file pickers use the browser's picker,
  "open browser" actions open a new tab instead of an in-app browser).
- Client-side navigation works (clicking through screens); a hard
  refresh or a shared link to a sub-page may not resolve correctly,
  since GitHub Pages project sites don't support the same routing a real
  server would - it's a static-hosting workaround, not a limitation of
  the app itself.
- To see the real thing (native, on a phone): clone `main`, run
  `npm install && npm start`, and open it in Expo Go. See that branch's
  README for details.

This branch is redeployed by re-running the export + patch step and
force-pushing here - it isn't meant to accumulate history.
