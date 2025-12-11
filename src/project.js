import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

export async function initProject(name) {
  const dir = path.join(cwd, name);
  await fs.ensureDir(dir);
  
  // Create starter structure
  const project = {
    name,
    version: '0.1.0',
    pages: [
      { 
        path: 'index.html', 
        title: 'Home', 
        components: ['header', 'hero', 'footer'] 
      }
    ],
    componentsDir: 'components',
    assetsDir: 'assets',
    theme: 'theme.json',
    uiFramework: null
  };
  
  await fs.writeJson(path.join(dir, 'project.json'), project, { spaces: 2 });
  await fs.ensureDir(path.join(dir, project.componentsDir));
  await fs.ensureDir(path.join(dir, project.assetsDir));
  
  // Create theme.json
  await fs.writeJson(
    path.join(dir, 'theme.json'), 
    { 
      name: 'Arium Default', 
      colors: { 
        primary: '#0b5fff', 
        accent: '#ff6b6b', 
        bg: '#ffffff', 
        text: '#111111' 
      },
      typography: {
        base: '16px',
        font: 'Inter, system-ui, sans-serif'
      }
    }, 
    { spaces: 2 }
  );
  
  // Write example header component
  const headerComp = `<header class="site-header">
  <a href="/index.html">Arium</a>
  <nav>
    <a href="/index.html">Home</a>
    <a href="/about.html">About</a>
  </nav>
</header>`;
  await fs.writeFile(path.join(dir, project.componentsDir, 'header.html'), headerComp);
  
  // Write example hero component
  const heroComp = `<section class="hero">
  <h1>Welcome to Arium WebGen</h1>
  <p>Build beautiful websites with AI assistance</p>
</section>`;
  await fs.writeFile(path.join(dir, project.componentsDir, 'hero.html'), heroComp);
  
  // Write example footer component
  const footerComp = `<footer class="site-footer">
  <p>&copy; 2025 Arium WebGen. Built with ❤️</p>
</footer>`;
  await fs.writeFile(path.join(dir, project.componentsDir, 'footer.html'), footerComp);
  
  // Create index page template
  const index = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Home</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, system-ui, sans-serif; line-height: 1.6; }
    .site-header { background: #0b5fff; color: white; padding: 1rem; }
    .site-header a { color: white; text-decoration: none; margin-right: 1rem; }
    .hero { text-align: center; padding: 4rem 2rem; }
    .site-footer { background: #111; color: white; text-align: center; padding: 2rem; }
  </style>
</head>
<body>
  <!-- component: header -->
  <main>
    <!-- component: hero -->
  </main>
  <!-- component: footer -->
  <script>
    // Live reload snippet
    try {
      const ws = new WebSocket('ws://localhost:3333');
      ws.onmessage = (m) => { if (m.data === 'reload') location.reload(); };
    } catch(e) {}
  </script>
</body>
</html>`;
  await fs.writeFile(path.join(dir, 'index.html'), index);
  
  console.log('✅ Initialized project at', dir);
}

export async function addPage(name) {
  const file = `${name}.html`;
  const filePath = path.join(process.cwd(), file);
  
  await fs.ensureFile(filePath);
  await fs.writeFile(
    filePath, 
    `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${name.charAt(0).toUpperCase() + name.slice(1)}</title>
</head>
<body>
  <!-- component: header -->
  <main>
    <h1>${name.charAt(0).toUpperCase() + name.slice(1)}</h1>
    <p>This is the ${name} page.</p>
  </main>
  <!-- component: footer -->
</body>
</html>`
  );
  
  // Update project.json
  const projectPath = path.join(process.cwd(), 'project.json');
  if (await fs.pathExists(projectPath)) {
    const project = await fs.readJson(projectPath);
    if (!project.pages) project.pages = [];
    project.pages.push({
      path: file,
      title: name.charAt(0).toUpperCase() + name.slice(1),
      components: ['header', 'footer']
    });
    await fs.writeJson(projectPath, project, { spaces: 2 });
  }
}

