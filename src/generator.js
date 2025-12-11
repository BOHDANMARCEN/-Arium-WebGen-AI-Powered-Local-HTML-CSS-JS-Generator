import fs from 'fs-extra';
import path from 'path';

export async function build(projectPath = process.cwd(), options = {}) {
  // Read project.json if exists in cwd
  const pjPath = path.join(projectPath, 'project.json');
  let project;
  
  if (await fs.pathExists(pjPath)) {
    project = await fs.readJson(pjPath);
  } else {
    project = { 
      pages: [{ path: 'index.html', title: 'Home', components: [] }], 
      componentsDir: 'components', 
      assetsDir: 'assets', 
      theme: 'theme.json' 
    };
  }

  const dist = path.join(projectPath, 'dist');
  await fs.remove(dist);
  await fs.ensureDir(dist);

  // Load theme if exists
  let theme = {};
  const themePath = path.join(projectPath, project.theme || 'theme.json');
  if (await fs.pathExists(themePath)) {
    theme = await fs.readJson(themePath);
  }

  // Process pages
  const pages = project.pages || [{ path: 'index.html', title: 'Home', components: [] }];
  
  for (const p of pages) {
    const src = path.join(projectPath, p.path);
    let html;
    
    if (await fs.pathExists(src)) {
      html = await fs.readFile(src, 'utf-8');
    } else {
      html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.title}</title>
</head>
<body>
  <h1>${p.title}</h1>
</body>
</html>`;
    }

    // Inject components
    const comps = p.components || [];
    for (const c of comps) {
      const compPath = path.join(projectPath, project.componentsDir, `${c}.html`);
      if (await fs.pathExists(compPath)) {
        const compHtml = await fs.readFile(compPath, 'utf-8');
        // Replace component markers
        html = html.replace(`<!-- component: ${c} -->`, compHtml);
        html = html.replace(`<!--components: ${c}-->`, compHtml);
      }
    }

    // Inject theme CSS variables if theme exists
    if (theme.colors) {
      const themeCSS = `
  <style>
    :root {
      ${theme.colors.primary ? `--color-primary: ${theme.colors.primary};` : ''}
      ${theme.colors.accent ? `--color-accent: ${theme.colors.accent};` : ''}
      ${theme.colors.bg ? `--color-bg: ${theme.colors.bg};` : ''}
      ${theme.colors.text ? `--color-text: ${theme.colors.text};` : ''}
    }
  </style>`;
      
      // Insert before </head>
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${themeCSS}\n</head>`);
      }
    }

    // Write to dist
    await fs.writeFile(path.join(dist, p.path), html);
  }

  // Copy assets
  const assetsSrc = path.join(projectPath, project.assetsDir);
  if (await fs.pathExists(assetsSrc)) {
    await fs.copy(assetsSrc, path.join(dist, project.assetsDir));
  }

  console.log(`✅ Built ${pages.length} page(s) to dist/`);
}

