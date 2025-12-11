// AI Planner - converts user intent into ordered tasks

import { SemanticAnalyzer } from '../semantic/analyzer.js';
import { SemanticMapper } from '../semantic/mapper.js';

const semanticAnalyzer = new SemanticAnalyzer();
const semanticMapper = new SemanticMapper();

export function planCreateLanding(params = {}) {
  const { 
    title = 'Landing', 
    theme = 'Arium Default',
    sections = ['hero', 'features', 'pricing', 'testimonials', 'footer'],
    prompt = null
  } = params;

  // Use semantic analyzer if prompt is provided
  if (prompt) {
    const analysis = semanticAnalyzer.analyze(prompt, { persona: params.persona });
    const pages = semanticMapper.mapToPages(analysis);
    
    return {
      semantic: analysis,
      pages: pages,
      components: analysis.components.map(c => ({
        name: c.component,
        type: 'section',
        role: c.role
      })),
      theme: theme,
      metadata: analysis.structure.metadata
    };
  }
  
  // Fallback to simple structure
  const allComponents = ['header', ...sections];
  if (!allComponents.includes('footer')) {
    allComponents.push('footer');
  }
  
  return {
    pages: [
      { 
        path: 'index.html', 
        title: title, 
        components: allComponents
      },
      { 
        path: 'pricing.html', 
        title: 'Pricing', 
        components: ['header', 'pricing', 'footer'] 
      }
    ],
    components: sections.map(section => ({
      name: section,
      type: 'section'
    })),
    theme: theme
  };
}

export function planFixSite(issues = []) {
  return {
    tasks: issues.map(issue => ({
      type: 'fix',
      target: issue.file,
      issue: issue.description,
      priority: issue.priority || 'medium'
    }))
  };
}

export function planGenerateContent(params = {}) {
  const { pages = [], language = 'en' } = params;
  
  return {
    tasks: pages.map(page => ({
      type: 'generate_content',
      page: page.path,
      language: language,
      sections: page.sections || []
    }))
  };
}

