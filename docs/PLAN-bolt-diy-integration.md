# PLAN: Tích hợp bolt.diy vào EZBuilder

## Ngày: 2026-02-12
## Trạng thái: Draft

---

## 1. TỔNG QUAN

### 1.1 bolt.diy là gì?

bolt.diy là phiên bản open-source của Bolt.new — một AI-powered full-stack web development platform chạy trực tiếp trên trình duyệt. Các thành phần cốt lõi:

| Thành phần | Mô tả | Công nghệ |
|-----------|-------|-----------|
| **Chat Interface** | Giao diện trò chuyện với AI để mô tả yêu cầu | React + Streaming |
| **LLM Integration** | Hỗ trợ 19+ AI providers (OpenAI, Anthropic, Gemini, Ollama...) | Vercel AI SDK |
| **Message Parser** | Parse AI response thành file actions, shell commands | Custom streaming parser |
| **WebContainer** | Chạy Node.js environment trong browser | @webcontainer/api |
| **Workbench** | Code editor + terminal + preview | CodeMirror + xterm.js |
| **Artifact System** | Hệ thống `<boltArtifact>` + `<boltAction>` tags | Custom XML-like tags |

### 1.2 EZBuilder hiện tại

| Thành phần | Trạng thái |
|-----------|-----------|
| Drag & Drop Editor | ✅ 31 Craft.js components |
| NestJS API | ✅ Auth, Websites, Pages CRUD |
| Database | ✅ User, Website, Page models |
| Multi-tenancy | ✅ Subdomain-based |
| State Management | ✅ Zustand + Craft.js internal |

### 1.3 Mục tiêu tích hợp

**KHÔNG** fork/embed toàn bộ bolt.diy. Thay vào đó, **lấy cảm hứng từ kiến trúc** bolt.diy để thêm khả năng:

1. **AI Chat Panel** — User mô tả bằng text → AI tạo/sửa Craft.js components trên canvas
2. **Multi-LLM Support** — Hỗ trợ nhiều LLM providers (OpenAI, Anthropic, Ollama, v.v.)
3. **Prompt System** — System prompt chuyên biệt cho Craft.js component generation
4. **Streaming Response** — Real-time streaming khi AI generate components
5. **Chat History** — Lưu trữ lịch sử chat per page/website

---

## 2. PHÂN TÍCH KIẾN TRÚC BOLT.DIY

### 2.1 Luồng hoạt động chính của bolt.diy

```
User nhập prompt
    ↓
Chat UI gửi request → POST /api/chat
    ↓
Server xử lý:
  - Parse messages + files context
  - Gọi LLM API với system prompt
  - Stream response về client
    ↓
Client parse streaming response:
  - StreamingMessageParser detect <boltArtifact> tags
  - Extract <boltAction type="file"> → tạo/sửa file
  - Extract <boltAction type="shell"> → chạy command
  - Extract <boltAction type="start"> → start dev server
    ↓
WebContainer thực thi:
  - Ghi file vào virtual filesystem
  - Chạy shell commands (npm install, etc.)
  - Start dev server → preview
```

### 2.2 Áp dụng cho EZBuilder

```
User nhập prompt (VD: "Tạo hero section với background gradient")
    ↓
Chat UI gửi request → POST /api/v1/ai/chat
    ↓
NestJS AI Module:
  - Parse messages + current canvas state (Craft.js JSON)
  - Gọi LLM API với EZBUILDER system prompt
  - Stream response về client
    ↓
Client parse streaming response:
  - Custom parser detect <ezAction> tags
  - Extract component definitions → Craft.js nodes
  - Apply changes to Craft.js editor state
    ↓
Craft.js Editor:
  - Thêm/sửa/xóa nodes trong canvas
  - Real-time preview ngay trên canvas
  - Auto-save sau 2s
```

### 2.3 Điểm khác biệt chính

| Aspect | bolt.diy | EZBuilder AI |
|--------|----------|-------------|
| Output | Source code files | Craft.js JSON nodes |
| Runtime | WebContainer (Node.js in browser) | Craft.js Editor API |
| Preview | iframe dev server | Trực tiếp trên canvas |
| Scope | Full-stack apps | Landing page components |
| Complexity | Rất cao | Vừa phải |

---

## 3. DATABASE SCHEMA MỚI

### 3.1 Models cần thêm

