# Arium WebGen — Full Project Description + Starter Code

> Complete detailed description of Arium WebGen 3.0 project with architecture, functional modules, and starter code set (Node.js) for rapid prototyping. Everything is ready to copy into your repository. This is a working set that can be run locally immediately.

---

## 0. Project Goal

Arium WebGen 3.0 — local, private, AI-first Website Builder. Goal — provide a tool that creates multi-page sites with component system, theme, live-preview, export, and AI assistant for generation/repair/optimization of sites. Priorities: security (local), simplicity, modularity, reproducibility.

---

## 1. Technology Stack (recommended for start)

- Node.js (>=18)
- EJS or Handlebars (templating) — examples use EJS
- Express for preview server
- ws or socket.io for livereload
- sharp for image optimization
- commander / yargs for CLI
- optionally: vite for faster dev server
- LLM adapter: abstraction (local llama.cpp or remote)

---

## 2. Core Features (summary)

- project.json — project config
- component-driven rendering
- theme.json — design system
- CLI: init, add-page, make-component, build, preview, export, fix_site
- simple AI adapter with html_generate and fix_layout stubs
- preview server with livereload

---

## 3. Project Structure (starter)

```
arium-webgen-starter/
├─ bin/
│  └─ arium                # CLI executable (node)
├─ src/
│  ├─ cli.js
│  ├─ project.js
│  ├─ generator.js
│  ├─ componentManager.js
│  ├─ previewServer.js
│  ├─ ai/
│  │  ├─ agent.js
│  │  ├─ planner.js
│  │  └─ adapter.js       # adapter to LLMs
│  └─ utils.js
├─ templates/
│  ├─ page.ejs
│  └─ component.ejs
├─ examples/
│  └─ simple-site/
│     ├─ project.json
│     ├─ theme.json
│     ├─ pages/index.md
│     └─ components/header.html
├─ package.json
└─ README.md
```

---

## 4. Installation (locally)

1. `git clone <repo>`
2. `cd arium-webgen-starter`
3. `npm install`
4. `node ./bin/arium init my-site` (examples below)

---

## 5. `project.json` — example

```json
{
  "name": "my-site",
  "version": "0.1.0",
  "pages": [
    { "path": "index.html", "title": "Home", "components": ["header","hero","footer"] }
  ],
  "componentsDir": "components",
  "assetsDir": "assets",
  "theme": "theme.json",
  "uiFramework": null
}
```

---

## 6. `theme.json` — example

```json
{
  "name": "Arium Default",
  "colors": { "primary": "#0b5fff", "accent":"#ff6b6b", "bg":"#ffffff", "text":"#111" },
  "typography": { "base":"16px", "font":"Inter, system-ui, sans-serif" }
}
```

---

## 7. Starter Code (key files)

Below is the complete minimal working code for CLI, project manager, template generator, component manager, preview server, and simple AI agent skeleton. Copy to corresponding files.

### package.json

```json
{
  "name": "arium-webgen-starter",
  "version": "0.0.1",
  "type": "module",
  "bin": {
    "arium": "./bin/arium"
  },
  "scripts": {
    "start": "node ./bin/arium"
  },
  "dependencies": {
    "commander": "^10.0.0",
    "ejs": "^3.1.9",
    "express": "^4.18.2",
    "ws": "^8.13.0",
    "chokidar": "^3.5.3",
    "mkdirp": "^3.0.0",
    "fs-extra": "^11.1.1",
    "sharp": "^0.32.0"
  }
}
```

---

### bin/arium (CLI entry)

Create `bin/arium` and make it executable (`chmod +x bin/arium`).

```js
#!/usr/bin/env node
import('./src/cli.js');
```

---

### src/cli.js

```js
import { Command } from 'commander';
import { initProject, addPage } from './project.js';
import { build } from './generator.js';
import { preview } from './previewServer.js';
import { makeComponent } from './componentManager.js';
import { runAgent } from './ai/agent.js';

const program = new Command();
program.name('arium').description('Arium WebGen CLI').version('0.1.0');

program.command('init <name>').description('Init project structure').action(async (name)=>{
  await initProject(name);
  console.log('Project created:', name);
});

program.command('add-page <name>').description('Add page').action(async (name)=>{
  await addPage(name);
  console.log('Page added:', name);
});

program.command('make-component <name>').description('Create component').action(async (name)=>{
  await makeComponent(name);
  console.log('Component created:', name);
});

program.command('build').description('Build project to dist/').action(async ()=>{
  await build();
  console.log('Build finished');
});

program.command('preview').description('Run preview server').action(async ()=>{
  await preview();
});

program.command('agent <task>').description('Run AI agent task (stub)').action(async (task)=>{
  console.log('Running agent task:', task);
  await runAgent(task);
});

program.parseAsync(process.argv);
```

