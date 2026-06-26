# ADR 0001: Browser 3D RPG Stack

- Status: Accepted
- Date: 2026-06-25

## Context

The project targets a desktop browser 3D exploration RPG that can eventually deploy to GitHub Pages. The README proposes TypeScript, Vite, Babylon.js, WebGL/WebGPU, Vitest, and Howler.js.

## Decision

Use the proposed stack as the accepted baseline:

- TypeScript for maintainable application code.
- Vite for development server and production builds.
- Babylon.js for rendering.
- Vitest for tests.
- Howler.js for audio.

ECS, physics, terrain, UI, and save data choices are separate Phase 1 decisions. They should be documented in focused ADRs before application scaffolding begins.

## Consequences

- The project starts with well-supported browser tooling.
- Rendering and audio have mature libraries from day one.
- ECS, physics, terrain, UI, and save choices remain deliberate decisions instead of accidental dependencies.
- GitHub Pages deployment should remain straightforward if routing and asset paths are handled carefully.