```prisma
// === THÊM VÀO schema.prisma ===

/// Cấu hình AI provider cho user
model AiProviderConfig {
  id        String   @id @default(uuid())
  provider  String   // "openai", "anthropic", "google", "ollama", "openrouter"
  apiKey    String?  // Encrypted API key (null cho Ollama local)
  baseUrl   String?  // Custom endpoint URL
  model     String?  // Default model for this provider
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, provider])
  @@index([userId])
  @@map("ai_provider_configs")
}

/// Phiên chat AI cho mỗi page
model AiChat {
  id        String   @id @default(uuid())
  title     String?  // Auto-generated from first message
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  pageId    String
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  messages  AiMessage[]

  @@index([pageId])
  @@index([userId])
  @@map("ai_chats")
}

/// Tin nhắn trong phiên chat
model AiMessage {
  id        String   @id @default(uuid())
  role      String   // "user", "assistant", "system"
  content   String   // Text content
  metadata  Json?    // { model, provider, tokens, duration, actions[] }
  createdAt DateTime @default(now())

  chatId    String
  chat      AiChat   @relation(fields: [chatId], references: [id], onDelete: Cascade)

  @@index([chatId])
  @@map("ai_messages")
}

/// Template prompt cho các use case phổ biến
model AiPromptTemplate {
  id          String   @id @default(uuid())
  name        String   // "Create Hero", "Add Contact Form", etc.
  category    String   // "section", "component", "layout", "style"
  prompt      String   // The actual prompt text
  description String?
  isSystem    Boolean  @default(false) // System-provided vs user-created
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String?  // null = system template
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([category])
  @@index([userId])
  @@map("ai_prompt_templates")
}
```

### 3.2 Cập nhật Models hiện tại

```prisma
model User {
  // ... existing fields ...
  
  // THÊM:
  aiProviderConfigs  AiProviderConfig[]
  aiChats            AiChat[]
  aiPromptTemplates  AiPromptTemplate[]
}

model Page {
  // ... existing fields ...
  
  // THÊM:
  aiChats  AiChat[]
}
```

### 3.3 ERD tổng thể

```
┌──────────┐     ┌───────────┐     ┌────────┐
│   User   │────<│  Website  │────<│  Page   │
└──────────┘     └───────────┘     └────────┘
     │                                  │
     │                                  │
     ├────<┌──────────────────┐         │
     │     │ AiProviderConfig │         │
     │     └──────────────────┘         │
     │                                  │
     ├────<┌──────────────────┐>────────┘
     │     │     AiChat       │
     │     └──────────────────┘
     │              │
     │              ├────<┌─────────────┐
     │              │     │  AiMessage   │
     │              │     └─────────────┘
     │
     ├────<┌──────────────────────┐
           │  AiPromptTemplate    │
           └──────────────────────┘
```

---

## 4. API DESIGN

### 4.1 Module mới: AI Module

**Base path:** `/api/v1/ai`

#### 4.1.1 AI Chat Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/ai/chat` | Gửi message và nhận streaming response | ✅ JWT |
| `GET` | `/ai/chats?pageId=xxx` | List chat sessions cho page | ✅ JWT |
| `GET` | `/ai/chats/:chatId` | Get chat với messages | ✅ JWT |
| `DELETE` | `/ai/chats/:chatId` | Xóa chat session | ✅ JWT |
| `PATCH` | `/ai/chats/:chatId` | Rename chat | ✅ JWT |

#### 4.1.2 AI Provider Config Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/ai/providers` | List configured providers | ✅ JWT |
| `POST` | `/ai/providers` | Add/update provider config | ✅ JWT |
| `DELETE` | `/ai/providers/:provider` | Remove provider config | ✅ JWT |
| `POST` | `/ai/providers/test` | Test provider connectivity | ✅ JWT |
| `GET` | `/ai/providers/:provider/models` | List available models | ✅ JWT |

#### 4.1.3 Prompt Template Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/ai/templates` | List prompt templates | ✅ JWT |
| `POST` | `/ai/templates` | Create custom template | ✅ JWT |
| `DELETE` | `/ai/templates/:id` | Delete custom template | ✅ JWT |

#### 4.1.4 Chat Request/Response Format

**Request: `POST /ai/chat`**

```json
{
  "chatId": "uuid-or-null",       // null = new chat
  "pageId": "page-uuid",
  "message": "Tạo hero section với gradient background xanh tím",
  "provider": "openai",           // optional, dùng default nếu không set
  "model": "gpt-4o",              // optional
  "canvasState": {                // Current Craft.js serialized state
    "ROOT": { ... },
    "node-1": { ... }
  },
  "contextMode": "full"           // "full" | "selected" - gửi full canvas hay chỉ selected node
}
```

**Response: Streaming (SSE)**

