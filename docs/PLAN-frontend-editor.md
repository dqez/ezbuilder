# EZBuilder Frontend Implementation Plan

## Overview

Triển khai frontend cho EZBuilder - nền tảng tạo landing page drag & drop, clone tempi.vn. Focus vào editor experience và component library.

**Project Type:** WEB (Next.js 16)  
**Primary Agent:** `frontend-specialist`

## Tech Stack

| Layer     | Technology                  | Rationale                             |
| --------- | --------------------------- | ------------------------------------- |
| Framework | Next.js 16 (App Router)     | Đã setup, modern React                |
| Editor    | Craft.js                    | Mature, serializable state, good docs |
| UI        | shadcn/ui + Tailwind        | Customizable, accessible, modern      |
| DnD       | @craftjs/core (built-in)    | Integrated với Craft.js               |
| Icons     | Lucide React                | Consistent với shadcn                 |
| State     | Craft.js internal + Zustand | Editor state + app state              |

## Design Direction

**Style:** Modern Minimal (Notion/Linear inspired)

| Element    | Specification                      |
| ---------- | ---------------------------------- |
| Colors     | Neutral grays, single accent color |
| Typography | Inter (Google Fonts)               |
| Corners    | Subtle radius (4-6px)              |
| Shadows    | Minimal, elevation-based           |
| Spacing    | 8-point grid                       |

## File Structure

```
web/
├── app/
│   ├── (marketing)/           # Landing, pricing
│   │   ├── page.tsx
│   │   └── pricing/
│   ├── (dashboard)/           # Auth required
│   │   ├── layout.tsx
│   │   ├── dashboard/         # List websites
│   │   └── editor/[websiteId]/
│   │       └── page.tsx       # Craft.js Editor
│   └── sites/[slug]/          # Public rendered sites
│       └── page.tsx
├── components/
│   ├── ui/                    # shadcn components
│   ├── editor/
│   │   ├── Builder.tsx        # Main Craft.js wrapper
│   │   ├── Toolbox.tsx        # Left sidebar
│   │   ├── Canvas.tsx         # Center canvas
│   │   ├── SettingsPanel.tsx  # Right sidebar
│   │   └── components/        # 12 Craft components
│   │       ├── NodeText.tsx
│   │       ├── NodeHeading.tsx
│   │       ├── NodeImage.tsx
│   │       ├── NodeButton.tsx
│   │       ├── NodeContainer.tsx
│   │       ├── NodeCard.tsx
│   │       ├── NodeHero.tsx
│   │       ├── NodeNavbar.tsx
│   │       ├── NodeFooter.tsx
│   │       ├── NodeDivider.tsx
│   │       ├── NodeSpacer.tsx
│   │       ├── NodeGallery.tsx
│   │       └── index.ts       # Resolver export
│   └── common/                # Shared components
├── lib/
│   ├── craft/
│   │   ├── resolver.ts        # Component mapping
│   │   └── utils.ts           # Serialization helpers
│   ├── api/                   # API client (future)
│   └── stores/                # Zustand stores
└── styles/
    └── globals.css            # Tailwind + custom
```

## Task Breakdown

---

### Phase 1: Foundation (Day 1-2)

#### Task 1.1: Setup shadcn/ui

- **Agent:** `frontend-specialist`
- **INPUT:** Fresh Next.js project
- **OUTPUT:** shadcn/ui configured, base components installed
- **VERIFY:** `npx shadcn@latest add button` works

#### Task 1.2: Design System Tokens

- **Agent:** `frontend-specialist`
- **INPUT:** Modern Minimal direction
- **OUTPUT:** `globals.css` với CSS variables, color palette
- **VERIFY:** Colors render correctly in browser

#### Task 1.3: Install Craft.js

- **Agent:** `frontend-specialist`
- **INPUT:** Working Next.js
- **OUTPUT:** Craft.js packages installed, basic Editor renders
- **VERIFY:** No console errors, Frame component visible

---

### Phase 2: Editor Layout (Day 3-4)

#### Task 2.1: 3-Panel Layout

- **Agent:** `frontend-specialist`
- **INPUT:** Design mockup from PRD Section 12.2
- **OUTPUT:** `Builder.tsx` với Toolbox | Canvas | Settings
- **VERIFY:** Responsive, panels resize correctly

#### Task 2.2: Toolbox Component

- **Agent:** `frontend-specialist`
- **INPUT:** 12 component specs from PRD
- **OUTPUT:** `Toolbox.tsx` với draggable items
- **VERIFY:** Items highlight on hover

