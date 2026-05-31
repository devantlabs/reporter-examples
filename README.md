# Devant Cloud — Reporter Examples

Real-world examples of integrating [Devant Cloud](https://devant.net) reporters
into popular open-source test suites. Each example is a **minimal, copy-pasteable
diff** showing exactly what to add to an existing project.

## Examples

| Project | Framework | Reporter | Status |
|---|---|---|---|
| [mattermost](./mattermost/) | Cypress | `@devant-net/cypress-reporter` | ✅ |
| [vite](./vite/) | Vitest | `@devant-net/vitest-reporter` | 🚧 |
| [playwright](./playwright/) | Playwright | `@devant-net/playwright-reporter` | 🚧 |

## How it works

1. Install the reporter for your framework
2. Wire it into your test config (one function call)
3. Add 3 env vars / secrets (`DEVANT_CLOUD_API_URL`, `DEVANT_CLOUD_PROJECT_ID`, `DEVANT_CLOUD_TOKEN`)
4. All results flow into one Devant dashboard — every commit, every PR, every parallel worker

## Required secrets (GitHub Actions)

```
DEVANT_CLOUD_API_URL      https://your-devant-instance.com
DEVANT_CLOUD_PROJECT_ID   your project id (number)
DEVANT_CLOUD_TOKEN        your CI token (Settings → CI/CD)
```

## Parallel / orchestration mode

For parallel CI (multiple workers → one run), see [mattermost/README.md](./mattermost/README.md).
The pattern: create one run before workers start, pass `DEVANT_CLOUD_RUN_ID` to every
worker, complete the run when all finish.
