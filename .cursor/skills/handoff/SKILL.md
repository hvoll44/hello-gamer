---
name: handoff
description: Create a handoff document so a fresh Cursor agent can continue the current work. Use when the user asks to hand off, compact context, prepare another agent, summarize the session for a new agent, or preserve context before ending work.
argument-hint: "What will the next session focus on?"
disable-model-invocation: true
---

# Handoff

Create a handoff document for another Cursor agent to continue the work.

## Instructions

1. Determine the next session focus from the user's request. If no focus is provided, infer it from the latest active work.
2. Review only the context needed to make the handoff accurate: recent commits, git status, relevant docs, changed files, active plans, blockers, and user preferences.
3. Save the handoff outside the workspace in the OS temporary directory. Do not save it in the repo.
4. Redact secrets, tokens, credentials, private keys, and unnecessary personal data.
5. Do not duplicate content already captured in artifacts such as docs, ADRs, commits, PRs, issues, or diffs. Reference them by path, commit hash, or URL instead.
6. Include suggested skills the next agent should invoke.
7. Tell the user where the handoff was saved and summarize the next recommended action.

## Handoff Format

Use this structure:

```markdown
# Handoff: [Short Title]

## Next Session Focus
[What the next agent should do.]

## Current State
[Brief state of repo, branch, commits, and work in progress.]

## Important References
- `[path]`: [why it matters]
- `[commit]`: [why it matters]

## Decisions and Constraints
[User preferences, architectural constraints, approval boundaries, and non-goals.]

## Open Tasks
- [ ] [Concrete next task]

## Blockers or Risks
[Known issues, uncertainty, skipped checks, or "None known".]

## Suggested Skills
- `[skill-name]`: [why the next agent should use it]
```

## Project Defaults

- Prefer referencing `docs/AgentOperatingModel.md`, `docs/Roadmap.md`, `docs/DecisionLog.md`, and relevant ADRs instead of restating them.
- For this repository, suggest `handoff` when preserving context, `create-skill` when authoring more skills, and `review-bugbot` or `review-security` only when the next session includes review work.
- Follow the project autonomy model: agents may commit coherent completed work, but should not push or perform destructive git operations without explicit approval.
