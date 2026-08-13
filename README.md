# Intelligent Inventory Dashboard

A frontend implementation of Keyloop's Scenario B technical assessment — a dealership inventory dashboard with filtering, aging-stock identification, and persisted status logging.

## Tech Stack

- **React v19** — component architecture
- **react-router-dom** (Declarative mode) — routing; current build has a single dashboard route, kept in place for planned pages beyond this assessment
- **shadcn/ui** — accessible, unstyled primitives composed with Tailwind
- **TanStack Query** — data fetching, caching, and mutation state
- **json-server** — mocked REST backend (filtering + pagination via `_page`/`_per_page`)
- **Jest + React Testing Library** — unit and component tests
- **web-vitals** — client-side Core Web Vitals collection (console-logged in this build)

See the [System Design Document](https://docs.google.com/document/d/1IVJMEYD4v77cEuLp5nPtd1k__35XRN2s74hXcwKlCaA/edit?usp=sharing) for full architecture, data flow diagrams, and technology justifications.

## Getting Started

### Prerequisites

- Node.js v22
- npm

### Install

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the project root:

```dotenv
VITE_API_URL=http://localhost:3000/
```

> **Note:** In a real-world project, environment values are typically treated as secrets and kept out of version control/documentation. Since this value is just a local mock server URL with no actual sensitive data, it's included directly here for setup convenience — this wouldn't be appropriate practice for real credentials or production URLs.

### Run

This app requires **two processes running at the same time**, in separate terminal tabs:

```bash
# Terminal 1 — mock backend (http://localhost:3000)
npm run server

# Terminal 2 — frontend dev server
npm run dev
```

`db.json` is checked into the repo with example seed data, including two vehicles with pre-logged statuses, so the app has data to display immediately.

### Build

```bash
npm run build
```

## Available Scripts

| Script                  | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server                          |
| `npm run server`        | Start json-server on port 3000, watching `db.json` |
| `npm run build`         | Production build                                   |
| `npm test`              | Run the test suite                                 |
| `npm run test:watch`    | Run tests in watch mode                            |
| `npm run test:coverage` | Run tests with a coverage report                   |

## Testing

```bash
npm test
```

Tests focus on business logic and behavior rather than blanket coverage:

- **Covered**: `getDiffTime`/`formatDate` date utilities (including the 90-day aging boundary), `HttpClient`, `Logger`, `useVehicles`/`useLogVehicleStatus`/`useMakers` hooks, `SelectFilter` and other composed components.
- **Excluded from coverage**: `src/components/common/**` (shadcn/ui primitives — third-party, not app logic), `src/utils/test-utils/**` (test helpers themselves).

## Assumptions & Scope Decisions

A few requirement ambiguities were resolved with explicit decisions, documented in full in the design doc:

- **Status logging** is shown only on aging vehicles (>90 days), matching the requirement's literal wording ("log and persist a status... for each aging vehicle").
- **Vehicle detail** is a modal, not a routed page, to preserve the filtered list's scroll/filter context.
- **Pagination** is implemented in the UI (not just documented) since shadcn/ui's built-in component made it low-effort once json-server's response envelope (`pages`, `items`) was confirmed to support it natively.
- **Layout/page header** is scoped minimally for this single-route build; a shared `Layout` component would be introduced once a second page is added.
- **Aging-stock date** is derived client-side via `getDiffTime(inventoryDate) > 90`, computed from a raw `inventoryDate` field rather than a stored, precomputed day-count.

## AI Collaboration Narrative

I made all the decisions, what to build, how to structure it, what to test. AI helped write the code once I'd already decided what I wanted.

**How we split the work:**

- I set up the project, picked the tools, and wrote the core pieces myself: the HTTP client, the logger, the date/aging logic, and the main data-fetching hooks.
- For small, simple components (dropdowns, loading skeletons, badges), I let AI write the first draft.
- For anything with real state to manage, like the filter bar, the main dashboard page, I wrote those myself, since they needed my own judgment on how the pieces fit together.
- For tests: I set up the test tools and wrote a few example tests to show the pattern. AI then wrote the rest of the tests following that pattern, and I checked each one.

**Times I caught AI getting something wrong:**

- A form-reset bug triggered a React warning. AI's fix worked but was more complicated than needed. I found a simpler fix by restructuring where the modal's state lived.
- A button was reloading the whole page when clicked. AI guessed wrong a few times (missing button type, hidden form). The real cause was completely different — the dev server was reloading the page because saving data changed a file it was watching. I found this myself by checking the browser's network log.
- AI suggested removing a library (`react-router-dom`) since it looked unused. I kept it, because I have plans to add more pages later that AI didn't know about.

**Things I double-checked myself instead of just trusting AI:**

- Checked the real format of data coming back from the mock server, since AI assumed an older format.
- Checked the official testing library docs directly before trusting AI's test setup, and caught a mistake in AI's config that it hadn't noticed.
- Looked up whether a testing tool conflict was a known issue before switching approaches, instead of just guessing.

**Overall:** some of these repeated exchanges took extra time compared to just accepting AI's first answer. But each one fixed a real problem instead of leaving a bug in place. The final code is more correct because of that extra checking, not despite it.

## Known Limitations / Future Work

- **Tracing** is not implemented — no distributed request path exists in this architecture to trace (see design doc's Observability section).
- **Metrics reporting** is console-only in this build; a production version would forward Web Vitals to Sentry Performance or similar.
- **No shared `Layout` component yet** — scoped out since this build has a single route, would be introduced alongside the second planned page.
- **Aging-status filtering (In stock / Aging >90 days)** is not implemented as a server-side filter. json-server's `_gte`/`_lte` operators have a known, unresolved bug with date-string comparison ([typicode/json-server#1528](https://github.com/typicode/json-server/issues/1528)), making server-side date-range filtering unreliable against this mock backend. A production backend with proper date-typed columns would support this directly, implementing it here would mean working around a known bug in throwaway mock infrastructure rather than real backend logic.

## References

- **[System Design Document](https://docs.google.com/document/d/1IVJMEYD4v77cEuLp5nPtd1k__35XRN2s74hXcwKlCaA/edit?usp=drive_link)** — architecture, data flow diagrams, and technology decisions
- **[Presentation Slides](https://docs.google.com/presentation/d/19LPPMXXnLhOhvuqtn3KCcbmxmf7-6sq2YTs7N63leqQ/edit?usp=drive_link)** — technical assessment overview and design summary
- **[Video Walkthrough](https://drive.google.com/file/d/1TdNb1xaHCwGfYKAUwrhxp_hzMlXmwKW_/view?usp=drive_link)** — walkthrough of the implemented dashboard
- **[Google Drive Folder](https://drive.google.com/drive/folders/175ElKEOg7STbhT4DVD_e8IJ3HqZyZ0OO?usp=drive_link)** — all supporting project materials