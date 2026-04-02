# Repository Guidelines

## Project Structure & Module Organization
This repository is a Vue 3 + Vite app for a Rust playground UI. Keep application code in `src/`: `App.vue` wires the page together, `components/` holds UI pieces such as `Editor.vue` and `Toolbar.vue`, and `composables/` contains reusable logic such as `usePlayground.js` and `useGist.js`. Place tests beside the related module under `src/composables/__tests__/`. Static files belong in `public/`, build output is generated in `dist/`, and `worker/index.js` contains the proxy worker used for playground API calls.

## Build, Test, and Development Commands
- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite dev server with local proxy rules from `vite.config.js`.
- `npm run build`: create the production bundle in `dist/`.
- `npm run preview`: serve the built app locally for a production-like check.
- `npx vitest run`: execute the test suite.
- `npx vitest`: run tests in watch mode during development.

## Coding Style & Naming Conventions
Follow the existing style: 2-space indentation, single quotes in JavaScript, and no semicolons unless required. Use Vue SFCs with `<script setup>` for components. Name components in PascalCase (`Output.vue`), composables in camelCase with a `use` prefix (`usePlayground.js`), and keep emitted events/props descriptive (`update:blockName`, `toggle-theme`). Prefer small, focused composables over adding API logic directly into components.

## Testing Guidelines
Vitest is the current test framework. Add tests for behavior changes in composables and other logic-heavy modules; mirror the source name with a `.test.js` suffix, for example `src/composables/__tests__/usePlayground.test.js`. Mock network calls with `vi.fn()` and assert request payloads, error handling, and state transitions. Run `npx vitest run` before opening a PR.

## Commit & Pull Request Guidelines
Recent history uses Conventional Commit prefixes such as `feat:` and `fix:`. Keep that format and write concise summaries, for example `feat: add gist import flow`. PRs should explain the user-visible change, list verification steps, and link any related issue. Include screenshots or short recordings for UI changes, and call out changes to `worker/`, `vite.config.js`, or deployment workflow behavior.

## Configuration & Deployment Notes
The app expects `VITE_PROXY_URL` when targeting a deployed proxy; otherwise it defaults to `https://play.rust-lang.org`. GitHub Pages deployment is defined in `.github/workflows/deploy.yml`, and the Vite base path is `/feishu-rust-playground/`. Keep those settings aligned when changing deployment targets.
