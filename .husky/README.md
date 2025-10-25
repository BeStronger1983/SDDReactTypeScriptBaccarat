# Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks for code quality.

## Hooks

### Pre-commit

Runs automatically before each commit to ensure code quality:

1. **Lint-staged**: Runs on staged files only
   - ESLint with auto-fix for TypeScript/JavaScript files
   - Prettier formatting for all files
   
2. **Type-check**: Validates TypeScript types across the entire project
   - Ensures no type errors before commit
   - Uses `tsc --noEmit` for validation only

3. **Unit Tests**: Runs all unit and integration tests
   - Ensures tests pass before commit
   - Uses Vitest (fast, no E2E tests)

## What Gets Checked

### TypeScript/JavaScript Files (*.ts, *.tsx, *.js, *.jsx)
- ESLint checks (with auto-fix)
- Prettier formatting (auto-applied)

### JSON, CSS, Markdown Files
- Prettier formatting (auto-applied)

### Full Project
- TypeScript compilation (type-check)
- All unit tests

## Setup

Husky is automatically set up when you run:

```bash
npm install
```

The `prepare` script in package.json runs Husky initialization.

## Configuration

### Disable hooks temporarily

```bash
# Skip all hooks for a single commit
git commit --no-verify

# Or set environment variable
HUSKY=0 git commit
```

### Modify hook behavior

Edit `.husky/pre-commit` to customize what runs before commits.

### Modify lint-staged rules

Edit the `lint-staged` section in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

## Troubleshooting

### Hook not running

```bash
# Check Git hooks path
git config core.hooksPath
# Should output: .husky

# If not set
git config core.hooksPath .husky
```

### "npx: command not found" or "npm: command not found"

This usually happens when Node.js is not in the PATH during Git hook execution.

**Solution 1: The hook loads NVM automatically**
The pre-commit hook is configured to load NVM if it exists. This should work for most setups.

**Solution 2: Create ~/.huskyrc**
If you use a different Node version manager or custom setup:

```bash
# Create ~/.huskyrc
cat > ~/.huskyrc << 'EOF'
# Load your Node version manager
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Or if using fnm
# eval "$(fnm env)"

# Or if using asdf
# . $HOME/.asdf/asdf.sh
EOF
```

**Solution 3: Use full path**
Edit `.husky/pre-commit` and use full paths:

```bash
# Instead of: npm run test
# Use: /Users/username/.nvm/versions/node/v22.21.0/bin/npm run test
```

### Permission denied

```bash
# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/_/husky.sh
```

### Tests failing on commit

```bash
# Run tests manually to see failures
cd baccarat-game
npm run test:run

# Fix the failing tests before committing
```

### Type errors on commit

```bash
# Run type-check manually
cd baccarat-game
npm run type-check

# Fix type errors before committing
```

## Performance

The pre-commit hook is designed to be fast:

- **Lint-staged**: Only checks staged files (~1-5 seconds)
- **Type-check**: Full project check (~2-5 seconds)
- **Unit tests**: Fast tests only (~5-10 seconds)

Total time: ~10-20 seconds on average

E2E tests are NOT run on pre-commit (too slow). Run them manually or in CI.

## CI/CD

The same checks run in CI/CD pipelines:
- Linting and formatting (fails if not formatted)
- Type checking (fails on type errors)
- All tests including E2E (comprehensive validation)

Pre-commit hooks help catch issues early, reducing CI failures.
