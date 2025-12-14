# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo for lean development tools with two packages:
- `@vainjs/lean-cli`: Interactive CLI for configuring front-end development tools
- `@vainjs/eslint-config`: ESLint 9.x flat configs for TypeScript/React/Next.js

**Tech Stack**: pnpm workspace, Turbo, Rolldown bundler, Changesets for versioning

## Commands

```bash
# Build all packages
turbo build

# Build specific package
turbo build --filter=@vainjs/lean-cli
turbo build --filter=@vainjs/eslint-config

# Dev mode for lean-cli
turbo dev --filter=@vainjs/lean-cli

# Test CLI locally
turbo build --filter=@vainjs/lean-cli && cd packages/lean-cli && node dist/index.js init

# Version management
pnpm changeset              # Create changeset
pnpm changeset version      # Bump versions
```

## Architecture

### lean-cli (`packages/lean-cli`)

Interactive CLI that generates configuration files from EJS templates.

**Flow**: `src/index.ts` (Commander setup) → `src/commands/init.ts` (prompts user) → renders templates from `src/templates/*.ejs` → updates `package.json` → installs deps

**Key Files**:
- `src/config/index.ts`: Defines `CONFIG_TEMPLATES` mapping tools to template files and package.json updates
- `src/templates/`: EJS templates for config files
- `rolldown.config.ts`: Bundles to single CJS file, copies templates to `dist/`

**Template System**: Common variables (tool selections) passed to all templates. GitHub Actions templates have additional per-file variables defined in `CONFIG_TEMPLATES.githubActions.options[].config`.

### eslint-config (`packages/eslint-config`)

Plain JS files exporting ESLint 9.x flat configs. No build step needed.
- `base.js`: TypeScript + import rules
- `react.js`: Extends base + React rules
- `next.js`: Extends base + Next.js rules

## Code Conventions

- Conventional Commits enforced via commitlint
- Prettier: single quotes, no semicolons, 2-space indent
- Pre-commit: lint-staged runs ESLint + Prettier
- Publishing: Automated via GitHub Actions on Changesets PRs
