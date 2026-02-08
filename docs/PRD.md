## EZBUILDERMVP - PRD (REVISED)

### 1. DOCUMENT INFO

| Field       | Value                                                |
| ----------- | ---------------------------------------------------- |
| **Version** | 1.0 - MVP Solo                                       |
| **Date**    | 2026-02-04                                           |
| **Author**  | Solo Developer                                       |
| **Status**  | Draft                                                |
| **Stack**   | Next.js 16 + NestJS 11 + Prisma 7 + PostgreSQL Local |

---

### 2. EXECUTIVE SUMMARY

**Problem:**

- Cần nền tảng cho phép user tạo landing page đơn giản bằng drag & drop
- Không có kỹ năng code nhưng muốn có website cá nhân/doanh nghiệp nhỏ

**Solution:**

- MVP tập trung duy nhất vào drag & drop editor với 12 components
- Không e-commerce, không AI, không analytics phức tạp

**Scope:**

- Backend NestJS riêng biệt để học tập và mở rộng sau này

---

### 3. GOALS & OBJECTIVES

| Type      | Goal                                     | Success Metric             |
| --------- | ---------------------------------------- | -------------------------- |
| Product   | User tạo được landing page trong 10 phút | 80% user hoàn thành 1 page |
| Technical | Stable MVP với clean architecture        | 99% uptime, <2s load       |
| Learning  | Thành thạo NestJS + Prisma               | Deploy được production     |

---

### 4. TARGET AUDIENCE

**Primary Persona: "Freelancer Minh"**

- 28 tuổi, designer freelance
- Cần portfolio đơn giản, không biết code
- Ngân sách hạn chế, muốn tự làm

**Use Case:**

1. Đăng ký tài khoản
2. Chọn template đơn giản
3. Kéo thả chỉnh sửa text, ảnh
4. Publish với subdomain miễn phí

---

### 5. USER STORIES & ACCEPTANCE CRITERIA

#### US-001: Đăng ký & Tạo Website

```
As a user
I want to đăng ký và tạo website
So that I can bắt đầu build

AC:
- Email/password đăng ký
- Auto-generate subdomain: [username].EZBUILDER.local
- Tạo default homepage với template đơn giản
```

#### US-002: Kéo Thả Component

```
As a user
I want to kéo component vào canvas
So that I can xây dựng layout

AC:
- Sidebar có 12 components
- Drag từ sidebar → canvas
- Drop vào vị trí bất kỳ
- Component render ngay lập tức
```

#### US-003: Chỉnh Sửa Nội Dung

```
As a user
I want to click để chỉnh sửa text và ảnh
So that I can cá nhân hóa content

AC:
- Double-click text → inline edit
- Click ảnh → upload mới hoặc URL
- Changes auto-save sau 2s
```

#### US-004: Responsive Preview

```
As a user
I want to xem trước trên mobile/tablet/desktop
So that I can kiểm tra giao diện

AC:
- Toggle giữa 3 breakpoints
- Không cho edit ở chế độ preview
```

#### US-005: Publish Website

```
As a user
I want to publish website
So that I can chia sẻ với người khác

AC:
- Button "Publish" trong editor
- Website public tại subdomain
- Unpublish bất cứ lúc nào
```

---

### 6. FUNCTIONAL REQUIREMENTS (MVP ONLY)

#### 6.1 Component Library (12 Components)

| #   | Component     | Props                                       | Screenshot  |
| --- | ------------- | ------------------------------------------- | ----------- |
| 1   | **Text**      | `content`, `fontSize`, `color`, `alignment` | Inline edit |
| 2   | **Heading**   | `text`, `level` (H1-H3), `color`            | Inline edit |
| 3   | **Image**     | `src`, `alt`, `borderRadius`, `width`       | Upload/URL  |
| 4   | **Button**    | `text`, `url`, `variant`, `size`            | CTA style   |
| 5   | **Container** | `padding`, `bgColor`, `layout` (flex/grid)  | Drop zone   |
| 6   | **Card**      | `title`, `description`, `imageUrl`          | Pre-built   |
| 7   | **Hero**      | `title`, `subtitle`, `bgImage`, `ctaText`   | Pre-built   |
| 8   | **Navbar**    | `logo`, `links[]`                           | Pre-built   |
| 9   | **Footer**    | `copyright`, `socialLinks[]`                | Pre-built   |
| 10  | **Divider**   | `color`, `thickness`, `margin`              | Line        |
| 11  | **Spacer**    | `height`                                    | Empty space |
| 12  | **Gallery**   | `images[]`, `columns`                       | Grid layout |