```
data: {"type":"start","chatId":"new-uuid"}

data: {"type":"text","content":"Tôi sẽ tạo một hero section..."}

data: {"type":"action_start","action":{"type":"add_node","targetParent":"ROOT"}}

data: {"type":"action_data","nodeData":{
  "type":"Hero",
  "displayName":"Hero Section",
  "props":{
    "title":"Welcome to My Site",
    "subtitle":"Build amazing things",
    "backgroundType":"gradient",
    "gradientFrom":"#3b82f6",
    "gradientTo":"#8b5cf6",
    "ctaText":"Get Started",
    "ctaUrl":"#"
  },
  "nodes":[]
}}

data: {"type":"action_end"}

data: {"type":"text","content":"\n\nĐã tạo hero section với gradient từ xanh sang tím."}

data: {"type":"done","usage":{"prompt_tokens":1200,"completion_tokens":350}}
```

### 4.2 NestJS Module Structure

```
api/src/modules/ai/
├── ai.module.ts                 # Module definition
├── ai.controller.ts             # REST endpoints
├── ai.service.ts                # Business logic orchestrator
├── ai.gateway.ts                # WebSocket gateway (optional, cho real-time)
│
├── dto/
│   ├── chat-message.dto.ts      # Input validation
│   ├── provider-config.dto.ts
│   └── prompt-template.dto.ts
│
├── providers/                   # LLM Provider abstraction
│   ├── llm-provider.interface.ts    # Common interface
│   ├── llm-provider.factory.ts      # Factory pattern
│   ├── openai.provider.ts
│   ├── anthropic.provider.ts
│   ├── google.provider.ts
│   ├── ollama.provider.ts
│   └── openrouter.provider.ts
│
├── parsers/
│   ├── response-parser.ts       # Parse AI response → actions
│   └── craft-action.parser.ts   # Convert actions → Craft.js nodes
│
├── prompts/
│   ├── system-prompt.ts         # Main system prompt
│   ├── component-specs.ts       # Component specifications for AI
│   └── prompt-builder.ts        # Dynamic prompt construction
│
└── services/
    ├── chat-history.service.ts  # Chat CRUD
    ├── provider-config.service.ts
    ├── prompt-template.service.ts
    └── encryption.service.ts    # API key encryption
```

---

## 5. SYSTEM PROMPT DESIGN

### 5.1 Triết lý (Lấy cảm hứng từ bolt.diy)

bolt.diy sử dụng system prompt rất chi tiết để hướng dẫn AI output code trong format `<boltArtifact>` + `<boltAction>`. EZBuilder cần system prompt tương tự nhưng output là **Craft.js node definitions**.

### 5.2 System Prompt cho EZBuilder

```typescript
// api/src/modules/ai/prompts/system-prompt.ts

export const EZBUILDER_SYSTEM_PROMPT = `
You are EZBuilder AI, an expert website builder assistant. You help users create 
and modify landing page components using a visual drag-and-drop editor powered by Craft.js.

<system_constraints>
  - You can ONLY work with the predefined component library listed below
  - You output structured JSON actions, NOT source code
  - Each action modifies the Craft.js node tree
  - You must respect the component prop types exactly
  - All colors should be valid CSS color values
  - All sizes should be valid CSS values (px, rem, %, etc.)
  - Image URLs should use placeholder services like picsum.photos or placehold.co
</system_constraints>

<available_components>
  1. Text - { content: string, fontSize: string, color: string, fontWeight: string, textAlign: string }
  2. Heading - { text: string, level: "h1"|"h2"|"h3"|"h4", color: string, textAlign: string }
  3. Image - { src: string, alt: string, width: string, height: string, borderRadius: string, objectFit: string }
  4. Button - { text: string, url: string, variant: "default"|"outline"|"ghost", size: "sm"|"md"|"lg", color: string, bgColor: string }
  5. Container - { padding: string, margin: string, bgColor: string, borderRadius: string, display: string, flexDirection: string, alignItems: string, justifyContent: string, gap: string, minHeight: string, bgImage: string }
  6. Spacer - { height: string }
  7. Divider - { color: string, thickness: string, margin: string }
  8. Video - { url: string, autoplay: boolean, controls: boolean }
  9. Icon - { name: string, size: string, color: string }
  10. Card - { title: string, description: string, imageUrl: string, bgColor: string, borderRadius: string }
  11. Grid - { columns: number, gap: string, padding: string }
  12. Columns - { columns: number, gap: string }
  13. Hero - { title: string, subtitle: string, backgroundType: string, bgColor: string, bgImage: string, gradientFrom: string, gradientTo: string, ctaText: string, ctaUrl: string, textColor: string, minHeight: string }
  14. Navbar - { logo: string, links: Array<{text: string, url: string}>, bgColor: string, textColor: string }
  15. Footer - { copyright: string, links: Array<{text: string, url: string}>, socialLinks: Array<{platform: string, url: string}>, bgColor: string, textColor: string }
  16. CTA - { title: string, description: string, buttonText: string, buttonUrl: string, bgColor: string }
  17. Testimonial - { quote: string, author: string, role: string, avatarUrl: string }
  18. Pricing - { title: string, price: string, period: string, features: string[], buttonText: string, isPopular: boolean }
  19. Stats - { items: Array<{value: string, label: string}> }
  20. Features / FeatureList - { features: Array<{icon: string, title: string, description: string}> }
  21. Gallery - { images: Array<{src: string, alt: string}>, columns: number }
  22. Accordion - { items: Array<{title: string, content: string}> }
  23. Tabs - { tabs: Array<{label: string, content: string}> }
  24. Form - { fields: Array<{type: string, label: string, placeholder: string}>, submitText: string }
  25. Social / SocialIcons - { links: Array<{platform: string, url: string}>, size: string }
