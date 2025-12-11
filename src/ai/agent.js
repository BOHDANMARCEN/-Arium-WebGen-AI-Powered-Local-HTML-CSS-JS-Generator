import { planCreateLanding, planFixSite, planGenerateContent } from './planner.js';
import { build } from '../generator.js';
import { makeComponent } from '../componentManager.js';
import fs from 'fs-extra';
import path from 'path';

export async function runAgent(task, options = {}) {
  const { dryRun = false } = options;
  const projectPath = process.cwd();
  
  try {
    switch (task) {
      case 'create-landing':
        await handleCreateLanding(projectPath, dryRun);
        break;
        
      case 'fix-site':
        await handleFixSite(projectPath, dryRun);
        break;
        
      case 'generate-content':
        await handleGenerateContent(projectPath, dryRun);
        break;
        
      default:
        console.log('❌ Unknown agent task:', task);
        console.log('Available tasks: create-landing, fix-site, generate-content');
    }
  } catch (error) {
    console.error('❌ Agent error:', error.message);
    throw error;
  }
}

async function handleCreateLanding(projectPath, dryRun) {
  console.log('📋 Planning landing page creation...');
  const plan = planCreateLanding({ title: 'My SaaS' });
  
  if (dryRun) {
    console.log('🔍 Dry run mode - would create:');
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  
  // Merge plan into project.json
  const pjPath = path.join(projectPath, 'project.json');
  let project = {};
  
  if (await fs.pathExists(pjPath)) {
    project = await fs.readJson(pjPath);
  } else {
    project = {
      name: 'my-site',
      version: '0.1.0',
      pages: [],
      componentsDir: 'components',
      assetsDir: 'assets',
      theme: 'theme.json'
    };
  }
  
  // Update pages
  project.pages = plan.pages;
  await fs.writeJson(pjPath, project, { spaces: 2 });
  
  // Create components if they don't exist
  for (const comp of plan.components) {
    const compPath = path.join(projectPath, project.componentsDir, `${comp.name}.html`);
    if (!await fs.pathExists(compPath)) {
      await makeComponent(comp.name);
    }
  }
  
  // Build project
  await build(projectPath);
  console.log('✅ Agent created landing — build ready in dist/');
}

async function handleFixSite(projectPath, dryRun) {
  console.log('🔧 Analyzing site for issues...');
  
  // TODO: Implement actual issue detection
  const issues = [
    { file: 'index.html', description: 'Missing viewport meta tag', priority: 'high' },
    { file: 'index.html', description: 'No alt text on images', priority: 'medium' }
  ];
  
  const plan = planFixSite(issues);
  
  if (dryRun) {
    console.log('🔍 Dry run mode - would fix:');
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  
  console.log('✅ Site analysis complete. Fixes:', plan.tasks.length);
  // TODO: Apply fixes
}

async function handleGenerateContent(projectPath, dryRun) {
  console.log('📝 Generating content...');
  
  const pjPath = path.join(projectPath, 'project.json');
  if (!await fs.pathExists(pjPath)) {
    console.log('❌ No project.json found. Run "arium init" first.');
    return;
  }
  
  const project = await fs.readJson(pjPath);
  const plan = planGenerateContent({ pages: project.pages });
  
  if (dryRun) {
    console.log('🔍 Dry run mode - would generate:');
    console.log(JSON.stringify(plan, null, 2));
    return;
  }
  
  console.log('✅ Content generation plan created');
  // TODO: Implement content generation
}

