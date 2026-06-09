# Butterfly Process — Methodology

Canonical source of truth for the Product Architect skill package.

| File | Purpose |
|------|---------|
| [BUTTERFLY-PROCESS.md](./BUTTERFLY-PROCESS.md) | Full methodology (verbatim from Notion) |
| [CHANGELOG.md](./CHANGELOG.md) | Methodology version history |
| [diagrams/](./diagrams/) | Chapter illustrations |

## Versioning

Methodology follows [semver](https://semver.org/):

- **PATCH** — clarifications, typo fixes, formatting
- **MINOR** — new chapter, artefact, or non-breaking extension
- **MAJOR** — breaking change to phases, loops, or core concepts

Current version: **1.2.2**

## Sync from Notion

Source page: [Butterfly Process on Notion](https://app.notion.com/p/pentaa/Butterfly-Process-23f5cf675878800081c8d7dc04bb807b)

When updating from Notion:

1. Fetch the page via Notion MCP (`notion-fetch`)
2. Update `BUTTERFLY-PROCESS.md` verbatim (body only)
3. Re-download diagrams if images changed
4. Bump version in frontmatter and `CHANGELOG.md`
5. Update `butterfly-process-version` references in skills if needed

When pushing to Notion:

1. Use `notion-update-page` with `update_content` (search-and-replace per chapter)
2. Use Notion-flavored Markdown (tables as `<table>`, FigJam links for visuals)
3. Set `last_synced_to_notion` in frontmatter after sync