</available_components>

<action_format>
  When modifying the canvas, wrap your changes in <ezAction> tags:

  To ADD a component:
  <ezAction type="add" parent="ROOT" position="end">
  {
    "type": "Hero",
    "displayName": "Hero Section",
    "props": {
      "title": "Welcome",
      "subtitle": "Your amazing website starts here",
      "backgroundType": "gradient",
      "gradientFrom": "#3b82f6",
      "gradientTo": "#8b5cf6",
      "ctaText": "Get Started",
      "ctaUrl": "#contact"
    },
    "children": []
  }
  </ezAction>

  To ADD a component with nested children:
  <ezAction type="add" parent="ROOT" position="end">
  {
    "type": "Container",
    "displayName": "Features Section",
    "props": {
      "padding": "64px 24px",
      "bgColor": "#f9fafb"
    },
    "children": [
      {
        "type": "Heading",
        "props": { "text": "Our Features", "level": "h2", "textAlign": "center" }
      },
      {
        "type": "Grid",
        "props": { "columns": 3, "gap": "24px" },
        "children": [
          {
            "type": "Card",
            "props": { "title": "Feature 1", "description": "Amazing feature", "imageUrl": "https://picsum.photos/400/300" }
          }
        ]
      }
    ]
  }
  </ezAction>

  To UPDATE a component's props:
  <ezAction type="update" nodeId="node-abc123">
  {
    "props": {
      "title": "New Title",
      "bgColor": "#1e40af"
    }
  }
  </ezAction>

  To DELETE a component:
  <ezAction type="delete" nodeId="node-abc123" />

  To MOVE a component:
  <ezAction type="move" nodeId="node-abc123" newParent="node-xyz" position="0" />

  To REPLACE entire canvas (for templates):
  <ezAction type="replace_all">
  {
    "nodes": [
      { "type": "Navbar", "props": { ... } },
      { "type": "Hero", "props": { ... } },
      { "type": "Footer", "props": { ... } }
    ]
  }
  </ezAction>
</action_format>

<response_guidelines>
  1. ALWAYS explain what you're going to do BEFORE the actions
  2. Use multiple <ezAction> tags for multiple changes
  3. Keep explanations concise and friendly (2-3 sentences)
  4. If the user's request is unclear, ask for clarification
  5. Suggest improvements proactively
  6. Use professional, modern design defaults:
     - Use a harmonious color palette
     - Proper spacing (multiples of 8px)
     - Readable font sizes (16px body, 24-48px headings)
     - High-quality placeholder images from picsum.photos
  7. When adding sections, consider the page flow and add appropriate spacing
  8. Response in the SAME LANGUAGE as the user's message
</response_guidelines>

<current_canvas>
{CANVAS_STATE_PLACEHOLDER}
</current_canvas>
`;
```

---

## 6. FRONTEND ARCHITECTURE

### 6.1 Tổng quan UI mới

```
┌─────────────────────────────────────────────────────────────────┐
│  🔷 EZBUILDER   File  View  Help           [🤖 AI] [Publish] │  ← Header
├──────────┬──────────────────────────────┬───────────┬──────────┤
│          │                              │           │          │
│  📝 Text │                              │ 🎨 Props  │  💬 AI   │
│  🔘 Btn  │    ┌──────────────────┐     │ ───────── │  Chat    │
│  🖼️ Img  │    │                  │     │ Text: []  │          │
│  📦 Box  │    │     CANVAS       │     │ Size: []  │  User:   │
│          │    │                  │     │ Color:[]  │  "Tạo    │
│  ─────── │    │                  │     │           │   hero"  │
│  Templates│   │                  │     │           │          │
│  [Hero]  │    │                  │     │ [🗑️ Del]  │  AI:     │
│  [About] │    │                  │     │           │  "Tôi sẽ │
│  [Contact]│   │                  │     │           │   tạo.." │
│          │    └──────────────────┘     │           │  [nodes] │
│          │                              │           │  ✅ Done │
│  Layers  │                              │           │          │
│  ─────── │                              │           │  [input] │
│  > Navbar│                              │           │  [Send]  │
│  > Hero  │                              │           │          │
│  > Footer│                              │           │          │
└──────────┴──────────────────────────────┴───────────┴──────────┘
   250px              auto                    280px      320px
```