#### 6.2 Editor Features

| Feature           | Priority | Notes                            |
| ----------------- | -------- | -------------------------------- |
| Drag from sidebar | P0       | @dnd-kit or react-beautiful-dnd  |
| Canvas drop zone  | P0       | Grid system 12-col               |
| Select component  | P0       | Click = select, highlight border |
| Delete component  | P0       | Delete key or trash icon         |
| Move up/down      | P1       | Arrow buttons trong sidebar      |
| Undo/Redo         | P1       | 10 steps, Ctrl+Z                 |
| Auto-save         | P0       | Debounce 2s, save JSON state     |

#### 6.3 Style Editor (Simple)

Mỗi component có style panel bên phải:

```
┌─────────────────┐
│ 🎨 Styles       │
├─────────────────┤
│ Typography      │
│ • Font Size     │ [12px ▼]
│ • Color         │ [■ #000000]
│ • Alignment     │ [← ▬ →]
│                 │
│ Spacing         │
│ • Padding       │ [16px]
│ • Margin        │ [8px]
│                 │
│ Background      │
│ • Color         │ [■ #ffffff]
│                 │
│ Border          │
│ • Radius        │ [4px]
└─────────────────┘
```

#### 6.4 OUT OF SCOPE (MVP)

| Feature               | Reason                        |
| --------------------- | ----------------------------- |
| ❌ E-commerce         | Phức tạp, cần payment gateway |
| ❌ Custom domain      | Cần DNS config, SSL           |
| ❌ Form builder       | Backend validation phức tạp   |
| ❌ Blog/CMS           | Cần database schema phức tạp  |
| ❌ User roles         | Chỉ single user per website   |
| ❌ Analytics          | Google Analytics embed đủ     |
| ❌ AI features        | Tốn resource, không cần thiết |
| ❌ Multi-language     | Scope creep                   |
| ❌ Version history    | Tăng complexity DB            |
| ❌ Team collaboration | Single user only              |

---

### 7. NON-FUNCTIONAL REQUIREMENTS

| Category    | Requirement                                          |
| ----------- | ---------------------------------------------------- |
| Performance | Page load < 2s, Editor init < 3s                     |
| Scalability | 100 websites (local), 1000 (sau này)                 |
| Security    | JWT auth, input validation, SQL injection prevention |
| Browser     | Chrome, Firefox, Safari latest 2 versions            |
| Mobile      | Editor desktop-only, Preview responsive              |

---

### 8. TECHNICAL ARCHITECTURE

#### 8.1 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT                             │
│                  Next.js 16 (App Router)                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Editor    │  │   Preview    │  │  Marketing   │   │
│  │   (Craft)   │  │   (Static)   │  │    Pages     │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                     API SERVER                          │
│              NestJS 11 (TypeScript)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Auth      │  │   Website    │  │    Page      │   │
│  │  Module     │  │   Module     │  │   Module     │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
│  ┌─────────────┐  ┌──────────────┐                      │
│  │   User      │  │   Publish    │                      │
│  │  Module     │  │   Module     │                      │
│  └─────────────┘  └──────────────┘                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼ Prisma ORM
┌─────────────────────────────────────────────────────────┐
│                   DATABASE                              │
│              PostgreSQL 17 (Local)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    users    │  │  websites    │  │    pages     │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### 8.2 Folder Structure

