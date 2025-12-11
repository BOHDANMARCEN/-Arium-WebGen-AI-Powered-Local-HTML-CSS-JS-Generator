// Semantic Analyzer - analyzes user intent and creates semantic structure

import { createSemanticStructure, SemanticRoles, validateSemanticStructure } from './schema.js';

export class SemanticAnalyzer {
  constructor() {
    this.intentPatterns = {
      landing: ['landing', 'homepage', 'home page', 'main page', 'saas', 'product page'],
      blog: ['blog', 'articles', 'posts', 'news', 'journal'],
      portfolio: ['portfolio', 'showcase', 'gallery', 'works', 'projects'],
      ecommerce: ['shop', 'store', 'ecommerce', 'e-commerce', 'products', 'catalog'],
    };
    
    this.sectionPatterns = {
      [SemanticRoles.HERO]: ['hero', 'banner', 'headline', 'intro', 'welcome'],
      [SemanticRoles.PROBLEM]: ['problem', 'pain', 'issue', 'challenge'],
      [SemanticRoles.SOLUTION]: ['solution', 'answer', 'fix', 'resolve'],
      [SemanticRoles.FEATURES]: ['features', 'benefits', 'advantages', 'highlights'],
      [SemanticRoles.TESTIMONIALS]: ['testimonials', 'reviews', 'feedback', 'quotes'],
      [SemanticRoles.PRICING]: ['pricing', 'plans', 'packages', 'cost', 'price'],
      [SemanticRoles.CTA]: ['cta', 'call to action', 'button', 'sign up', 'get started'],
      [SemanticRoles.FAQ]: ['faq', 'questions', 'answers', 'help'],
      [SemanticRoles.TEAM]: ['team', 'about us', 'people', 'staff'],
      [SemanticRoles.CONTACT]: ['contact', 'reach', 'get in touch'],
    };
  }
  
  /**
   * Analyze user prompt and extract semantic intent
   */
  analyzeIntent(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    const intent = {
      type: null,
      sections: [],
      style: null,
      tone: null,
      persona: null,
    };
    
    // Detect page type
    for (const [type, patterns] of Object.entries(this.intentPatterns)) {
      if (patterns.some(pattern => lowerPrompt.includes(pattern))) {
        intent.type = type;
        break;
      }
    }
    
    // Default to landing if no specific type detected
    if (!intent.type) {
      intent.type = 'landing';
    }
    
    // Detect sections
    for (const [role, patterns] of Object.entries(this.sectionPatterns)) {
      if (patterns.some(pattern => lowerPrompt.includes(pattern))) {
        intent.sections.push({ role, required: false });
      }
    }
    
    // Detect style keywords
    const styleKeywords = {
      minimalistic: ['minimal', 'minimalistic', 'simple', 'clean'],
      corporate: ['corporate', 'business', 'professional', 'enterprise'],
      modern: ['modern', 'contemporary', 'trendy', 'fresh'],
      neon: ['neon', 'bright', 'vibrant', 'colorful'],
      brutal: ['brutal', 'bold', 'stark', 'raw'],
    };
    
    for (const [style, keywords] of Object.entries(styleKeywords)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        intent.style = style;
        break;
      }
    }
    
    // Detect tone
    const toneKeywords = {
      friendly: ['friendly', 'warm', 'welcoming'],
      professional: ['professional', 'formal', 'serious'],
      casual: ['casual', 'relaxed', 'informal'],
      tech: ['tech', 'technical', 'developer'],
    };
    
    for (const [tone, keywords] of Object.entries(toneKeywords)) {
      if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
        intent.tone = tone;
        break;
      }
    }
    
    return intent;
  }
  
  /**
   * Create semantic structure from intent
   */
  createStructure(intent) {
    // Start with base structure for the type
    let structure = createSemanticStructure(intent.type, intent.sections);
    
    // Add metadata
    structure.metadata = {
      ...structure.metadata,
      style: intent.style || 'modern',
      tone: intent.tone || 'professional',
      persona: intent.persona || null,
      generatedFrom: intent.originalPrompt || null,
    };
    
    // Validate
    const validation = validateSemanticStructure(structure);
    if (!validation.valid) {
      console.warn('Semantic structure validation warnings:', validation.errors);
    }
    
    return structure;
  }
  
  /**
   * Analyze prompt and return complete semantic structure
   */
  analyze(prompt, options = {}) {
    const intent = this.analyzeIntent(prompt);
    intent.originalPrompt = prompt;
    intent.persona = options.persona || null;
    
    const structure = this.createStructure(intent);
    
    return {
      intent,
      structure,
      components: this.mapStructureToComponents(structure),
    };
  }
  
  /**
   * Map semantic structure to component names
   */
  mapStructureToComponents(structure) {
    const roleToComponent = {
      [SemanticRoles.NAVIGATION]: 'header',
      [SemanticRoles.HERO]: 'hero',
      [SemanticRoles.PROBLEM]: 'problem',
      [SemanticRoles.SOLUTION]: 'solution',
      [SemanticRoles.FEATURES]: 'features',
      [SemanticRoles.TESTIMONIALS]: 'testimonials',
      [SemanticRoles.PRICING]: 'pricing',
      [SemanticRoles.CTA]: 'cta',
      [SemanticRoles.FOOTER]: 'footer',
      [SemanticRoles.FAQ]: 'faq',
      [SemanticRoles.TEAM]: 'team',
      [SemanticRoles.CONTACT]: 'contact',
      [SemanticRoles.GALLERY]: 'gallery',
      [SemanticRoles.CONTENT]: 'content',
      [SemanticRoles.ABOUT]: 'about',
    };
    
    return structure.sections.map(section => ({
      role: section.role,
      component: roleToComponent[section.role] || section.role.toLowerCase(),
      required: section.required,
    }));
  }
}