#### Task 2.3: Settings Panel Shell

- **Agent:** `frontend-specialist`
- **INPUT:** Component selection event
- **OUTPUT:** `SettingsPanel.tsx` shows selected component props
- **VERIFY:** Panel updates when different component selected

---

### Phase 3: Core Components (Day 5-8)

#### Task 3.1: Basic Components (4)

- **Agent:** `frontend-specialist`
- **Components:** Text, Heading, Image, Button
- **OUTPUT:** Each with `.craft` config, inline editing
- **VERIFY:** Drag to canvas, edit inline, delete works

#### Task 3.2: Layout Components (3)

- **Agent:** `frontend-specialist`
- **Components:** Container, Spacer, Divider
- **OUTPUT:** Container accepts children, Spacer/Divider render
- **VERIFY:** Nesting works, spacing visible

#### Task 3.3: Pre-built Components (5)

- **Agent:** `frontend-specialist`
- **Components:** Card, Hero, Navbar, Footer, Gallery
- **OUTPUT:** Compound components với default content
- **VERIFY:** Drag, render with placeholder content

---

### Phase 4: Editor Features (Day 9-11)

#### Task 4.1: Auto-save

- **Agent:** `frontend-specialist`
- **INPUT:** `onNodesChange` event
- **OUTPUT:** Debounced save (2s), visual indicator
- **VERIFY:** Console logs save, no excessive calls

#### Task 4.2: Undo/Redo

- **Agent:** `frontend-specialist`
- **INPUT:** Craft.js history API
- **OUTPUT:** Toolbar buttons + Ctrl+Z/Y
- **VERIFY:** 10 steps back/forward

#### Task 4.3: Responsive Preview

- **Agent:** `frontend-specialist`
- **INPUT:** Breakpoint buttons
- **OUTPUT:** Canvas resizes (375px / 768px / 100%)
- **VERIFY:** Components adapt to width

#### Task 4.4: Component Settings UI

- **Agent:** `frontend-specialist`
- **INPUT:** Each component's props
- **OUTPUT:** Form controls in SettingsPanel
- **VERIFY:** Changes reflect in canvas immediately

---

### Phase 5: Pages & Routing (Day 12-14)

#### Task 5.1: Marketing Landing

- **Agent:** `frontend-specialist`
- **INPUT:** Simple hero + features
- **OUTPUT:** `/` route với CTA
- **VERIFY:** Renders, links work

#### Task 5.2: Dashboard Page

- **Agent:** `frontend-specialist`
- **INPUT:** Mock website list
- **OUTPUT:** `/dashboard` với cards
- **VERIFY:** Click card → editor route

#### Task 5.3: Public Site Renderer

- **Agent:** `frontend-specialist`
- **INPUT:** Serialized JSON content
- **OUTPUT:** `/sites/[slug]` renders read-only
- **VERIFY:** No editor UI, just content

---

### Phase X: Verification

```bash
# 1. Build Check
npm run build
# → Must pass without errors

# 2. Lint Check
npm run lint
# → No errors

# 3. Dev Server
npm run dev
# → Editor loads < 3s

# 4. Manual Tests
- [ ] Drag all 12 components to canvas
- [ ] Edit text inline
- [ ] Delete component
- [ ] Undo/Redo (10 steps)
- [ ] Responsive preview toggle
- [ ] Auto-save triggers (check console)
- [ ] Navigate: Landing → Dashboard → Editor → Public site
```

## Extensibility Notes

> Chuẩn bị cho bolt.diy integration trong tương lai:

1. **Component Registry Pattern:** `resolver.ts` dùng dynamic import
2. **Serializable State:** Craft.js JSON có thể extend
3. **Plugin Architecture:** Folder `lib/plugins/` reserved
4. **API Abstraction:** `lib/api/` tách biệt, dễ swap

## Risks & Mitigations

| Risk                             | Impact | Mitigation                       |
| -------------------------------- | ------ | -------------------------------- |
| Craft.js learning curve          | High   | Start với Text/Button, iterate   |
| Component styling conflicts      | Medium | CSS Modules hoặc Tailwind prefix |
| Performance với nhiều components | Medium | Virtualize nếu cần, lazy load    |

---

## Done When

- [ ] All 12 components draggable và editable
- [ ] Auto-save hoạt động
- [ ] Responsive preview 3 breakpoints
- [ ] Build production thành công
- [ ] Editor load time < 3s
