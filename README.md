# Product Architect

Agent skills and subagents for product architects, built on the **[Butterfly Process](https://app.notion.com/p/pentaa/Butterfly-Process-23f5cf675878800081c8d7dc04bb807b)** methodology by Pentaa.

**Version**: 1.2.2

## What is this?

A installable skill package for Cursor (and compatible agent runtimes) that teaches agents to work like a product architect:

- **Canonical methodology** in the repo — verbatim from Notion
- **11 skills** mapped to Butterfly Process chapters (incl. `incarnation-loop`)
- **6 subagents** for specialized delegation
- **Templates** for tensions, HMW, experiments, PRDs

## Install skills

```bash
# All skills (global)
npx skills add <your-org>/product-architect --all -g -y

# Single skill
npx skills add <your-org>/product-architect --skill butterfly-process -g -y
```

For local development, symlink or copy `skills/` into `.cursor/skills/` or `~/.cursor/skills/`.

## Install subagents

Copy agents to your project:

```bash
cp -r .cursor/agents/* your-project/.cursor/agents/
```

Or clone this repo and use it as your Cursor workspace.

## Methodology

The socle lives here:

**[docs/methodology/butterfly-process/BUTTERFLY-PROCESS.md](./docs/methodology/butterfly-process/BUTTERFLY-PROCESS.md)**

Synced with Notion (methodology v1.2.2). Chapter 10 sourced from [FigJam](https://www.figma.com/board/7YQbMLEPV43LCcFzGeBoQP/Pentaa---App-Builders?node-id=2-885).

### Chapter → skill map

| Ch. | Phase | Skill |
|-----|-------|-------|
| 0 | L'œuf invisible | `invisible-egg` |
| 1 | Imaginaux | `imaginaux-signals` |
| 2 | Empathie radicale | `radical-empathy` |
| 3 | Définition claire | `clear-definition` |
| 4 | Prototypage vivant | `living-prototyping` |
| 5 | Design incarné | `embodied-design` |
| 6 | Développement ancré | `anchored-development` |
| 7 | Double boucle | `double-loop` |
| 8–9, 11 | Équipe & organisation | `team-activation` |
| 10 | Boucle de l'incarnation | `incarnation-loop` |
| * | Orchestration | `butterfly-process` |

## Subagents

| Agent | Role |
|-------|------|
| `butterfly-facilitator` | Phase routing, loop awareness |
| `empathy-researcher` | User research, tension extraction |
| `problem-definer` | HMW, problem framing |
| `prototype-builder` | Experiments, pretotypes |
| `product-architect` | PRD, design + delivery bridge |
| `process-facilitator` | Team alignment, org loops |

## Usage in Cursor

```
Use the butterfly-facilitator agent to help me frame this new product idea.
```

```
Apply radical-empathy skill to draft an interview guide for [context].
```

## Repository structure

```
docs/methodology/butterfly-process/   # Canonical Butterfly Process
skills/                               # Agent skills (Agent Skills spec)
.cursor/agents/                       # Cursor subagents
templates/                            # Artefact templates
```

## Contributing

1. Evolve methodology in Notion first
2. Re-sync `BUTTERFLY-PROCESS.md` verbatim
3. Bump methodology version in frontmatter + CHANGELOG
4. Update skills if phases or rituals change

## License

MIT — see [LICENSE](./LICENSE)
