# PLAN: Editor Upgrade - Component-First Approach

> 📋 Full plan artifact: see `.gemini/antigravity/brain/.../implementation_plan.md`
> 📅 Created: 2026-02-11

## Summary

Nâng cấp ezbuilder editor từ 12 → 31 components, advanced styling system, UI/UX polish.

## 5 Phases

| Phase | Description                                                        | New Files | Effort   | Priority |
| ----- | ------------------------------------------------------------------ | --------- | -------- | -------- |
| 1     | **19 New Components** (Text/Media, Forms, Layouts, Marketing)      | 19        | 3-4 days | 🔴 P0    |
| 2     | **Advanced Styling System** (Gradient, Shadow, Spacing, Animation) | 6         | 2-3 days | 🟡 P1    |
| 3     | **Component Variants & Presets**                                   | ~6        | 1-2 days | 🟢 P2    |
| 4     | **Editor UX** (Layers panel, Copy/Paste, Zoom)                     | 1         | 2-3 days | 🟡 P1    |
| 5     | **UI/UX Polish** (Landing, Dashboard, Editor redesign)             | —         | 2-3 days | 🟢 P2    |

**Total: ~32 new files, ~9 modified files, ~10-15 days**

## Phase 1 Components

### 1.1 Text & Media

- `NodeRichText` - Rich text editor with formatting
- `NodeVideo` - YouTube/Vimeo embed
- `NodeIcon` - Lucide icon picker
- `NodeEmbed` - Generic embed (Maps, Social)

### 1.2 Forms

- `NodeForm`, `NodeInput`, `NodeTextarea`, `NodeSelect`, `NodeCheckbox`

### 1.3 Advanced Layout

- `NodeGrid` - CSS Grid (2/3/4 columns)
- `NodeColumns` - Flex columns (responsive)
- `NodeAccordion` - Collapsible sections
- `NodeTabs` - Tabbed content

### 1.4 Marketing

- `NodeTestimonial`, `NodePricing`, `NodeFAQ`, `NodeFeatureList`, `NodeStats`, `NodeCTA`

## Next Steps

- Review plan → `/create` or start Phase 1