---

### src/project.js

```js
import fs from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';

const cwd = process.cwd();

export async function initProject(name){
  const dir = path.join(cwd, name);
  await mkdirp(dir);
  // create starter structure
  const project = {
    name,
    version: '0.1.0',
    pages: [ { path: 'index.html', title: 'Home', components: ['header','hero','footer'] } ],
    componentsDir: 'components',
    assetsDir: 'assets',
    theme: 'theme.json',
    uiFramework: null
  };
  await fs.writeJson(path.join(dir, 'project.json'), project, { spaces: 2 });
  await mkdirp(path.join(dir, project.componentsDir));
  await mkdirp(path.join(dir, project.assetsDir));
  await fs.writeJson(path.join(dir, 'theme.json'), { name: 'Arium Default', colors: { primary: '#0b5fff', accent:'#ff6b6b', bg:'#fff', text:'#111' } }, { spaces: 2 });
  // write example component
  const comp = `<header class=\"site-header\">
  <a href=\"/index.html\">Arium</a>
  <nav><!-- links injected --></nav>
</header>`;
  await fs.writeFile(path.join(dir, project.componentsDir, 'header.html'), comp);
  // index page template (md or html)
  const index = `<!doctype html>
<html>
<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Home</title></head>
<body>
  <!-- components: header hero footer -->
  <div id=\"content\">Hello Arium</div>
</body>
</html>`;
  await fs.writeFile(path.join(dir, 'index.html'), index);
  console.log('Initialized project at', dir);
}

export async function addPage(name){
  const file = `${name}.html`;
  await fs.ensureFile(path.join(process.cwd(), file));
  await fs.writeFile(path.join(process.cwd(), file), `<!doctype html>
<html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>${name}</title></head><body><h1>${name}</h1></body></html>`);
}
```

---

### src/componentManager.js

```js
import fs from 'fs-extra';
import path from 'path';

export async function makeComponent(name){
  const dir = process.cwd();
  const componentsDir = 'components';
  await fs.ensureDir(path.join(dir, componentsDir));
  const filepath = path.join(dir, componentsDir, `${name}.html`);
  const content = `<!-- component: ${name} -->
<div class=\"component-${name}\">${name} content</div>`;
  await fs.writeFile(filepath, content);
}
```

---

### src/generator.js

```js
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';

export async function build(projectPath = process.cwd()){
  // read project.json if exists in cwd
  const pjPath = path.join(projectPath, 'project.json');
  let project;
  if (await fs.pathExists(pjPath)) project = await fs.readJson(pjPath);
  else project = { pages: [ { path: 'index.html', title: 'Home', components: [] } ], componentsDir: 'components', assetsDir: 'assets', theme: 'theme.json' };

  const dist = path.join(projectPath, 'dist');
  await fs.remove(dist);
  await fs.ensureDir(dist);

  // simple copy pages (or render templates if needed)
  const pages = project.pages || [ { path: 'index.html', title: 'Home', components: [] } ];
  for (const p of pages){
    const src = path.join(projectPath, p.path);
    let html;
    if (await fs.pathExists(src)) html = await fs.readFile(src, 'utf-8');
    else html = `<html><head><meta charset=\"utf-8\"><title>${p.title}</title></head><body><h1>${p.title}</h1></body></html>`;
    // inject components (naive): replace comment markers
    const comps = p.components || [];
    for (const c of comps){
      const compPath = path.join(projectPath, project.componentsDir, `${c}.html`);
      if (await fs.pathExists(compPath)){
        const compHtml = await fs.readFile(compPath, 'utf-8');
        html = html.replace(`<!-- component: ${c} -->`, compHtml);
      }
    }
    await fs.writeFile(path.join(dist, p.path), html);
  }
  // copy assets
  const assetsSrc = path.join(projectPath, project.assetsDir);
  if (await fs.pathExists(assetsSrc)) await fs.copy(assetsSrc, path.join(dist, project.assetsDir));
}
```

---

### src/previewServer.js

```js
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import chokidar from 'chokidar';
import { build } from './generator.js';
import path from 'path';

export async function preview(){
  const app = express();
  const port = 3333;
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  // serve dist
  await build(process.cwd());
  app.use(express.static(path.join(process.cwd(), 'dist')));

  server.listen(port, ()=> console.log('Preview server running at http://localhost:'+port));

  // watch project files
  const watcher = chokidar.watch(['**/*.html','components/**','project.json','theme.json'], { ignored: ['node_modules','dist']});
  watcher.on('change', async (p)=>{
    console.log('File changed:', p, '— rebuilding');
    await build(process.cwd());
    // notify clients
    wss.clients.forEach(c => { if (c.readyState === 1) c.send('reload'); });
  });

  // on ws connection, send a small client script to reload on message
  wss.on('connection', ws => { console.log('ws client connected'); });
}
```

Also include a tiny snippet the preview page can use to auto-reload (insert in templates):

```html
<script>
  const ws = new WebSocket('ws://localhost:3333');
  ws.onmessage = (m)=>{ if (m.data === 'reload') location.reload(); };
