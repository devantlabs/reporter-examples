# Mattermost + Devant Cloud (Cypress)

Integration of `@devant-net/cypress-reporter@0.1.5` into
[mattermost/mattermost](https://github.com/mattermost/mattermost) e2e test suite.

## What this shows

- Wiring `devqReporter` into mattermost's `cypress.config.ts` (must go **after** mattermost's
  own plugins to avoid `after:spec` handler collision — see note below)
- A GitHub Actions workflow with **N parallel workers** (ubuntu-24.04, same spec as
  mattermost CI), each running its own full stack, all reporting into **one Devant run**
- Orchestration mode: create one run → N workers → complete run

## The diff (what to add to mattermost)

### 1. Install the reporter

```bash
cd e2e-tests/cypress
npm install -D @devant-net/cypress-reporter@0.1.5
```

### 2. `e2e-tests/cypress/cypress.config.ts`

```diff
+ import {devqReporter} from '@devant-net/cypress-reporter';

  setupNodeEvents(on, config) {
    // ... existing mattermost setup ...
-   return require('./tests/plugins/index.js')(on, config);
+   const cfg = require('./tests/plugins/index.js')(on, config);
+   devqReporter(on, cfg || config); // MUST be last — mattermost registers after:spec too
+   return cfg;
  }
```

> **Why last?** Cypress keeps only the **final** `after:spec` handler. Mattermost's
> `tests/plugins/index.js` registers its own `after:spec` (deletes passing-spec videos).
> If you register `devqReporter` first, mattermost's handler overwrites it → silent empty runs.

### 3. GitHub Actions secrets

Add to your fork's repo secrets:

| Secret | Value |
|---|---|
| `DEVANT_CLOUD_API_URL` | `https://your-devant-instance.com` |
| `DEVANT_CLOUD_PROJECT_ID` | your project id |
| `DEVANT_CLOUD_TOKEN` | your CI token |

### 4. Add the workflow

Copy [`.github/workflows/devant-e2e.yml`](./.github/workflows/devant-e2e.yml) to your fork.
Trigger via `workflow_dispatch` → N parallel workers → results in Devant.

## Proven results

- Run #52: smoke suite · `run_tests.js --stage=@prod --group=@smoke` · **28/28 tests** ✅
- Run #56: parallel 2-worker demo · **29/29 tests** ✅  
- Run #57: full `@prod` suite (partial) · **886 tests recorded** · failures match Cypress mochawesome 1:1
