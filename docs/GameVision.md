# Game Vision

## Intent

Build a browser-based 3D exploration RPG inspired by the feeling of discovery, mystery, and spatial curiosity found in games like Tunic, without cloning its mechanics, story, art, or combat loop.

The project should become a reusable open-source foundation for future browser games, not a one-off prototype.

## Design Pillars

- Exploration over combat: movement, discovery, traversal, secrets, and environmental interaction are the core verbs.
- Procedural but authored-feeling: generated spaces should support landmarks, readable paths, and intentional surprises.
- Systems first: gameplay features should emerge from composable engine and game modules.
- Browser native: the game should run well in desktop browsers and eventually deploy to GitHub Pages.
- Maintainable by others: architecture, tests, and documentation should make contribution practical.

## MVP Experience

The first playable version should let a player enter a generated 3D world, move with a third-person camera, discover collectible objects, interact with simple world elements, persist progress, and reload that progress.

Combat is intentionally out of scope for the MVP.

## Non-Goals

- No combat-focused loop in the MVP.
- No direct clone of Tunic mechanics, content, or visual identity.
- No renderer-driven gameplay logic.
- No large asset pipeline before the core systems prove useful.
