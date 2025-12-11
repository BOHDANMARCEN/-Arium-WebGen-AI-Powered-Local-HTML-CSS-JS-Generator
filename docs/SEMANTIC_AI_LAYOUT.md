# Semantic AI Layout Engine - Implementation Guide

## Overview

The Semantic AI Layout Engine is the first unique feature implemented for Arium WebGen 3.0. It allows generating semantic website structures from natural language prompts, rather than just HTML blocks.

## Architecture

### Core Modules

1. **`src/semantic/schema.js`** - Semantic structure schema and validation
2. **`src/semantic/analyzer.js`** - Analyzes user prompts and creates semantic structures
3. **`src/semantic/mapper.js`** - Maps semantic structures to project structure
4. **`src/semantic/registry.js`** - Semantic role to component mapping registry

### How It Works

```
User Prompt → Semantic Analyzer → Semantic Structure → Mapper → Project Structure
```

1. **User provides prompt**: "create SaaS landing page with hero, features, pricing"
2. **Semantic Analyzer** extracts:
   - Page type (landing, blog, portfolio, etc.)
   - Required sections (hero, features, pricing, etc.)
   - Style preferences (modern, corporate, minimalistic, etc.)
   - Tone (friendly, professional, casual, etc.)
3. **Semantic Structure** created with:
   - Type and sections
   - Component mappings
   - Metadata (style, tone, persona)
4. **Mapper** applies structure to project:
   - Updates `project.json`
   - Creates/updates pages
   - Generates component stubs

## Usage

### CLI Commands

#### Generate Semantic Structure

```bash
arium generate "create SaaS landing page with hero, features, pricing"
```

This analyzes the prompt and shows the semantic structure without applying it.

#### Apply Structure to Project

```bash
arium generate "create modern SaaS landing" --apply
```

This analyzes the prompt and applies the structure to the current project.

#### Restructure Project

```bash
arium restructure minimalistic
arium restructure corporate --preserve-content
```

This restructures the current project with a new style while optionally preserving existing content.

### Example Workflow

```bash
# 1. Initialize project
arium init my-saas

# 2. Generate and apply semantic structure
cd my-saas
arium generate "create SaaS landing page with hero, features, pricing, testimonials" --apply

# 3. Build project
arium build

# 4. Restructure with different style
arium restructure minimalistic

# 5. Rebuild
arium build
```

## Semantic Roles

### Page Types
- `landing` - Landing page
- `blog` - Blog structure
- `portfolio` - Portfolio structure
- `ecommerce` - E-commerce structure

### Section Roles
- `navigation` - Header/navigation
- `hero` - Hero section
- `problem` - Problem statement
- `solution` - Solution presentation
- `features` - Features showcase
- `testimonials` - Customer testimonials
- `pricing` - Pricing section
- `cta` - Call to action
- `footer` - Footer
- `faq` - FAQ section
- `team` - Team section
- `contact` - Contact section
- `gallery` - Gallery
- `content` - Content area
- `about` - About section

## Component Mapping

Semantic roles are automatically mapped to component names:

- `navigation` → `header`
- `hero` → `hero`
- `features` → `features`
- `pricing` → `pricing`
- etc.

## Integration with AI Planner

The semantic engine is integrated with the existing AI planner:

```javascript
import { planCreateLanding } from './ai/planner.js';

// With prompt - uses semantic analyzer
planCreateLanding({ 
  prompt: "create SaaS landing",
  persona: "friendly, tech-savvy"
});

// Without prompt - uses simple structure
planCreateLanding({ 
  title: "Landing",
  sections: ['hero', 'features']
});
```

## Project Structure

When semantic structure is applied, `project.json` is updated with:

```json
{
  "semantic": {
    "structure": {
      "type": "landing",
      "sections": [...],
      "metadata": {
        "style": "modern",
        "tone": "professional",
        "generatedFrom": "..."
      }
    },
    "components": [...]
  }
}
```

## Future Enhancements

- [ ] LLM integration for better intent understanding
- [ ] Style-specific component generation
- [ ] Multi-page semantic structures
- [ ] Semantic component relationships
- [ ] Style transfer between structures

---

*Implementation completed: 2025-01-11*  
*Sprint 5: Semantic AI Layout Engine*