```
EZBUILDER/
├── web/                    # Next.js 16 Frontend
│   ├── app/
│   │   ├── (dashboard)/    # Editor layout
│   │   │   └── editor/
│   │   │       └── [websiteId]/
│   │   ├── (marketing)/    # Landing pages
│   │   └── [subdomain]/    # Public websites
│   ├── components/
│   │   ├── editor/         # Craft.js components
│   │   ├── ui/             # shadcn/ui
│   │   └── resolver/       # Component mapping
│   └── lib/
│       ├── api/            # API client
│       └── craft/          # Craft.js config
│
└── api/                    # NestJS 11 Backend
    ├── src/
    │   ├── common/
    │   │   ├── decorators/
    │   │   ├── guards/
    │   │   ├── interceptors/
    │   │   ├── pipes/
    │   │   ├── types/
    │   │   └── utils/
    │   ├── config/
    │   ├── database/
    │   │   └── prisma/         # Prisma service
    │   ├── modules/
    │   │   ├── auth/
    │   │   ├── users/
    │   │   ├── websites/
    │   │   ├── pages/
    │   ├── app.module.ts
    │   └── main.ts
    └── prisma/
    |   └── schema.prisma
```

#### 8.3 API Specifications

**Base URL:** `http://localhost:3001/api/v1`

**Auth Endpoints:**

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/auth/register` | Email/password signup |
| POST   | `/auth/login`    | Login, return JWT     |
| GET    | `/auth/me`       | Get current user      |
| POST   | `/auth/logout`   | Invalidate token      |

**Website Endpoints:**

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/websites`           | Create new website  |
| GET    | `/websites`           | List user websites  |
| GET    | `/websites/:id`       | Get website details |
| PATCH  | `/websites/:id`       | Update settings     |
| DELETE | `/websites/:id`       | Delete website      |
| GET    | `/websites/:id/pages` | Get all pages       |

**Page Endpoints:**

| Method | Endpoint               | Description                |
| ------ | ---------------------- | -------------------------- |
| POST   | `/pages`               | Create new page            |
| GET    | `/pages/:id`           | Get page content (JSON)    |
| PATCH  | `/pages/:id`           | Update content (auto-save) |
| POST   | `/pages/:id/publish`   | Publish page               |
| POST   | `/pages/:id/unpublish` | Unpublish page             |

**Example Response:**

```json
// GET /pages/home-page-id
{
  "id": "uuid",
  "name": "Home",
  "slug": "home",
  "content": {
    "ROOT": {
      "type": "div",
      "props": { "className": "min-h-screen" },
      "nodes": ["navbar-1", "hero-1", "footer-1"]
    },
    "navbar-1": {
      "type": "Navbar",
      "props": { "logo": "My Brand", "links": [...] },
      "parent": "ROOT"
    }
  },
  "isPublished": true,
  "publishedAt": "2026-02-04T10:00:00Z"
}
```

---

### 9. DATABASE SCHEMA (Prisma)

```prisma
// apps/api/prisma/schema.prisma

generator client {
  provider     = "prisma-client"
  output       = "../generated/prisma"
  moduleFormat = "cjs"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  role      String    @default("user")
  avatarUrl String?   @map("avatar_url")
  isActive  Boolean   @default(true) @map("is_active")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  websites  Website[]

  @@map("users")
}

model Website {
  id          String   @id @default(uuid())
  name        String
  subdomain   String   @unique
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  pages       Page[]

  @@index([userId])
  @@index([subdomain])

  @@map("websites")
}

model Page {
  id          String    @id @default(uuid())
  name        String
  slug        String    // "home", "about", etc.
  content     Json      // Craft.js serialized state
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  websiteId   String
  website     Website   @relation(fields: [websiteId], references: [id], onDelete: Cascade)

  @@unique([websiteId, slug])
  @@index([websiteId])

  @@map("pages")
}
```

---

### 10. MULTI-TENANCY IMPLEMENTATION

#### 10.1 Subdomain Strategy

**Local Development:**

- User website: `minh.localhost:3000`
- API: `localhost:3001`

**Production (sau này):**

- User website: `minh.EZBUILDER.app`
- Main app: `app.EZBUILDER.app`

#### 10.2 Next.js Middleware (apps/web/middleware.ts)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip API routes và static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Extract subdomain
  const subdomain = extractSubdomain(hostname);

  if (subdomain && subdomain !== "www") {
    // Rewrite đến route dynamic [subdomain]
    const url = new URL(`/${subdomain}${pathname}`, request.url);
    return NextResponse.rewrite(url);
  }

  // Main domain - marketing pages
  return NextResponse.next();
}

