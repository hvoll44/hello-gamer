# ADR 0001: Browser 3D RPG Stack

- Status: Proposed
- Date: 2026-06-25

## Context

The project targets a desktop browser 3D exploration RPG that can eventually deploy to GitHub Pages. The README proposes TypeScript, Vite, Babylon.js, WebGL/WebGPU, Vitest, and Howler.js.

## Decision

Use the proposed stack as the initial default:

- TypeScript for maintainable application code.
- Vite for development server and production builds.
- Babylon.js for rendering.
- Vitest for tests.
- Howler.js for audio.

Do not adopt an ECS, physics, terrain, or UI library until the architecture phase compares options and documents the tradeoffs.

## Consequences

- The project starts with well-supported browser tooling.
- Rendering and audio have mature libraries from day one.
- ECS, physics, terrain, and UI choices remain deliberate decisions instead of accidental dependencies.
- GitHub Pages deployment should remain straightforward if routing and asset paths are handled carefully.
