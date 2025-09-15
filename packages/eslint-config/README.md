# `@vainjs/eslint-config`

Out-of-the-box ESLint configuration for modern JavaScript and TypeScript projects.

## Features

- ✨ **Modern ESLint 9.x** - Built with ESLint's new flat config format
- 🎯 **TypeScript First** - Full TypeScript support with typed linting rules
- ⚛️ **React & Next.js** - Specialized configurations for React and Next.js projects
- 📦 **Import Organization** - Smart import sorting and organization rules
- 🎨 **Prettier Integration** - Seamlessly works with Prettier formatting
- 🚀 **Zero Config** - Works out of the box with sensible defaults

## Quick Start

```bash
npm install @vainjs/eslint-config eslint prettier typescript --save-dev
```

## Usage

### Base Configuration (JavaScript/TypeScript)

```js
// eslint.config.js
import config from '@vainjs/eslint-config'

export default config
```

### React Projects

```js
// eslint.config.js
import config from '@vainjs/eslint-config/react'

export default config
```

### Next.js Projects

```js
// eslint.config.js
import config from '@vainjs/eslint-config/nextjs'

export default config
```

## What's Included

### Base Configuration

- **ESLint Recommended** - Core ESLint rules for code quality
- **TypeScript ESLint** - Full TypeScript linting with type checking
- **Import Plugin** - Import/export organization and validation
- **Prettier Integration** - Disables conflicting formatting rules

### Key Rules

- `import/order` - Organize imports by type and source
- `import/newline-after-import` - Enforce blank line after imports
- `@typescript-eslint/consistent-type-imports` - Use type-only imports
- `no-empty-function` - Allow arrow functions as placeholders

### React Configuration

Extends base config with:

- **React Rules** - JSX and React-specific linting
- **React Hooks** - Hook usage validation
- **Browser Globals** - DOM and browser API support

### Next.js Configuration

Extends base config with:

- **Next.js Rules** - Next.js best practices and optimizations
- **Core Web Vitals** - Performance optimization rules
- **React Support** - Modern JSX transform compatibility

## Customization

```js
// eslint.config.js
import baseConfig from '@vainjs/eslint-config'

export default [
  ...baseConfig,
  {
    rules: {
      // Your custom rules
      'no-console': 'warn',
    },
  },
]
```

## Requirements

- ESLint 9.x
- TypeScript 5.9+
- Prettier 3.6+

## License

MIT