### 6.2 Cấu trúc Components mới

```
web/components/
├── ai/                              # AI Chat components
│   ├── AiChatPanel.tsx              # Main chat panel (collapsible sidebar)
│   ├── AiChatMessage.tsx            # Single message bubble
│   ├── AiChatInput.tsx              # Input with send button
│   ├── AiActionPreview.tsx          # Preview of pending AI actions
│   ├── AiProviderSelector.tsx       # Dropdown to select LLM provider
│   ├── AiPromptSuggestions.tsx      # Quick prompt buttons
│   ├── AiSettingsDialog.tsx         # Provider API key configuration
│   └── AiStreamingIndicator.tsx     # Typing/generating indicator
│
├── editor/
│   ├── Builder.tsx                  # MODIFIED: Add AI panel toggle
│   └── ...existing...
```

### 6.3 State Management mới

```typescript
// web/lib/stores/ai-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  actions?: AiAction[];
  timestamp: Date;
  metadata?: {
    model?: string;
    provider?: string;
    tokens?: number;
    duration?: number;
  };
}

interface AiAction {
  type: 'add' | 'update' | 'delete' | 'move' | 'replace_all';
  status: 'pending' | 'applied' | 'rejected';
  nodeData?: any;
  nodeId?: string;
  parent?: string;
  position?: string | number;
}

interface AiState {
  // Chat state
  currentChatId: string | null;
  messages: AiMessage[];
  isStreaming: boolean;
  isPanelOpen: boolean;
  
  // Provider state
  activeProvider: string;  // "openai" | "anthropic" | etc.
  activeModel: string;
  
  // Actions
  togglePanel: () => void;
  sendMessage: (content: string, canvasState: any, pageId: string) => Promise<void>;
  applyAction: (actionIndex: number) => void;
  rejectAction: (actionIndex: number) => void;
  clearChat: () => void;
  loadChat: (chatId: string) => Promise<void>;
  setProvider: (provider: string, model: string) => void;
}
```

### 6.4 API Client mới

```typescript
// web/lib/api/ai.ts

export const aiApi = {
  // Stream chat - returns ReadableStream
  chat: async (data: {
    chatId?: string;
    pageId: string;
    message: string;
    provider?: string;
    model?: string;
    canvasState: any;
    contextMode?: 'full' | 'selected';
  }) => {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return response; // Handle SSE stream on client
  },

  // Chat history
  getChats: (pageId: string) => api.get(`/ai/chats?pageId=${pageId}`),
  getChat: (chatId: string) => api.get(`/ai/chats/${chatId}`),
  deleteChat: (chatId: string) => api.delete(`/ai/chats/${chatId}`),

  // Provider config
  getProviders: () => api.get('/ai/providers'),
  saveProvider: (data: any) => api.post('/ai/providers', data),
  deleteProvider: (provider: string) => api.delete(`/ai/providers/${provider}`),
  testProvider: (data: any) => api.post('/ai/providers/test', data),
  getModels: (provider: string) => api.get(`/ai/providers/${provider}/models`),

  // Templates
  getTemplates: () => api.get('/ai/templates'),
  createTemplate: (data: any) => api.post('/ai/templates', data),
};
```

---

## 7. RESPONSE PARSER (Lấy cảm hứng từ bolt.diy)

### 7.1 bolt.diy Parser Flow

bolt.diy sử dụng `StreamingMessageParser` → detect `<boltArtifact>` → extract `<boltAction>` → execute actions (write files, run shell commands).

### 7.2 EZBuilder Parser

