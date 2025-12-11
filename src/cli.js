import { Command } from 'commander';
import { initProject, addPage } from './project.js';
import { build } from './generator.js';
import { preview } from './previewServer.js';
import { makeComponent } from './componentManager.js';
import { runAgent } from './ai/agent.js';

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

program.parseAsync(process.argv);

