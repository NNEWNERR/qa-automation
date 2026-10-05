# Specs

Test plans written by the **planner** agent (`.claude/agents/playwright-test-planner.md`),
one Markdown file per feature area.

A plan is the **oracle** for the tests generated from it: the generator turns
each scenario into a spec under `tests/generated/`, and the healer may repair a
broken locator but may not change what a scenario expects. If the app stops
matching a plan, that is a finding to report — not something to edit away.

Every top-level plan item names its seed:

```markdown
### 1. Adding New Todos
**Seed:** `tests/seed.spec.ts`
```

Plans are reviewed and committed like code. Scenarios already covered by the
hand-written specs in `tests/` are out of scope for the planner.
