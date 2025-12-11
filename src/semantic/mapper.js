// Semantic Mapper - maps semantic structures to project structure

import fs from 'fs-extra';
import path from 'path';

export class SemanticMapper {
  /**
   * Map semantic structure to project pages
   */
  mapToPages(semanticStructure, projectPath = process.cwd()) {
    const pages = [];
    
    // Main page (index.html)
    const mainPage = {
      path: 'index.html',
      title: this.getPageTitle(semanticStructure),
      components: semanticStructure.components.map(c => c.component),
      semantic: {
        type: semanticStructure.structure.type,
        sections: semanticStructure.structure.sections,
      }
    };
    
    pages.push(mainPage);
    
    // Additional pages based on structure type
    if (semanticStructure.structure.type === 'landing') {
      // Add pricing page if pricing section exists
      if (semanticStructure.components.some(c => c.role === 'pricing')) {
        pages.push({
          path: 'pricing.html',
          title: 'Pricing',
          components: ['header', 'pricing', 'footer'],
          semantic: {
            type: 'pricing',
            sections: [
              { role: 'navigation', required: true },
              { role: 'pricing', required: true },
              { role: 'footer', required: true },
            ]
          }
        });
      }
      
      // Add about page if team/about section exists
      if (semanticStructure.components.some(c => c.role === 'team' || c.role === 'about')) {
        pages.push({
          path: 'about.html',
          title: 'About',
          components: ['header', 'about', 'team', 'footer'],
          semantic: {
            type: 'about',
            sections: [
              { role: 'navigation', required: true },
              { role: 'about', required: true },
              { role: 'team', required: false },
              { role: 'footer', required: true },
            ]
          }
        });
      }
    }
    
    return pages;
  }
  
  /**
   * Get page title from semantic structure
   */
  getPageTitle(semanticStructure) {
    const metadata = semanticStructure.structure.metadata || {};
    const type = semanticStructure.structure.type;
    
    const titles = {
      landing: 'Home',
      blog: 'Blog',
      portfolio: 'Portfolio',
      ecommerce: 'Shop',
    };
    
    return metadata.title || titles[type] || 'Home';
  }
  
  /**
   * Apply semantic structure to existing project
   */
  async applyToProject(semanticStructure, projectPath = process.cwd()) {
    const projectJsonPath = path.join(projectPath, 'project.json');
    
    // Read existing project
    let project = {};
    if (await fs.pathExists(projectJsonPath)) {
      project = await fs.readJson(projectJsonPath);
    } else {
      project = {
        name: 'my-site',
        version: '0.1.0',
        pages: [],
        componentsDir: 'components',
        assetsDir: 'assets',
        theme: 'theme.json',
      };
    }
    
    // Map semantic structure to pages
    const pages = this.mapToPages(semanticStructure, projectPath);
    
    // Merge with existing pages (keep non-conflicting pages)
    const existingPages = project.pages || [];
    const existingPaths = new Set(existingPages.map(p => p.path));
    
    // Add new pages, update existing ones
    pages.forEach(newPage => {
      const existingIndex = existingPages.findIndex(p => p.path === newPage.path);
      if (existingIndex >= 0) {
        // Update existing page with semantic info
        existingPages[existingIndex] = {
          ...existingPages[existingIndex],
          ...newPage,
        };
      } else {
        // Add new page
        existingPages.push(newPage);
      }
    });
    
    project.pages = existingPages;
    
    // Add semantic metadata to project
    project.semantic = {
      structure: semanticStructure.structure,
      components: semanticStructure.components,
      metadata: semanticStructure.structure.metadata,
    };
    
    // Save updated project
    await fs.writeJson(projectJsonPath, project, { spaces: 2 });
    
    return project;
  }
  
  /**
   * Restructure existing project with new semantic structure
   */
  async restructure(projectPath, newStructure, options = {}) {
    const { preserveContent = true, updateComponents = true } = options;
    
    // Apply new structure
    const project = await this.applyToProject(newStructure, projectPath);
    
    // Update components if needed
    if (updateComponents) {
      // Ensure all required components exist
      const componentsDir = path.join(projectPath, project.componentsDir);
      await fs.ensureDir(componentsDir);
      
      for (const component of newStructure.components) {
        const componentPath = path.join(componentsDir, `${component.component}.html`);
        if (!await fs.pathExists(componentPath)) {
          // Create component stub
          const stub = this.generateComponentStub(component);
          await fs.writeFile(componentPath, stub);
        }
      }
    }
    
    return project;
  }
  
  /**
   * Generate component stub HTML
   */
  generateComponentStub(component) {
    const role = component.role;
    const name = component.component;
    
    const stubs = {
      hero: `<section class="hero" data-semantic-role="${role}">
  <h1>Hero Section</h1>
  <p>Welcome message and value proposition</p>
  <a href="#" class="cta-button">Get Started</a>
</section>`,
      
      features: `<section class="features" data-semantic-role="${role}">
  <h2>Features</h2>
  <div class="features-grid">
    <!-- Feature items will be added here -->
  </div>
</section>`,
      
      pricing: `<section class="pricing" data-semantic-role="${role}">
  <h2>Pricing</h2>
  <div class="pricing-grid">
    <!-- Pricing plans will be added here -->
  </div>
</section>`,
      
      testimonials: `<section class="testimonials" data-semantic-role="${role}">
  <h2>What Our Customers Say</h2>
  <div class="testimonials-list">
    <!-- Testimonials will be added here -->
  </div>
</section>`,
    };
    
    return stubs[name] || `<div class="component-${name}" data-semantic-role="${role}">
  <h2>${name.charAt(0).toUpperCase() + name.slice(1)}</h2>
  <p>Content for ${name} component</p>
</div>`;
  }
}

