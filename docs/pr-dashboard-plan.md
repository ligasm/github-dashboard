# PR Dashboard — GitHub Pages App

## Overview
A static React SPA hosted on GitHub Pages that fetches open PRs from a configurable GitHub repository via the GitHub REST API using a PAT token, and displays a summary table grouped by assignee.

---

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | React 18 (Vite) |
| Styling | CSS Modules or Tailwind CSS |
| HTTP | `fetch` (native) |
| Charts (optional) | Recharts |
| Hosting | GitHub Pages via `gh-pages` package |

---

## Project Structure
```
pr-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── TokenInput.tsx        # PAT token input + localStorage persistence
│   │   ├── PRTable.tsx           # Assignee summary table
│   │   ├── PRList.tsx            # Expandable PR list per assignee
│   │   ├── StatusBadge.tsx       # Open/draft/label badges
│   │   └── AssigneeChart.tsx     # Optional bar chart of PRs per person
│   ├── hooks/
│   │   └── useOpenPRs.ts         # Fetch + paginate GitHub API
│   ├── utils/
│   │   ├── github.ts             # API helpers (fetch PRs, handle pagination)
│   │   └── groupByAssignee.ts    # Transform PR data → assignee groups
│   └── types/
│       └── pr.ts                 # TypeScript interfaces
├── vite.config.ts
├── package.json
└── README.md
```

---

## Implementation Plan

### Phase 1 — Setup & Auth
1. Scaffold with `npm create vite@latest pr-dashboard -- --template react-ts`
2. **`TokenInput.tsx`** — text input for PAT token, stored in `localStorage`
   - No backend, token stays in the browser
   - Show a warning that the token is stored locally
3. Configure Vite `base` path for GitHub Pages

### Phase 2 — Data Fetching
4. **`github.ts`** — API helper:
   ```ts
   async function fetchOpenPRs(token: string, repo: string): Promise<PR[]> {
     const res = await fetch(
       `https://api.github.com/repos/${repo}/pulls?state=open&per_page=100`,
       { headers: { Authorization: `Bearer ${token}` } }
     );
     return res.json();
   }
   ```
5. **`useOpenPRs.ts`** — custom hook wrapping fetch with loading/error states and auto-pagination via `Link` header

### Phase 3 — Data Transformation
6. **`groupByAssignee.ts`**:
   ```ts
   function groupByAssignee(prs: PR[]): Map<string, PR[]> {
     // Filter out bot assignees (type !== "User")
     // Group PRs by each human assignee login
     // Sort by count descending
   }
   ```

### Phase 4 — UI Components
7. **`PRTable.tsx`** — main summary table:
   - Columns: Assignee (avatar + name), # Open PRs, PR links
   - Sorted by PR count descending
   - Click row to expand and show PR details
8. **`PRList.tsx`** — expandable row showing:
   - PR title, number, labels, created date, draft status
9. **`StatusBadge.tsx`** — colored badges for labels like `in progress`, `on hold`
10. **`AssigneeChart.tsx`** (optional) — horizontal bar chart using Recharts

### Phase 5 — Polish
11. Add auto-refresh button + last-fetched timestamp
12. Add repo selector input (default configurable) for reusability
13. Dark/light mode toggle
14. Error handling: invalid token, rate limiting, API errors

### Phase 6 — Deploy
15. Add GitHub Actions workflow:
    ```yaml
    # .github/workflows/deploy-dashboard.yml
    on:
      push:
        branches: [main]
        paths: ["pr-dashboard/**"]
    jobs:
      deploy:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - run: npm ci && npm run build
            working-directory: pr-dashboard
          - uses: peaceiris/actions-gh-pages@v4
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              publish_dir: pr-dashboard/dist
    ```

---

## Security Notes
- ⚠️ PAT token is stored in `localStorage` — acceptable for internal/team use only
- Token needs only **`repo`** (read) scope
- No backend = no token exposure via server, but anyone with browser access can see it
- Alternative: use a fine-grained PAT with read-only access to the single repo

---

## MVP Deliverable
A single-page app where a user:
1. Pastes their PAT token
2. Sees a table like this auto-populated:

| Assignee | # Open PRs | PRs |
|---|---|---|
| NimishSarathe-Proventeq | 4 | #89, #81, #66, #45 |
| filipmicanek98 | 3 | #92, #90, #37 |
| ... | ... | ... |