```typescript
// web/lib/ai/response-parser.ts

interface EzAction {
  type: 'add' | 'update' | 'delete' | 'move' | 'replace_all';
  parent?: string;
  position?: string | number;
  nodeId?: string;
  newParent?: string;
  nodeData?: any;
  props?: any;
}

interface ParseResult {
  textSegments: string[];    // AI explanation text
  actions: EzAction[];       // Craft.js actions
}

export class EzBuilderResponseParser {
  private buffer: string = '';

  /**
   * Parse streaming AI response, extract text and <ezAction> tags
   * Inspired by bolt.diy's StreamingMessageParser
   */
  parse(chunk: string): { text: string; actions: EzAction[] } {
    this.buffer += chunk;
    
    const result = { text: '', actions: [] as EzAction[] };
    
    // Extract complete <ezAction>...</ezAction> pairs
    const actionRegex = /<ezAction\s+([^>]*)>([\s\S]*?)<\/ezAction>/g;
    const selfClosingRegex = /<ezAction\s+([^>]*)\s*\/>/g;
    
    let lastIndex = 0;
    let match;
    
    while ((match = actionRegex.exec(this.buffer)) !== null) {
      // Text before action
      result.text += this.buffer.slice(lastIndex, match.index);
      
      // Parse action
      const attributes = this.parseAttributes(match[1]);
      const content = match[2].trim();
      
      try {
        const nodeData = content ? JSON.parse(content) : null;
        result.actions.push({
          type: attributes.type as EzAction['type'],
          parent: attributes.parent,
          position: attributes.position,
          nodeId: attributes.nodeId || attributes.nodeid,
          newParent: attributes.newParent || attributes.newparent,
          nodeData,
          props: nodeData?.props,
        });
      } catch (e) {
        console.warn('Failed to parse action content:', e);
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Self-closing actions (delete)
    while ((match = selfClosingRegex.exec(this.buffer)) !== null) {
      const attributes = this.parseAttributes(match[1]);
      result.actions.push({
        type: attributes.type as EzAction['type'],
        nodeId: attributes.nodeId || attributes.nodeid,
      });
    }
    
    // Remaining text after last action
    result.text += this.buffer.slice(lastIndex);
    
    // Clear processed buffer
    this.buffer = '';
    
    return result;
  }

  private parseAttributes(attrString: string): Record<string, string> {
    const attrs: Record<string, string> = {};
    const regex = /(\w+)="([^"]*)"/g;
    let match;
    while ((match = regex.exec(attrString)) !== null) {
      attrs[match[1]] = match[2];
    }
    return attrs;
  }
  
  reset() {
    this.buffer = '';
  }
}
```

### 7.3 Craft.js Action Executor

```typescript
// web/lib/ai/craft-action-executor.ts

import { useEditor } from '@craftjs/core';

/**
 * Executes parsed AI actions on the Craft.js editor
 */
export function useCraftActionExecutor() {
  const { actions, query } = useEditor();

  const executeAction = (action: EzAction) => {
    switch (action.type) {
      case 'add':
        return addNode(actions, action);
      case 'update':
        return updateNode(actions, action);
      case 'delete':
        return deleteNode(actions, action);
      case 'move':
        return moveNode(actions, action);
      case 'replace_all':
        return replaceAll(actions, query, action);
    }
  };

  return { executeAction };
}

function addNode(actions: any, action: EzAction) {
  // Use Craft.js actions.add() to create node tree
  // Recursively handle children
  const { nodeData, parent = 'ROOT', position } = action;
  
  // Build Craft.js node from AI output
  const craftNode = buildCraftNode(nodeData);
  
  // Add to editor
  actions.add(craftNode, parent, position === 'end' ? undefined : Number(position));
}

function updateNode(actions: any, action: EzAction) {
  if (!action.nodeId) return;
  actions.setProp(action.nodeId, (props: any) => {
    Object.assign(props, action.props);
  });
}

function deleteNode(actions: any, action: EzAction) {
  if (!action.nodeId) return;
  actions.delete(action.nodeId);
}
```

---

## 8. LLM PROVIDER ABSTRACTION

### 8.1 Provider Interface (Backend)

```typescript
// api/src/modules/ai/providers/llm-provider.interface.ts

export interface LlmProvider {
  name: string;
  
  /** Stream chat completion */
  streamChat(params: {
    messages: ChatMessage[];
    model: string;
    temperature?: number;
    maxTokens?: number;
  }): AsyncGenerator<string>;  // yields text chunks
  
  /** List available models */
  listModels(): Promise<ModelInfo[]>;
  
  /** Test connectivity */
  testConnection(): Promise<boolean>;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  contextWindow: number;
  supportsStreaming: boolean;
}
```

### 8.2 Supported Providers (lấy từ bolt.diy)

| Priority | Provider | Package | Notes |
|----------|----------|---------|-------|
| P0 | OpenAI | `openai` | GPT-4o, GPT-4o-mini |
| P0 | Anthropic | `@anthropic-ai/sdk` | Claude 3.5 Sonnet, Claude 3 Opus |
| P1 | Google Gemini | `@google/generative-ai` | Gemini 1.5 Pro |
| P1 | Ollama | HTTP API | Local models, free |
| P2 | OpenRouter | OpenAI-compatible | Access to 100+ models |
| P2 | DeepSeek | OpenAI-compatible | DeepSeek Coder |
| P2 | Groq | OpenAI-compatible | Fast inference |

### 8.3 Vercel AI SDK (Recommended)

