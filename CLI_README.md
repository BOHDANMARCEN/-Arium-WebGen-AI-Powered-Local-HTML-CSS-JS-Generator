# Arium WebGen 3.0 CLI

Command-line interface for Arium WebGen 3.0 - AI-powered website builder.

## Installation

After installing dependencies:

```bash
npm install
```

The CLI is available via:

```bash
npm run cli
# or
node ./bin/arium
```

## Commands

### Initialize a new project

```bash
arium init my-site
```

Creates a new project structure with:
- `project.json` - project configuration
- `theme.json` - theme configuration
- `components/` - component directory
- `assets/` - assets directory
- Example components (header, hero, footer)
- Example index page

### Add a page

```bash
arium add-page about
```

Creates a new HTML page and adds it to `project.json`.

### Create a component

```bash
arium make-component pricing
```

Creates a new component in the `components/` directory.

### Build project

```bash
arium build
```

Builds the project to `dist/` directory:
- Renders all pages
- Injects components
- Applies theme
- Copies assets

Options:
- `--minify` - Minify output (coming soon)

### Preview server

```bash
arium preview
```

Starts a development server with live reload:
- Serves files from `dist/`
- Watches for file changes
- Auto-rebuilds on changes
- WebSocket live reload

Options:
- `-p, --port <port>` - Set port (default: 3333)

### AI Agent

```bash
arium agent create-landing
arium agent fix-site
arium agent generate-content
```

Run AI-powered tasks:
- `create-landing` - Generate a landing page structure
- `fix-site` - Analyze and fix site issues
- `generate-content` - Generate content for pages

Options:
- `--dry-run` - Show changes without applying

## Example Workflow

```bash
# 1. Initialize project
arium init my-website
cd my-website

# 2. Add pages
arium add-page about
arium add-page contact

# 3. Create components
arium make-component pricing
arium make-component testimonials

# 4. Build
arium build

# 5. Preview
arium preview
# Open http://localhost:3333
```

## Project Structure

```
my-site/
├── project.json          # Project configuration
├── theme.json            # Theme configuration
├── index.html            # Pages
├── about.html
├── components/           # Reusable components
│   ├── header.html
│   ├── footer.html
│   └── ...
├── assets/               # Static assets
│   ├── images/
│   └── ...
└── dist/                 # Build output (generated)
```

## Integration with Next.js App

The CLI can work alongside the existing Next.js web app:

- **Web App** (`app/`, `components/`) - UI for generating websites
- **CLI** (`bin/`, `src/`) - Command-line tool for project management

Both can share:
- AI providers (`lib/providers/`)
- Common utilities
- Configuration

## Next Steps

1. Install dependencies: `npm install`
2. Test CLI: `npm run cli -- init test-site`
3. Build and preview: `cd test-site && npm run cli -- build && npm run cli -- preview`

