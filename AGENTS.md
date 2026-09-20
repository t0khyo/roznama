<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions
- Components: PascalCase names, kebab-case filenames (e.g. `hero-section.tsx` exports `HeroSection`)
- Never modify files under `components/ui/` — these are shadcn primitives, managed via `npx shadcn add`
- When refactoring existing JSX, preserve exact Tailwind classes and visual output unless explicitly asked to restyle
- Shared/static content (nav links, feature lists, etc.) belongs in `lib/constants.ts`, not inline in JSX
- `(public)` = unauthenticated routes, `admin` = authenticated (auth not yet implemented)