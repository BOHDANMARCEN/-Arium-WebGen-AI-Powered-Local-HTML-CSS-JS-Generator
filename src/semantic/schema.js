// Semantic Structure Schema
// Defines the structure for semantic website layouts

export const SemanticRoles = {
  // Page-level roles
  PAGE: 'page',
  LANDING: 'landing',
  BLOG: 'blog',
  PORTFOLIO: 'portfolio',
  ECOMMERCE: 'ecommerce',
  
  // Section roles
  HERO: 'hero',
  NAVIGATION: 'navigation',
  FOOTER: 'footer',
  PROBLEM: 'problem',
  SOLUTION: 'solution',
  FEATURES: 'features',
  TESTIMONIALS: 'testimonials',
  PRICING: 'pricing',
  CTA: 'cta',
  ABOUT: 'about',
  CONTACT: 'contact',
  FAQ: 'faq',
  TEAM: 'team',
  GALLERY: 'gallery',
  CONTENT: 'content',
};

export const SemanticStructure = {
  // Landing page structure
  LANDING: {
    type: 'landing',
    sections: [
      { role: SemanticRoles.NAVIGATION, required: true },
      { role: SemanticRoles.HERO, required: true },
      { role: SemanticRoles.PROBLEM, required: false },
      { role: SemanticRoles.SOLUTION, required: false },
      { role: SemanticRoles.FEATURES, required: false },
      { role: SemanticRoles.TESTIMONIALS, required: false },
      { role: SemanticRoles.PRICING, required: false },
      { role: SemanticRoles.CTA, required: true },
      { role: SemanticRoles.FOOTER, required: true },
    ]
  },
  
  // Blog structure
  BLOG: {
    type: 'blog',
    sections: [
      { role: SemanticRoles.NAVIGATION, required: true },
      { role: SemanticRoles.CONTENT, required: true },
      { role: SemanticRoles.FOOTER, required: true },
    ]
  },
  
  // Portfolio structure
  PORTFOLIO: {
    type: 'portfolio',
    sections: [
      { role: SemanticRoles.NAVIGATION, required: true },
      { role: SemanticRoles.HERO, required: true },
      { role: SemanticRoles.GALLERY, required: true },
      { role: SemanticRoles.ABOUT, required: false },
      { role: SemanticRoles.CONTACT, required: false },
      { role: SemanticRoles.FOOTER, required: true },
    ]
  },
};

export function createSemanticStructure(type, customSections = []) {
  const base = SemanticStructure[type.toUpperCase()];
  if (!base) {
    throw new Error(`Unknown semantic structure type: ${type}`);
  }
  
  const sections = [...base.sections];
  
  // Add custom sections
  customSections.forEach(section => {
    if (!sections.find(s => s.role === section.role)) {
      sections.push({ role: section.role, required: section.required || false });
    }
  });
  
  return {
    type: base.type,
    sections: sections,
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}

export function validateSemanticStructure(structure) {
  const errors = [];
  
  if (!structure.type) {
    errors.push('Missing type');
  }
  
  if (!structure.sections || !Array.isArray(structure.sections)) {
    errors.push('Missing or invalid sections');
  }
  
  // Check required sections
  const requiredSections = structure.sections.filter(s => s.required);
  requiredSections.forEach(section => {
    if (!section.role) {
      errors.push(`Required section missing role: ${section.role}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

