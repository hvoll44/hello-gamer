# ADR 0004: UI Strategy

- Status: Accepted
- Date: 2026-06-25

## Context

The MVP needs menus, overlays, inventory display, interaction prompts, and save/load UI. These are screen-space interfaces that should observe game state and send commands through stable boundaries. UI must remain independent from gameplay internals and should not become a reason to couple gameplay to Babylon.js.

## Options Considered

- DOM and CSS overlays: native browser layout, strong accessibility path, simple text and menu handling, no additional runtime dependency, and a good fit for GitHub Pages.
- Babylon GUI: useful for canvas-bound HUDs, in-world labels, or XR-style UI, but heavier and less natural for menus and text-heavy overlays.
- React or another UI framework: strong component model for complex UI, but premature before UI complexity justifies the dependency and architectural commitment.
- `react-babylonjs`: useful for declarative scene and UI integration, but it would change the rendering architecture before the project has app code.

## Decision

Use DOM/CSS overlays as the initial UI strategy.

The UI layer should:

- Render above the Babylon canvas.
- Read a dedicated UI view state or projection of game state.
- Send typed commands to game systems instead of mutating internals.
- Keep UI state separate from engine state, gameplay state, and persistence.
- Avoid direct dependencies from gameplay systems to DOM APIs.

Babylon GUI remains reserved for future in-world labels, canvas-bound widgets, or XR-like needs. A framework such as React can be reconsidered if menus, settings, accessibility flows, or tooling complexity outgrow a small DOM UI layer.

## Upgrade Triggers

Revisit Babylon GUI when UI must be rendered inside the 3D scene, attached to meshes, or tightly synchronized with canvas scaling. Revisit React or another framework when the UI grows enough that hand-rolled DOM rendering harms maintainability.

## Consequences

- Phase 2 can create a simple UI boundary without a UI dependency.
- Menus and overlays stay accessible to browser tooling and CSS.
- Gameplay remains decoupled from DOM and Babylon GUI implementation details.
- Future framework adoption remains possible behind the same state and command boundary.
