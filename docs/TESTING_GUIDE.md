# Arium WebGen 3.0 - Testing Guide

## Quick Test Commands

### 1. Basic Functionality Test

```bash
# Install dependencies
npm install

# Test CLI version
node ./bin/arium --version

# Test help
node ./bin/arium --help

# Initialize test project
node ./bin/arium init test-site

# Build project
cd test-site
node ../bin/arium build

# Check output
ls dist/
cat dist/index.html
```

### 2. Component System Test

```bash
cd test-site

# Create a component
node ../bin/arium make-component pricing

# Add it to a page (edit project.json manually or use agent)
# Then rebuild
node ../bin/arium build

# Verify component is injected
cat dist/index.html | grep pricing
```

### 3. Multi-page Test

```bash
cd test-site

# Add pages
node ../bin/arium add-page about
node ../bin/arium add-page contact

# Build
node ../bin/arium build

# Verify all pages built
ls dist/
```

### 4. AI Agent Test

```bash
cd test-site

# Test dry-run
node ../bin/arium agent create-landing --dry-run

# Test actual creation (creates landing structure)
node ../bin/arium agent create-landing

# Rebuild to see changes
node ../bin/arium build
```

### 5. Preview Server Test

```bash
cd test-site

# Start preview server
node ../bin/arium preview

# In another terminal, make changes to files
# Watch for auto-rebuild and browser reload
```

## Expected Results

### ✅ Project Structure
```
test-site/
├── project.json       # Project configuration
├── theme.json         # Theme configuration
├── index.html         # Pages
├── about.html
├── components/        # Reusable components
│   ├── header.html
│   ├── hero.html
│   ├── footer.html
│   └── pricing.html
├── assets/            # Static assets
└── dist/              # Build output
    ├── index.html
    ├── about.html
    └── assets/
```

### ✅ Build Output
- All pages in `dist/`
- Components injected into HTML
- Theme CSS variables in `<style>` tag
- Assets copied to `dist/assets/`

### ✅ Component Injection
Components should be replaced:
- `<!-- component: header -->` → actual header HTML
- `<!-- component: hero -->` → actual hero HTML
- `<!-- component: footer -->` → actual footer HTML

## Troubleshooting

### Issue: Module not found
**Solution:** Check import paths in `bin/arium` (should be `../src/cli.js`)

### Issue: Build fails
**Solution:** 
- Check if `project.json` exists
- Verify component files exist in `components/` directory
- Check file permissions

### Issue: Components not injected
**Solution:**
- Verify component markers in HTML: `<!-- component: name -->`
- Check component files exist: `components/name.html`
- Verify `project.json` has correct component names

### Issue: Preview server not reloading
**Solution:**
- Check WebSocket connection in browser console
- Verify file watcher is working (check terminal output)
- Ensure live reload script is in HTML

## Performance Benchmarks

- **Init:** < 1s
- **Build (1 page):** < 1s
- **Build (10 pages):** < 2s
- **Add Page:** < 0.5s
- **Make Component:** < 0.5s
- **Preview Server Start:** < 2s

## Next Testing Steps

1. ✅ Basic CLI commands
2. ✅ Project initialization
3. ✅ Build system
4. ✅ Component injection
5. ✅ Theme injection
6. ⏳ Preview server (needs manual testing)
7. ⏳ WebSocket live reload
8. ⏳ File watching
9. ⏳ AI agent with real LLM
10. ⏳ Multi-page complex projects

---

*Last updated: 2025-01-11*

