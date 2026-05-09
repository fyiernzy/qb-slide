# Decision: Reimplement SRS-1 MVP

Date: 2026-05-09

## Decision

Reimplement the MVP rather than extending the previous monolithic `src/App.tsx` prototype.

## Rationale

- The previous prototype hardcoded a five-slide flow, while SRS-1 requires a fixed run-of-show with data-driven session states.
- The previous prototype used English controller/audience copy, three judges, three debaters per side, sponsor-like content, waiting text, WebGL/Three.js visuals, and result wording that conflicts with SRS-1.
- The useful prototype concepts are retained: same-laptop launcher/audience/controller windows, `BroadcastChannel` plus `localStorage` synchronization, and per-judge click-to-reveal vote controls.

## Implementation Direction

- Use Chinese copy for controller and audience surfaces.
- Remove WebGL/Three.js from MVP code.
- Keep state, domain logic, slides, controller, and layout concerns separated.
- Use stable typed IDs and pure domain helpers for run-of-show, validation, and result calculation.