bolt.diy sử dụng **Vercel AI SDK** (`ai` package) để abstract hóa nhiều providers. EZBuilder nên dùng tương tự ở **backend NestJS**:

```typescript
// api/src/modules/ai/ai.service.ts

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { ollama } from 'ollama-ai-provider';

export class AiService {
  async streamChat(params: ChatParams): AsyncGenerator<string> {
    const provider = this.getProvider(params.provider, params.apiKey);
    
    const result = streamText({
      model: provider(params.model),
      messages: params.messages,
      temperature: 0.7,
      maxTokens: 4096,
    });
    
    for await (const chunk of result.textStream) {
      yield chunk;
    }
  }
  
  private getProvider(name: string, apiKey: string) {
    switch (name) {
      case 'openai': return openai.chat(apiKey);
      case 'anthropic': return anthropic.chat(apiKey);
      case 'google': return google.chat(apiKey);
      case 'ollama': return ollama; // No API key needed
      default: throw new Error(`Unknown provider: ${name}`);
    }
  }
}
```

---

## 9. SECURITY CONSIDERATIONS

### 9.1 API Key Management

bolt.diy lưu API keys trong browser cookies. EZBuilder nên lưu **server-side**, encrypted:

| Aspect | bolt.diy | EZBuilder (Recommended) |
|--------|----------|------------------------|
| Storage | Browser cookies | PostgreSQL (encrypted) |
| Encryption | None (client-side) | AES-256-GCM server-side |
| Transmission | Cookie header | HTTPS body → server encrypts |
| Access | Client reads directly | Server-only, never sent back |

```typescript
// api/src/modules/ai/services/encryption.service.ts

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer; // from env: AI_ENCRYPTION_KEY

  encrypt(text: string): string { ... }
  decrypt(encrypted: string): string { ... }
}
```

### 9.2 Rate Limiting

```typescript
// Áp dụng rate limit cho AI endpoints
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests/minute
@Controller('ai')
export class AiController { ... }
```

### 9.3 Input Validation

- Validate `canvasState` JSON size (max 500KB)
- Sanitize user message (prevent prompt injection)
- Validate provider/model names against whitelist

---

## 10. IMPLEMENTATION PHASES

### Phase 1: Foundation (1-2 tuần)

**Backend:**
- [ ] Thêm models vào Prisma schema + migration
- [ ] Tạo AI module skeleton (controller, service, DTOs)
- [ ] Implement EncryptionService
- [ ] Implement AiProviderConfig CRUD
- [ ] Implement 1 provider: OpenAI (dùng Vercel AI SDK)
- [ ] Implement SSE streaming endpoint `/ai/chat`

**Frontend:**
- [ ] Tạo AI store (Zustand)
- [ ] Tạo AiChatPanel component (basic)
- [ ] Tạo AiChatInput + AiChatMessage components
- [ ] Tạo EzBuilderResponseParser
- [ ] Integrate panel vào Builder.tsx
- [ ] SSE client handling

**Deliverable:** User có thể mở AI panel, gõ prompt, nhận text response từ OpenAI.

### Phase 2: Action System (1-2 tuần)

**Backend:**
- [ ] Design + test system prompt
- [ ] Implement response format validation
- [ ] Implement chat history (AiChat + AiMessage CRUD)
- [ ] Thêm canvas state context vào prompt

**Frontend:**
- [ ] Implement CraftActionExecutor (add/update/delete nodes)
- [ ] Implement action preview UI (show pending changes)
- [ ] Accept/Reject action buttons
- [ ] Auto-apply mode toggle
- [ ] Undo integration (Ctrl+Z undoes AI action)

**Deliverable:** AI có thể tạo/sửa Craft.js components trên canvas theo prompt.

### Phase 3: Multi-Provider + Polish (1-2 tuần)

**Backend:**
- [ ] Thêm Anthropic provider
- [ ] Thêm Google Gemini provider
- [ ] Thêm Ollama provider (local)
- [ ] Thêm OpenRouter provider
- [ ] Implement `/ai/providers/test` endpoint
- [ ] Implement `/ai/providers/:provider/models` endpoint

**Frontend:**
- [ ] AiProviderSelector UI
- [ ] AiSettingsDialog (API key management)
- [ ] Provider status indicators
- [ ] Model selector per provider

**Deliverable:** User có thể chọn từ nhiều AI providers khác nhau.

### Phase 4: UX Enhancement (1-2 tuần)

**Backend:**
- [ ] Implement AiPromptTemplate CRUD
- [ ] Seed system templates

**Frontend:**
- [ ] AiPromptSuggestions (quick action buttons)
- [ ] Chat history sidebar
- [ ] Context mode selector (full canvas vs selected node)
- [ ] Image context (attach screenshot of canvas)
- [ ] Error handling + retry logic
- [ ] Loading states + skeleton UI
- [ ] Keyboard shortcuts (Ctrl+I to toggle AI panel)