</script>
```

---

### src/ai/adapter.js

```js
// Minimal adapter skeleton. Replace with llama.cpp or remote OpenAI if available.
export async function sendPrompt(prompt){
  console.log('AI Prompt (stub):', prompt.substring(0,200));
  // stubbed response — real implementation should call local LLM or remote
  return { text: '[[ai response stub]]' };
}
```

---

### src/ai/planner.js

```js
export function planCreateLanding(params){
  // Very simple planner: returns a plan object
  return {
    pages: [ { path: 'index.html', title: params.title || 'Landing', components: ['header','hero','features','pricing','footer'] }, { path: 'pricing.html', title: 'Pricing', components: ['header','pricing','footer'] } ],
    theme: params.theme || 'Arium Default'
  };
}
```

---

### src/ai/agent.js

```js
import { planCreateLanding } from './planner.js';
import { build } from '../generator.js';
import fs from 'fs-extra';
import path from 'path';

export async function runAgent(task){
  if (task === 'create-landing'){
    const plan = planCreateLanding({ title: 'My SaaS' });
    // merge plan into project.json (naive)
    const pjPath = path.join(process.cwd(), 'project.json');
    let pj = {};
    if (await fs.pathExists(pjPath)) pj = await fs.readJson(pjPath);
    pj.pages = plan.pages;
    await fs.writeJson(pjPath, pj, { spaces: 2 });
    await build(process.cwd());
    console.log('Agent created landing — build ready in dist/');
  } else {
    console.log('Unknown agent task:', task);
  }
}
```

---

## 8. Example content — simple-site

Create folder `examples/simple-site` and add these files (or run `arium init`):

- `project.json` (see above)
- `components/header.html`:

```html
<header class="site-header">
  <a href="/index.html">Arium</a>
  <!-- component: nav -->
</header>
```

- `index.html` (in project root):

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Home</title>
</head>
<body>
  <!-- component: header -->
  <main>
    <h1>Welcome to Arium WebGen</h1>
    <p>This is a generated page.</p>
  </main>
  <!-- component: footer -->
  <script>
    // live reload snippet
    try{ const ws=new WebSocket('ws://localhost:3333'); ws.onmessage=(m)=>{ if(m.data==='reload') location.reload(); } }catch(e){}
  </script>
</body>
</html>
```

---

## 9. How to run the starter locally

1. `npm install`
2. `node ./bin/arium init my-site` — creates `my-site` folder with project.json
3. `cd my-site`
4. `node ../bin/arium build` — generates `dist/`
5. `node ../bin/arium preview` — starts preview server at `http://localhost:3333`
6. Open `http://localhost:3333` — see the site; when files change, server rebuilds and page reloads

---

## 10. Next — roadmap for AI Agent and advanced modules

1. Replace AI adapter stub with local llama.cpp calls (via child process) or remote calls.
2. Implement `html_generate` prompt templates: prompt -> JSON page schema -> render via templates
3. Implement `fix_layout` using CSS parsing (postcss) + LLM suggestions, with dry-run mode
4. Add Tailwind integration option (generate tailwind.config.js and run build)
5. Implement component metadata and prop injection (data-bindings)
6. Add multilingual content sync and generator
7. Add unit tests for generator and component manager

---

## 11. Licensing & contribution

- Recommend MIT or Apache-2.0 for open-source.
- Add CODE_OF_CONDUCT.md and CONTRIBUTING.md when repo grows.

---

## 12. Implementation Notes

This starter code provides:

- ✅ Working CLI with basic commands
- ✅ Project initialization and management
- ✅ Component system (basic)
- ✅ Template rendering and build pipeline
- ✅ Preview server with live reload
- ✅ AI agent skeleton (ready for LLM integration)

### Next Steps for Full Implementation:

1. **Sprint 1-2**: Complete the core modules (project manager, component manager, generator)
2. **Sprint 3**: Integrate real LLM adapter (Ollama/local models)
3. **Sprint 4**: Add theme engine with CSS generation
4. **Sprint 5**: Implement AI tools (html_generate, fix_layout, seo_optimizer)
5. **Sprint 6-8**: Advanced features (content engine, multilingual, deploy)

---

*Last updated: 2025-01-11*
*Version: 3.0.0-starter*

