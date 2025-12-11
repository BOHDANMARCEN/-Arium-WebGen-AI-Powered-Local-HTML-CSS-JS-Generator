import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { initProject, addPage } from './project.js';
import { build } from './generator.js';
import { preview } from './previewServer.js';
import { makeComponent } from './componentManager.js';
import { runAgent } from './ai/agent.js';
import { SemanticAnalyzer } from './semantic/analyzer.js';
import { SemanticMapper } from './semantic/mapper.js';

const program = new Command();
program.name('arium').description('Arium WebGen CLI').version('3.0.0');

program.command('init <name>')
  .description('Initialize a new project structure')
  .action(async (name) => {
    await initProject(name);
    console.log('✅ Project created:', name);
  });

program.command('add-page <name>')
  .description('Add a new page to the project')
  .action(async (name) => {
    await addPage(name);
    console.log('✅ Page added:', name);
  });

program.command('make-component <name>')
  .description('Create a new component')
  .action(async (name) => {
    await makeComponent(name);
    console.log('✅ Component created:', name);
  });

program.command('build')
  .description('Build project to dist/')
  .option('--minify', 'Minify output')
  .action(async (options) => {
    await build(process.cwd(), options);
    console.log('✅ Build finished');
  });

program.command('preview')
  .description('Run preview server with live reload')
  .option('-p, --port <port>', 'Port number', '3333')
  .action(async (options) => {
    await preview(parseInt(options.port));
  });

program.command('agent <task>')
  .description('Run AI agent task')
  .option('--dry-run', 'Show changes without applying')
  .action(async (task, options) => {
    console.log('🤖 Running agent task:', task);
    await runAgent(task, options);
  });

program.command('generate <prompt>')
  .description('Generate semantic structure from prompt')
  .option('--persona <persona>', 'Persona description')
  .option('--apply', 'Apply structure to project')
  .action(async (prompt, options) => {
    const analyzer = new SemanticAnalyzer();
    const mapper = new SemanticMapper();
    
    console.log('🧠 Analyzing prompt:', prompt);
    const analysis = analyzer.analyze(prompt, { persona: options.persona });
    
    console.log('\n📋 Semantic Structure:');
    console.log(JSON.stringify(analysis.structure, null, 2));
    
    console.log('\n🧩 Components:');
    analysis.components.forEach(comp => {
      console.log(`  - ${comp.role} → ${comp.component} ${comp.required ? '(required)' : ''}`);
    });
    
    if (options.apply) {
      console.log('\n✅ Applying structure to project...');
      await mapper.applyToProject(analysis);
      console.log('✅ Structure applied! Run "arium build" to generate pages.');
    }
  });

program.command('restructure [style]')
  .description('Restructure project with new semantic style')
  .option('--preserve-content', 'Preserve existing content')
  .action(async (style, options) => {
    const analyzer = new SemanticAnalyzer();
    const mapper = new SemanticMapper();
    
    // Read current project
    const projectPath = process.cwd();
    const projectJsonPath = path.join(projectPath, 'project.json');
    
    if (!await fs.pathExists(projectJsonPath)) {
      console.error('❌ No project.json found. Run "arium init" first.');
      return;
    }
    
    const project = await fs.readJson(projectJsonPath);
    const currentPrompt = project.semantic?.metadata?.generatedFrom || 'landing page';
    
    // Create new structure with style
    const newPrompt = `${currentPrompt} ${style || ''} style: ${style || 'modern'}`;
    const analysis = analyzer.analyze(newPrompt);
    
    console.log('🔄 Restructuring project...');
    await mapper.restructure(projectPath, analysis, {
      preserveContent: options.preserveContent !== false,
      updateComponents: true
    });
    
    console.log('✅ Project restructured! Run "arium build" to see changes.');
  });

program.parseAsync(process.argv);

