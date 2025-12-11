# Migration Guide: Arium WebGen 2.0 → 3.0

This guide explains how to migrate from the current Next.js web app (2.0) to the new CLI-based architecture (3.0).

## Overview

Arium WebGen 3.0 introduces:
- **CLI tool** for project management
- **Component-based architecture** with reusable components
- **Theme system** with `theme.json`
- **Project structure** with `project.json`
- **Preview server** with live reload

## Architecture Changes

### 2.0 (Current)
- Next.js web application
- Single-page HTML generation
- In-browser editing
- Real-time preview

### 3.0 (New)
- CLI + Web App hybrid
- Multi-page project structure
- Component system
- File-based project management
- Preview server

## Migration Path

### Option 1: Keep Both (Recommended)

Run both systems side-by-side:

1. **Web App** (`app/`, `components/`) - Continue using for quick generation
2. **CLI** (`bin/`, `src/`) - Use for structured projects

They share:
- AI providers (`lib/providers/`)
- Common utilities

### Option 2: Full Migration

Convert existing generated HTML to 3.0 structure:

1. Export current HTML from web app
2. Initialize 3.0 project: `arium init my-site`
3. Copy HTML to pages
4. Extract reusable parts to components
5. Create `theme.json` from existing styles

## Step-by-Step Migration

### 1. Install Dependencies

```bash
npm install
```

New dependencies:
- `commander` - CLI framework
- `express` - Preview server
- `ws` - WebSocket for live reload
- `chokidar` - File watching
- `fs-extra` - Enhanced file operations

### 2. Test CLI

```bash
npm run cli -- init test-site
cd test-site
npm run cli -- build
npm run cli -- preview
```

### 3. Convert Existing HTML

If you have generated HTML from 2.0:

1. Create new project: `arium init converted-site`
2. Copy HTML content to `index.html`
3. Extract header/footer to components
4. Create theme from existing CSS

### 4. Update Workflow

**Before (2.0):**
- Open web app
- Generate HTML
- Copy/paste code

**After (3.0):**
- Use CLI: `arium init`, `arium add-page`
- Or use web app for quick generation
- Use CLI for structured projects

## Integration Points

### Shared AI Providers

Both systems use `lib/providers/`:
- Ollama
- LM Studio
- DeepSeek
- OpenAI-compatible APIs

### Shared Utilities

Common code in `lib/utils.ts` can be used by both.

## Backward Compatibility

The web app (2.0) continues to work:
- All existing features remain
- No breaking changes
- Can generate HTML for use in 3.0 projects

## Future Roadmap

- **Sprint 1-2**: Core CLI modules ✅
- **Sprint 3**: Theme engine with CSS generation
- **Sprint 4**: Enhanced preview server
- **Sprint 5**: Full AI integration
- **Sprint 6-8**: Advanced features

## Questions?

See:
- [Architecture 3.0](ARCHITECTURE.md)
- [Architecture 3.0 Starter](ARCHITECTURE_3_STARTER.md)
- [CLI README](../CLI_README.md)

