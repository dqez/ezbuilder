# EZBuilder

> An advanced AI-powered website builder platform that allows users to create stunning websites through intuitive drag-and-drop mechanics and generative AI.

![EZBuilder Banner](./docs/images/banner.png)

## Preview & Screenshots

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>Dashboard & Project Management</h3>
      <p>Manage your website projects, view comprehensive statistics, and organize your work seamlessly.</p>
      <img src="./docs/images/dashboard.png" width="100%" alt="Dashboard Preview"/>
    </td>
    <td width="50%" valign="top">
      <h3>Drag-and-Drop Builder Interface</h3>
      <p>An intuitive, real-time feedback editor for high customizability and pixel-perfect design.</p>
      <img src="./docs/images/builder.png" width="100%" alt="Builder Preview"/>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>AI Design Assistant</h3>
      <p>Generate, iterate, and refine UI components using natural language via the integrated AI Assistant.</p>
      <img src="./docs/images/ai-assistant.png" width="100%" alt="AI Assistant Preview"/>
    </td>
    <td width="50%" valign="top">
      <h3>Starter Templates</h3>
      <p>Choose from a variety of professional templates to kickstart your website.</p>
      <img src="./docs/images/templates.png" width="100%" alt="Templates Preview"/>
    </td>
  </tr>
</table>

---

## Key Features

- **Advanced Visual Editor**: Powered by Craft.js, enabling precise, flexible, and responsive component layout editing.
- **AI-Powered Generation**: Built-in AI assistant integrated with Google Gen AI to generate website structures and polished designs from text prompts.
- **Template Library**: Jumpstart your creation process with pre-designed, aesthetic templates.
- **Project Dashboard**: A fully-featured dashboard with search, filtering, and responsive grid layouts to manage websites.
- **Secure Authentication**: Robust authentication system combining JWT and Google Web Auth (SSO) with custom domain redirect support.
- **Modern UI/UX**: Interfaces built with modern design principles utilizing Tailwind CSS v4, shadcn/ui, and Framer Motion.

---

## Tech Stack

### Frontend (`/web`)

- **Core Strategy**: [Next.js](https://nextjs.org/) (React 19)
- **Styling Engine**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **Editor Core**: [Craft.js](https://craft.js.org/)
- **State Management**: Zustand
- **Content Rendering**: react-markdown

### Backend (`/api`)

- **Core Framework**: [NestJS](https://nestjs.com/) (Node.js 22)
- **Database & Engine**: PostgreSQL with Prisma ORM
- **AI Integration**: Vercel AI SDK & Google Generative AI
- **Security & Auth**: Passport.js (JWT & Google OAuth2.0), bcrypt, helmet
- **Validation**: Zod, class-transformer, class-validator

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- PostgreSQL Server
- Google Gemini API Key
- Google OAuth Client Credentials (for Auth)

### 1. Backend Setup

\`\`\`bash
cd api
npm install

# Setup your environment variables

cp .env.example .env

# Run database migrations

npx prisma generate
npx prisma db push # or npx prisma migrate dev

# Start the development server

npm run start:dev
\`\`\`

### 2. Frontend Setup

\`\`\`bash
cd web
npm install

# Setup your environment variables

cp .env.example .env

# Start the development server

npm run dev
\`\`\`

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).  
Copyright © 2026 **Tran Dinh Quy**.
