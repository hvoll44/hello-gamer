# Agent Operating Model

This project gives AI agents broad autonomy to move the game forward. Use that autonomy with senior engineering judgment and keep the project easy for humans to review.

## Default Autonomy

Agents may independently:

- Make scoped code, test, and documentation changes that follow the approved architecture.
- Refactor locally when it reduces complexity or supports the current task.
- Add or update tests for changed behavior.
- Update project documentation and decision logs.
- Make git commits for coherent completed units of work using Conventional Commits.

## Approval Required

Pause and ask before:

- Changing the game vision, MVP scope, or non-goals.
- Adding major dependencies or replacing core technology choices.
- Changing accepted ADRs or architectural boundaries.
- Introducing combat, online services, monetization, accounts, analytics, or telemetry.
- Performing destructive or hard-to-reverse git operations.
- Pushing to remotes, creating releases, or changing deployment settings.

## Planning Expectations

For routine implementation, briefly state the plan and proceed. For architectural work, ambiguous requirements, broad refactors, or high-risk changes, present tradeoffs and wait for approval.

## Commit Expectations

When committing autonomously:

- Commit only coherent, reviewable units.
- Use Conventional Commits.
- Do not include secrets, local environment files, generated junk, or unrelated user changes.
- Run the relevant checks first when practical.
- Mention what was committed and any checks that were skipped or failed.

## Escalation Rule

If a change feels difficult to explain in a short commit message, it probably needs a plan, a decision log entry, or an ADR before implementation.