**Deliverable:** Polished AI experience với prompt templates và chat history.

---

## 11. DEPENDENCIES MỚI

### 11.1 Backend (api/package.json)

```json
{
  "dependencies": {
    "ai": "^4.x",                        // Vercel AI SDK
    "@ai-sdk/openai": "^1.x",           // OpenAI provider
    "@ai-sdk/anthropic": "^1.x",        // Anthropic provider  
    "@ai-sdk/google": "^1.x",           // Google Gemini provider
    "ollama-ai-provider": "^1.x",       // Ollama provider
    "@ai-sdk/openai-compatible": "^1.x"  // OpenRouter, DeepSeek, Groq
  }
}
```

### 11.2 Frontend (web/package.json)

```json
{
  "dependencies": {
    "eventsource-parser": "^3.x",  // SSE parsing
    "react-markdown": "^9.x",     // Render AI markdown responses
    "remark-gfm": "^4.x"          // GitHub Flavored Markdown
  }
}
```

---

## 12. ENVIRONMENT VARIABLES MỚI

```env
# api/.env

# AI Encryption (required)
AI_ENCRYPTION_KEY=your-32-byte-hex-key-here

# Default AI Provider (optional - users configure their own)
DEFAULT_AI_PROVIDER=openai
DEFAULT_AI_MODEL=gpt-4o-mini

# Server-side API keys (optional fallback)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Ollama (for local development)
OLLAMA_BASE_URL=http://127.0.0.1:11434

# Rate limiting
AI_RATE_LIMIT_RPM=20
AI_MAX_TOKENS=4096
```

---

## 13. RISKS & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI output không đúng format `<ezAction>` | High | Robust parser với fallback, retry logic, prompt engineering |
| Craft.js API không hỗ trợ programmatic add | High | Research + prototype trước khi bắt đầu |
| API key bị leak | Critical | Server-side encryption, never return keys in API |
| LLM latency cao | Medium | Streaming response, loading indicators |
| Token cost tăng nhanh | Medium | Token counting, rate limiting, model selection |
| System prompt quá dài | Medium | Dynamic prompt chỉ include relevant components |
| User gửi canvas state quá lớn | Medium | Compress/truncate canvas state, context modes |
| Prompt injection | Medium | Input sanitization, system prompt hardening |

---

## 14. SO SÁNH VỚI BOLT.DIY

### Những gì LẤY từ bolt.diy:

| Feature | Adaptation |
|---------|-----------|
| Multi-LLM support qua Vercel AI SDK | ✅ Giống hệt |
| Streaming response parser | ✅ Adapted: `<boltArtifact>` → `<ezAction>` |
| Provider configuration UI | ✅ Tương tự nhưng đơn giản hơn |
| System prompt engineering | ✅ Adapted cho Craft.js components |
| Chat history persistence | ✅ Nhưng dùng PostgreSQL thay IndexedDB |
| Action preview (diff view) | ✅ Adapted: preview component changes |

### Những gì KHÔNG lấy từ bolt.diy:

| Feature | Reason |
|---------|--------|
| WebContainer | Không cần - EZBuilder dùng Craft.js, không chạy code |
| File system (virtual) | Không cần - output là JSON nodes, không phải files |
| Terminal | Không cần - không có shell commands |
| Git integration | Không cần cho MVP |
| Deploy (Netlify/Vercel) | Đã có riêng trong EZBuilder |
| Electron desktop app | Out of scope |
| Remix framework | EZBuilder dùng Next.js |

---

## 15. TỔNG KẾT

### Effort Estimate

| Phase | Duration | Complexity |
|-------|----------|-----------|
| Phase 1: Foundation | 1-2 tuần | Medium |
| Phase 2: Action System | 1-2 tuần | High (core feature) |
| Phase 3: Multi-Provider | 1-2 tuần | Medium |
| Phase 4: UX Enhancement | 1-2 tuần | Medium |
| **Total** | **4-8 tuần** | |

### Technical Decision Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| LLM SDK | Vercel AI SDK | bolt.diy đã chứng minh, hỗ trợ 19+ providers |
| Output format | Custom `<ezAction>` XML tags | Tương tự `<boltArtifact>` nhưng cho Craft.js |
| API key storage | Server-side encrypted | An toàn hơn bolt.diy (client cookies) |
| Chat history | PostgreSQL | Consistent với stack hiện tại |
| Streaming | SSE (Server-Sent Events) | Đơn giản, đủ cho text streaming |
| State management | Zustand | Consistent với project hiện tại |

---

*Document created: 2026-02-12*
*Last updated: 2026-02-12*
