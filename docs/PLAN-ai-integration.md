# PLAN: AI Integration (Google Gemini) — EZBuilder

## Ngày: 2026-02-15

## Trạng thái: Approved

---

## Decisions

| Item               | Decision                                                           |
| ------------------ | ------------------------------------------------------------------ |
| **Provider**       | Google Gemini (`@ai-sdk/google`) — server-side default key         |
| **Model**          | `gemini-2.5-pro` (hoặc latest preview)                             |
| **API Key**        | Server-side (`GOOGLE_AI_API_KEY` env var), không BYOK              |
| **Multi-Provider** | Không (chỉ Gemini) — Phase 3 skipped                               |
| **Action Mode**    | Auto-apply (AI tạo → tự động apply lên canvas)                     |
| **Inspiration**    | bolt.diy patterns (streaming parser, system prompt, action format) |

---

## Phase 1: Foundation (1-2 tuần)

### Backend

- [ ] **1.1 DB Schema**: Thêm `AiChat`, `AiMessage`, `AiPromptTemplate` models vào `schema.prisma`
- [ ] **1.2 Migration**: Chạy `npx prisma migrate dev`
- [ ] **1.3 AI Module**: Tạo `api/src/modules/ai/` (module, controller, service, DTOs)
- [ ] **1.4 SSE Streaming**: `POST /ai/chat` → stream Gemini response qua SSE
- [ ] **1.5 Chat History**: `GET/DELETE /ai/chats` endpoints
- [ ] **1.6 Register Module**: Import `AiModule` vào `AppModule`
- [ ] **1.7 Env Config**: `GOOGLE_AI_API_KEY` + `AI_DEFAULT_MODEL`

### Frontend

- [ ] **1.8 AI Store**: Zustand store (`web/lib/stores/ai-store.ts`)
- [ ] **1.9 Chat UI**: `AiChatPanel`, `AiChatMessage`, `AiChatInput`, `AiStreamingIndicator`
- [ ] **1.10 Builder Integration**: AI toggle button + sidebar trong `Builder.tsx`
- [ ] **1.11 API Client**: SSE fetch client (`web/lib/api/ai.ts`)

### Dependencies

```bash
# Backend: thay @ai-sdk/openai bằng @ai-sdk/google
cd api && npm uninstall @ai-sdk/openai && npm install @ai-sdk/google

# Frontend: SSE + markdown rendering
cd web && npm install eventsource-parser react-markdown remark-gfm
```

### Deliverable

User mở editor → click 🤖 → gõ text → nhận streaming text response từ Gemini.

---

## Phase 2: Action System (1-2 tuần)

### Backend

- [ ] **2.1 System Prompt**: Component specs cho 32 Craft.js components + `<ezAction>` format
- [ ] **2.2 Prompt Builder**: Dynamic context injection (canvas state, selected node)
- [ ] **2.3 Canvas Context**: Gửi current Craft.js state trong chat request

### Frontend

- [ ] **2.4 Response Parser**: `EzBuilderResponseParser` — detect `<ezAction>` tags
- [ ] **2.5 Action Executor**: `useCraftActionExecutor()` — auto-apply (add/update/delete/move)
- [ ] **2.6 Action Indicators**: Show applied actions inline trong chat messages

### Deliverable

User gõ "Tạo hero section gradient xanh tím" → Hero component tự động xuất hiện trên canvas.

---

## Phase 4: UX Polish (1 tuần)

- [ ] **4.1 Prompt Suggestions**: Quick action buttons ("Tạo Hero", "Thêm Contact Form"...)
- [ ] **4.2 Prompt Templates DB**: Seed system templates
- [ ] **4.3 Chat History UI**: List past chats per page
- [ ] **4.4 Keyboard Shortcuts**: `Ctrl+I` toggle AI panel
- [ ] **4.5 Polish**: Error handling, retry, skeleton loading, markdown rendering

### Deliverable

Polished AI experience với quick actions, history, shortcuts.

---

## Environment Variables

```env
# api/.env
GOOGLE_AI_API_KEY=your-key-from-ai.google.dev
AI_DEFAULT_MODEL=gemini-2.5-pro
```

---

## Verification

| Phase | Test Case     | Pass Criteria                                      |
| ----- | ------------- | -------------------------------------------------- |
| 1     | Text chat     | Gõ "Xin chào" → nhận text streaming response       |
| 2     | Component gen | "Tạo hero gradient xanh tím" → Hero node on canvas |
| 4     | Quick action  | Click button → prompt fills → response renders     |

```bash
cd api && npx jest --testPathPattern="modules/ai"
```