function extractSubdomain(hostname: string): string | null {
  // Local: minh.localhost:3000 → minh
  // Prod: minh.EZBUILDER.app → minh
  const parts = hostname.split(".");

  if (
    parts.length >= 3 ||
    (parts.length === 2 && parts[1].includes("localhost"))
  ) {
    return parts[0];
  }

  return null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

#### 10.3 Subdomain Route Handler

```typescript
// apps/web/app/[subdomain]/page.tsx
import { notFound } from 'next/navigation';
import { getPageBySubdomain } from '@/lib/api';

export default async function SubdomainPage({
  params
}: {
  params: { subdomain: string }
}) {
  const { subdomain } = params;

  // Fetch published page from API
  const page = await getPageBySubdomain(subdomain, 'home');

  if (!page || !page.isPublished) {
    notFound();
  }

  // Render với Craft.js Renderer (read-only)
  return (
    <CraftRenderer content={page.content} />
  );
}
```

---

### 11. CRAFT.JS INTEGRATION

#### 11.1 Setup & Configuration

```bash
# Install dependencies
npm install @craftjs/core @craftjs/layers @craftjs/utils
npm install react-frame-component  # For canvas isolation
```

#### 11.2 Editor Structure

```typescript
// apps/web/components/editor/Builder.tsx
'use client';

import { Editor, Frame, Element } from '@craftjs/core';
import { useState } from 'react';
import { NodeButton } from './components/Button';
import { NodeText } from './components/Text';
import { NodeContainer } from './components/Container';
// ... other components

import { Toolbox } from './Toolbox';
import { SettingsPanel } from './SettingsPanel';

export const Builder = ({ initialData }: { initialData?: any }) => {
  const [json, setJson] = useState(initialData);

  return (
    <Editor
      resolver={{
        Button: NodeButton,
        Text: NodeText,
        Container: NodeContainer,
        // ... all 12 components
      }}
      onNodesChange={(query) => {
        // Auto-save sau 2s
        debounce(() => {
          const json = query.serialize();
          saveToAPI(json);
        }, 2000);
      }}
    >
      <div className="flex h-screen">
        {/* Left Sidebar - Toolbox */}
        <div className="w-64 border-r bg-gray-50">
          <Toolbox />
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <Frame>
            <Element canvas is={NodeContainer} className="min-h-[800px] bg-white shadow-lg">
              {initialData ? null : <Placeholder />}
            </Element>
          </Frame>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-72 border-l bg-gray-50">
          <SettingsPanel />
        </div>
      </div>
    </Editor>
  );
};
```

#### 11.3 Component Example (Text)

```typescript
// apps/web/components/editor/components/Text.tsx
import { useNode } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

export const NodeText = ({ text, fontSize, color }: any) => {
  const { connectors: { connect, drag }, actions: { setProp } } = useNode();

  return (
    <ContentEditable
      innerRef={connect}
      html={text}
      onChange={(e) => setProp((props) => (props.text = e.target.value))}
      tagName="p"
      style={{ fontSize, color }}
      className="p-2 hover:outline hover:outline-blue-400"
    />
  );
};

// Craft.js configuration
NodeText.craft = {
  displayName: 'Text',
  props: {
    text: 'Double click to edit',
    fontSize: '16px',
    color: '#000000',
  },
  related: {
    settings: TextSettings, // Component for right panel
  },
};
```

#### 11.4 Toolbox Implementation

```typescript
// apps/web/components/editor/Toolbox.tsx
import { useEditor, Element } from '@craftjs/core';
import { NodeButton } from './components/Button';
import { NodeText } from './components/Text';

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div className="p-4">
      <h3 className="font-bold mb-4">Components</h3>

      <div className="space-y-2">
        <button
          ref={(ref) => connectors.create(ref!, <Element canvas is={NodeText} />)}
          className="w-full p-3 text-left bg-white border rounded hover:border-blue-500"
        >
          📝 Text
        </button>

        <button
          ref={(ref) => connectors.create(ref!, <Element canvas is={NodeButton} />)}
          className="w-full p-3 text-left bg-white border rounded hover:border-blue-500"
        >
          🔘 Button
        </button>

        {/* ... 10 more components */}
      </div>
    </div>
  );
};
```

---

### 12. UI/UX REQUIREMENTS

#### 12.1 Design System

- **Font:** Inter (Google Fonts)
- **Colors:**
  - Primary: `#2563eb` (blue-600)
  - Background: `#f9fafb` (gray-50)
  - Canvas: `#ffffff`
  - Border: `#e5e7eb` (gray-200)
- **Spacing:** 4px base unit (Tailwind default)
- **Border Radius:** 4px (components), 8px (cards)

#### 12.2 Editor Layout

```
┌─────────────────────────────────────────────────────────────┐
│  🔷 EZBUILDER   File  View  Help        [Publish] [👤]   │  ← Header (48px)
├──────────┬──────────────────────────────┬───────────────────┤
│          │                              │                   │
│  📝 Text │                              │  🎨 Properties    │
│  🔘 Btn  │    ┌──────────────────┐     │  ─────────────    │
│  🖼️ Img  │    │                  │     │  Text: [______]   │
│  📦 Box  │    │     CANVAS       │     │  Size: [16px ▼]   │
│          │    │                  │     │  Color: [■]       │
│  ─────── │    │  (A4 size,       │     │                   │
│  Templates│   │   center,        │     │  [🗑️ Delete]      │
│  [Hero]  │    │   white bg)      │     │                   │
│  [About] │    │                  │     │                   │
│  [Contact]│   │                  │     │                   │
│          │    └──────────────────┘     │                   │
│          │                              │                   │
│          │    ← 100px padding →        │                   │
└──────────┴──────────────────────────────┴───────────────────┘
   250px              auto                    280px
```

---

### 13. TIMELINE & MILESTONES (8 WEEKS)

| Week  | Focus                  | Deliverables                                           |
| ----- | ---------------------- | ------------------------------------------------------ |
| **1** | **Setup & Auth**       | NestJS API, Prisma schema, JWT auth, Next.js setup     |
| **2** | **Craft.js Basics**    | Install Craft.js, 5 core components, basic drag-drop   |
| **3** | **Editor Core**        | Canvas, selection, delete, 10 components               |
| **4** | **Multi-tenancy**      | Subdomain middleware, website creation, public preview |
| **5** | **Styling & UX**       | Style panel, responsive preview, undo/redo             |
| **6** | **Data Flow**          | Auto-save, publish/unpublish, image upload             |
| **7** | **Templates & Polish** | 10 templates, bug fixes, mobile optimization           |
| **8** | **Testing & Launch**   | E2E testing, performance optimize, deploy              |

---

### 14. RISKS & MITIGATIONS

| Risk                    | Impact | Mitigation                                         |
| ----------------------- | ------ | -------------------------------------------------- |
| Craft.js learning curve | High   | Watch tutorials, build proof-of-concept first      |
| NestJS complexity       | Medium | Start với basic CRUD, không dùng advanced patterns |
| Scope creep             | High   | Strictly follow MVP feature list                   |
| Local PostgreSQL limit  | Low    | Sau này migrate lên Supabase/Neon khi cần          |
| Solo dev bottleneck     | High   | Prioritize, daily standup với chính mình           |

---

### 15. SUCCESS METRICS (MVP)

| Metric             | Target       | Tool          |
| ------------------ | ------------ | ------------- |
| Time to first page | < 10 minutes | Analytics     |
| User complete page | 80%          | DB query      |
| Editor load time   | < 3s         | Lighthouse    |
| API response time  | < 200ms      | NestJS logger |

---

### 16. NEXT STEPS

1. **Day 1-2:** Setup repo, install dependencies, run Hello World
2. **Day 3:** Design Prisma schema, run first migration
3. **Day 4-5:** Implement JWT auth (register/login)
4. **Weekend:** Học Craft.js qua tutorial official

---

### 17. APPENDIX

#### Resources

- [Craft.js Docs](https://craft.js.org/docs/overview/)
- [NestJS CRUD Tutorial](https://docs.nestjs.com/)
- [Prisma Next.js Guide](https://www.prisma.io/nextjs)

#### Local Development Commands

```bash
# Start PostgreSQL
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15

# Setup API
cd apps/api
npm install
npx prisma migrate dev
npm run start:dev

# Setup Web
cd apps/web
npm install
npm run dev
```

---
