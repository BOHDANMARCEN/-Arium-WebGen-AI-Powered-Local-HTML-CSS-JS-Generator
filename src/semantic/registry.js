// Semantic Component Registry - maps semantic roles to components

export class SemanticComponentRegistry {
  constructor() {
    this.registry = new Map();
    this.initializeDefaultRegistry();
  }
  
  /**
   * Initialize default semantic role to component mappings
   */
  initializeDefaultRegistry() {
    const mappings = [
      { role: 'navigation', component: 'header', type: 'layout' },
      { role: 'hero', component: 'hero', type: 'section' },
      { role: 'problem', component: 'problem', type: 'section' },
      { role: 'solution', component: 'solution', type: 'section' },
      { role: 'features', component: 'features', type: 'section' },
      { role: 'testimonials', component: 'testimonials', type: 'section' },
      { role: 'pricing', component: 'pricing', type: 'section' },
      { role: 'cta', component: 'cta', type: 'section' },
      { role: 'footer', component: 'footer', type: 'layout' },
      { role: 'faq', component: 'faq', type: 'section' },
      { role: 'team', component: 'team', type: 'section' },
      { role: 'contact', component: 'contact', type: 'section' },
      { role: 'gallery', component: 'gallery', type: 'section' },
      { role: 'content', component: 'content', type: 'section' },
      { role: 'about', component: 'about', type: 'section' },
    ];
    
    mappings.forEach(mapping => {
      this.register(mapping.role, mapping.component, mapping.type);
    });
  }
  
  /**
   * Register a semantic role to component mapping
   */
  register(role, component, type = 'section') {
    this.registry.set(role, {
      component,
      type,
      role,
      registeredAt: new Date().toISOString(),
    });
  }
  
  /**
   * Get component for semantic role
   */
  getComponent(role) {
    const mapping = this.registry.get(role);
    return mapping ? mapping.component : role.toLowerCase();
  }
  
  /**
   * Get all registered roles
   */
  getRoles() {
    return Array.from(this.registry.keys());
  }
  
  /**
   * Get all mappings
   */
  getMappings() {
    return Array.from(this.registry.values());
  }
  
  /**
   * Find roles by component name
   */
  findRolesByComponent(componentName) {
    const roles = [];
    this.registry.forEach((mapping, role) => {
      if (mapping.component === componentName) {
        roles.push(role);
      }
    });
    return roles;
  }
  
  /**
   * Check if role is registered
   */
  hasRole(role) {
    return this.registry.has(role);
  }
}

// Singleton instance
export const semanticRegistry = new SemanticComponentRegistry();

