## Git Commit Message Convention

> This is adapted from [DiscordJS's commit convention](https://github.com/discordjs/discord.js/blob/main/.github/COMMIT_CONVENTION.md).

#### Commits

Messages must be matched by the following regex:

```js
/^(revert: )?(feat|fix|docs|style|refactor|perf|test|build|chore|types)(\(.+\))?: .{1,72}/;
```

#### Examples

Appears under "Features" header:

```
feat: add result screen
```

Appears under "Bug Fixes" header:

```
fix(PostCardView): empty space problem
```

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end
