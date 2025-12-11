import fs from 'fs-extra';
import path from 'path';

export async function makeComponent(name) {
  const dir = process.cwd();
  const projectPath = path.join(dir, 'project.json');
  
  // Read project config to get components directory
  let componentsDir = 'components';
  if (await fs.pathExists(projectPath)) {
    const project = await fs.readJson(projectPath);
    componentsDir = project.componentsDir || 'components';
  }
  
  await fs.ensureDir(path.join(dir, componentsDir));
  const filepath = path.join(dir, componentsDir, `${name}.html`);
  
  const content = `<!-- component: ${name} -->
<div class="component-${name}">
  <h2>${name.charAt(0).toUpperCase() + name.slice(1)} Component</h2>
  <p>This is the ${name} component. Edit this file to customize it.</p>
</div>`;
  
  await fs.writeFile(filepath, content);
  console.log(`✅ Component created at: ${filepath}`);
}

export async function listComponents() {
  const dir = process.cwd();
  const projectPath = path.join(dir, 'project.json');
  
  let componentsDir = 'components';
  if (await fs.pathExists(projectPath)) {
    const project = await fs.readJson(projectPath);
    componentsDir = project.componentsDir || 'components';
  }
  
  const componentsPath = path.join(dir, componentsDir);
  if (await fs.pathExists(componentsPath)) {
    const files = await fs.readdir(componentsPath);
    const htmlFiles = files.filter(f => f.endsWith('.html'));
    return htmlFiles.map(f => f.replace('.html', ''));
  }
  return [];
}

export async function findUsage(componentName) {
  const dir = process.cwd();
  const projectPath = path.join(dir, 'project.json');
  
  if (!await fs.pathExists(projectPath)) return [];
  
  const project = await fs.readJson(projectPath);
  const pages = project.pages || [];
  
  return pages.filter(page => {
    const components = page.components || [];
    return components.includes(componentName);
  });
}

