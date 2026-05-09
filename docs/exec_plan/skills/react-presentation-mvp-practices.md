# React Presentation MVP Practices

## Sources

- React: Components and Hooks must be pure: https://react.dev/reference/rules/components-and-hooks-must-be-pure
- React: Scaling up with reducer and context: https://react.dev/learn/scaling-up-with-reducer-and-context
- React: useSyncExternalStore: https://react.dev/reference/react/useSyncExternalStore
- Local skill: `vercel-react-best-practices`

## Applied Practices

- Keep React render paths pure; browser side effects belong in event handlers, effects, or the external state store.
- Keep validation, result calculation, and run-of-show construction as pure TypeScript functions.
- Use a reducer-style action model for presentation state transitions.
- Use `useSyncExternalStore` for `BroadcastChannel` and `localStorage` backed state.
- Prefer direct imports and small domain-specific modules over barrel files.
- Keep components presentational where possible and pass explicit props.
- Use stable ASCII IDs for teams, judges, debaters, segments, and slide states.
- Use fixed 16:9 stage constraints, CSS custom properties, stable grid dimensions, and 8px radius for cards and portraits.
- Do not use negative letter spacing, nested cards, decorative gradient orbs, or WebGL/3D visuals in the MVP.
