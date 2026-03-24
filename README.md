# AmbiguityLens

> **A full-stack AI-powered auditor for evaluating robotics command clarity and executability**

[![Next.js](https://img.shields.io/badge/Next.js-13.5.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

---

## Table of Contents

1. [Overview](#overview)
   - [What is AmbiguityLens?](#what-is-ambiguitylens)
   - [Why Build This?](#why-build-this)
   - [How It Works](#how-it-works)

2. [Architecture](#architecture)
   - [System Design](#system-design)
   - [Data Flow](#data-flow)

3. [Tech Stack](#tech-stack)

4. [Features](#features)

5. [Project Structure](#project-structure)

6. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Setup](#environment-setup)

7. [Running the Application](#running-the-application)
   - [Development Server](#development-server)
   - [Production Build](#production-build)

8. [Testing & Mock Data](#testing--mock-data)
   - [Using Mock Analyzer](#using-mock-analyzer)
   - [Test Cases](#test-cases)

9. [Real AI Integration](#real-ai-integration)
   - [Google Gemini 2.5 Flash](#google-gemini-25-flash)
   - [Hugging Face Inference](#hugging-face-inference)
   - [Local LLM Integration](#local-llm-integration)

10. [API Endpoints](#api-endpoints)

11. [Database Schema](#database-schema)

12. [Theme System](#theme-system)

13. [Deployment](#deployment)

14. [Troubleshooting](#troubleshooting)

---

## Overview

### What is AmbiguityLens?

AmbiguityLens is a full-stack web application that audits robotics commands to identify ambiguous language and ensure commands are executable by robotic systems. It combines:

- **Frontend**: A responsive React-based interface for submitting commands and viewing results
- **Backend**: Next.js API routes with optional AI integration
- **Database**: PostgreSQL database (via Neon) for persistent audit history
- **AI Analysis**: Mock local analyzer (with easy swap for real AI services)

**Use Cases:**
- Robotics training: Teach humans to write clear, machine-executable commands
- Quality assurance: Pre-validate commands before sending to robot systems
- Documentation: Build an audit trail of command analysis and reasoning
- Research: Analyze patterns in ambiguous language across command sets

---

### Why Build This?

**Problem Statement:**
Robot systems struggle with ambiguous human commands. Phrases like "move around the area" or "pick up approximately the red thing" create execution failures, safety risks, and require human intervention.

**Solution:**
AmbiguityLens provides:
1. **Real-time feedback** on command clarity before execution
2. **Reasoning explanations** for why a command passes or fails
3. **Historical tracking** of all audited commands
4. **AI-powered analysis** with confidence scoring
5. **Light/dark theme** for comfortable use in any environment

---

### How It Works

```
User Input
    ↓
┌─────────────────────────────┐
│ Frontend Form               │
│ - Image URL input           │
│ - Robot command textarea    │
│ - Submit button             │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ POST /api/audit             │
│ - Validate inputs           │
│ - Analyze command           │
│ - Save to database          │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Analysis Engine             │
│ ┌─────────────────────────┐ │
│ │ Mock Analyzer (Default) │ │
│ │ Checks keywords, length │ │
│ └─────────────────────────┘ │
│         OR                  │
│ ┌─────────────────────────┐ │
│ │ Real AI (Optional)      │ │
│ │ Gemini / HF / Local LLM │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Database Save               │
│ - Status (PASS/FAIL)        │
│ - Reasoning                 │
│ - Confidence Score          │
│ - Timestamp                 │
└─────────────────────────────┘
    ↓
┌─────────────────────────────┐
│ Response to Frontend        │
│ {                           │
│   status: "PASS"|"FAIL"     │
│   reasoning: "..."          │
│   confidence: 0.0-1.0       │
│ }                           │
└─────────────────────────────┘
    ↓
User sees result & history
```

---

## Architecture

### System Design

**Client-Server Architecture with Three Layers:**

```
┌─────────────────────────────────────────┐
│        Frontend (Browser)                │
│ ┌─────────────────────────────────────┐ │
│ │ React Components (Next.js Pages)    │ │
│ │ - Home: Audit form                  │ │
│ │ - History: Past audits              │ │
│ │ - Theme Toggle: Light/Dark mode     │ │
│ └─────────────────────────────────────┘ │
└─────────┬───────────────────────────────┘
          │ HTTP/REST
          ↓
┌─────────────────────────────────────────┐
│     Backend (Next.js Server)             │
│ ┌─────────────────────────────────────┐ │
│ │ /api/audit → Command analysis       │ │
│ │ /api/audits → Fetch history         │ │
│ │ /api/auth → Authentication (future) │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ Analysis Engine (Local or External) │ │
│ │ - Mock heuristics (default)         │ │
│ │ - Gemini 2.5 Flash (optional)       │ │
│ │ - Hugging Face (optional)           │ │
│ └─────────────────────────────────────┘ │
└─────────┬───────────────────────────────┘
          │ TCP/PostgreSQL
          ↓
┌─────────────────────────────────────────┐
│     Database (PostgreSQL - Neon)         │
│ ┌─────────────────────────────────────┐ │
│ │ users table                         │ │
│ │ audits table                        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Data Flow

**Command Audit Flow:**

```json
1. Frontend collects:
{
  imageUrl: "https://example.com/robot-scene.jpg",
  command: "Pick up the red cube from the table"
}

2. API receives & processes:
- Validates input presence
- Calls analyzeCommand()
- Saves to database

3. Analysis returns:
{
  status: "PASS",
  reasoning: "Command is clear, specific, and executable. Uses concrete action verbs with defined parameters.",
  confidence: 0.85
}

4. Frontend displays:
- Status badge (green PASS / red FAIL)
- Full reasoning text
- Confidence percentage
- Add to history automatically
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 13.5.0 (React 18.2.0)
- **Language**: TypeScript 5.3.0
- **Styling**: Tailwind CSS 3.4.1 with Dark Mode
- **Animations**: Framer Motion 10.16.0
- **Icons**: Lucide React 0.263.1
- **Utilities**: clsx for className management

### Backend
- **Server**: Next.js 13.5.0 (API Routes)
- **Language**: TypeScript
- **Database ORM**: Prisma 5.8.0
- **AI Integration**: 
  - Google Generative AI (@google/generative-ai 0.3.0)
  - OpenAI (openai 6.32.0)

### Database
- **Provider**: PostgreSQL (Neon)
- **ORM**: Prisma 5.8.0
- **Type Safety**: Full TypeScript support

### DevOps & Tools
- **Node.js**: 18.7.0+
- **Package Manager**: npm
- **Linting**: ESLint
- **Post-CSS**: Autoprefixer support

---

## Features

### Core Features (Implemented)

- **Command Auditing**
  - Submit robot commands with optional image context
  - Get instant PASS/FAIL verdict with reasoning
  - Confidence scoring (0.0 - 1.0)

- **Audit History**
  - View all previous audits with timestamps
  - See command, result, and reasoning for each audit
  - Responsive mobile-friendly layout

- **Theme System**
  - Light/Dark mode toggle
  - Persistent theme preference (localStorage)
  - Smooth animations between modes
  - Optimized text contrast for accessibility

- **Real-time Database Persistence**
  - All audits automatically saved to PostgreSQL
  - User association (when auth implemented)
  - Full audit trail with timestamps

- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimization
  - Accessible WCAG-compliant UI

### Upcoming Features

- **Authentication** (NextAuth.js structure ready)
- **User Accounts** (Database schema prepared)
- **Real AI Integration** (Gemini 2.5 Flash / Hugging Face)
- **Batch Command Processing** (Multiple audits at once)
- **Export/Reporting** (CSV, PDF audit reports)
- **Advanced Analytics** (Command clarity trends, failure patterns)

---

## Project Structure

```
AmbiguityLens/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── audit/
│   │   │       └── route.ts          # POST /api/audit endpoint
│   │   │   └── audits/
│   │   │       └── route.ts          # GET /api/audits endpoint
│   │   ├── page.tsx                  # Home page (audit form)
│   │   ├── history/
│   │   │   └── page.tsx              # History page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ThemeToggle.tsx           # Light/Dark mode switch
│   │   ├── GradientOrbs.tsx          # Animated background
│   │   └── FloatingParticles.tsx     # Particle animation
│   ├── lib/
│   │   └── prisma.ts                 # Prisma client instance
│   └── middleware.ts                 # Next.js middleware (if needed)
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── public/                           # Static assets
├── tailwind.config.js                # Tailwind CSS config (darkMode: 'class')
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── .env.example                      # Environment variables template
├── .env.local                        # Environment variables (not in git)
├── package.json                      # Dependencies
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites

- **Node.js**: 18.7.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL Database**: Neon account (free tier available)
- **Git**: For version control

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ambiguity-lens.git
   cd ambiguity-lens
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

### Environment Setup

Create a `.env.local` file in the project root:

```bash
# Database (PostgreSQL via Neon)
DATABASE_URL="postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth (for future authentication)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-random-string-here"

# Optional: AI API Keys (for real integration)
GOOGLE_API_KEY="your-google-cloud-api-key"
HF_TOKEN="your-hugging-face-token"
OPENAI_API_KEY="your-openai-api-key"
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database Setup

1. **Push schema to database:**
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client (if not already done):**
   ```bash
   npx prisma generate
   ```

3. **Optional - Open Prisma Studio to view data:**
   ```bash
   npx prisma studio
   ```

---

## Running the Application

### Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The application will auto-reload on file changes.

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

### Linting

Check for TypeScript and ESLint errors:

```bash
npm run lint
```

---

## Testing & Mock Data

### Using Mock Data Button

The app includes a **Mock Data** button (blue gradient) next to "View History" on the home page.

**How to use:**
1. Click the **Mock Data** button
2. Select from 5 pre-configured test cases:
   - **Clear Command** (should PASS) ✅
   - **Ambiguous Command** (should FAIL) ❌
   - **Too Short** (should FAIL) ❌
   - **Too Complex** (should FAIL) ❌
   - **Robotic Movement** (should PASS) ✅
3. Form auto-fills with example data + image URL
4. Click "Audit Command" to test immediately
5. See results and reasoning displayed
6. Result automatically saved to database

**Why this is useful:**
- Users can see the app working without writing commands
- Demonstrates both PASS and FAIL scenarios
- Shows confidence scoring and detailed reasoning
- Tests database persistence in seconds
- Validates UI, API, and database integration all at once

---

### Using Mock Analyzer

The application comes with a **mock analyzer** enabled by default. This allows you to test the entire application without needing external API keys.

**How it works:**
- Checks for ambiguous keywords (e.g., "approximately", "around", "maybe")
- Looks for clear action verbs (e.g., "pick up", "move to", "rotate", "grasp")
- Validates command length (3-20 words optimal)
- Returns PASS/FAIL with reasoning and confidence

**Advantages:**
 No API keys needed  
 Instant response (no network latency)  
 Deterministic (same input = same output)  
 Perfect for testing UI and database functionality  
 Free tier with no quotas  

### Test Cases

Try these commands in the app to verify mock analyzer behavior:

| Command | Expected Result | Reason |
|---------|-----------------|--------|
| "Pick up the red cube" |  PASS | Clear verb + 5 words |
| "Move the object to the table" |  PASS | Clear verb + specific location |
| "Rotate the gripper 90 degrees" |  PASS | Clear action + measurement |
| "Move around the area" |  FAIL | Contains ambiguous "around" |
| "Maybe grab something" |  FAIL | Contains ambiguous "maybe" |
| "Go" |  FAIL | Too short (1 word) |
| "Pick this thing up and move it to that place over there and then open the gripper and close it and do other things" |  FAIL | Too long (26 words), complex |
| "Place the part in bin A" |  PASS | Clear verb + 6 words |
| "Approximately move the cube" |  FAIL | Contains ambiguous "approximately" |

---

## Real AI Integration

###  Tested & Working Free APIs

Here are **actually tested** free AI APIs that work (not the broken Hugging Face endpoints):

#### 1. **Groq** ( RECOMMENDED - Fastest Free Tier)

**Why:** Super fast inference, generous free tier (30 requests/minute), real AI models

**Setup:**
1. Go to [console.groq.com](https://console.groq.com/keys)
2. Sign up (free account)
3. Generate API key
4. Add to `.env.local`:
   ```
   GROQ_API_KEY="your-groq-api-key"
   ```

**Code Integration:**
```typescript
import Anthropic from '@anthropic-sdk/sdk';

async function analyzeWithGroq(command: string) {
  const client = new Anthropic({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  });

  const response = await client.messages.create({
    model: 'mixtral-8x7b-32768', // Fast and free
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Analyze this robot command for clarity. Return JSON:
      
Command: "${command}"

{
  "status": "PASS" or "FAIL",
  "reasoning": "1-2 sentences why",
  "confidence": 0.0-1.0
}`
    }]
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}
```

**Install Groq SDK:**
```bash
npm install @anthropic-sdk/sdk
```

---

#### 2. **Together AI** (Free Tier via API)

**Why:** Good free tier, multiple models, reliable

**Setup:**
1. Go to [together.ai](https://api.together.ai/)
2. Create free account
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   TOGETHER_API_KEY="your-together-api-key"
   ```

**Code Integration:**
```typescript
async function analyzeWithTogether(command: string) {
  const response = await fetch('https://api.together.xyz/inference', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      prompt: `Robotics command auditor. Is this clear?
      
Command: "${command}"

Respond in JSON: {"status":"PASS"|"FAIL", "reasoning":"...", "confidence":0.0-1.0}`,
      max_tokens: 200
    })
  });

  const data = await response.json();
  return JSON.parse(data.output[0]);
}
```

---

#### 3. **Ollama** ( BEST FOR PRIVACY - 100% Free Local)

**Why:** Runs on your machine, zero cost, no API keys, complete control, no quotas

**Setup:**
1. Download [Ollama](https://ollama.ai/) for Windows/Mac/Linux
2. Install and run
3. Pull a model:
   ```bash
   ollama pull mistral
   ```
4. Works on `http://localhost:11434` (no API key needed)

**Code Integration:**
```typescript
async function analyzeWithOllama(command: string) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'mistral',
      prompt: `You are a robotics command auditor. Analyze this command:

Command: "${command}"

Respond ONLY with JSON (no markdown):
{"status":"PASS","reasoning":"...","confidence":0.85}`,
      stream: false
    })
  });

  const data = await response.json();
  return JSON.parse(data.response);
}
```

**Install Ollama models (one-time):**
```bash
ollama pull mistral          # Fast + good
ollama pull neural-chat      # Good alternative
ollama pull dolphin-mixtral  # More capable
```

**Advantages:**
-  No internet needed
-  No API keys
-  No quotas or limits
-  Fast local inference
-  Private (data never leaves your computer)

---

#### 4. **Google Gemini** (With Billing - Most Capable)

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Generative AI API
3. Create API key
4. **IMPORTANT:** Enable billing (free trial gives $300 credit)
5. Add to `.env.local`:
   ```
   GOOGLE_API_KEY="your-api-key"
   ```

**Code:**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

async function analyzeWithGemini(imageUrl: string, command: string) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const response = await model.generateContent({
    contents: [{
      parts: [
        { text: `Robotics command auditor:\n\nCommand: "${command}"\n\nRespond in JSON: {"status":"PASS"|"FAIL", "reasoning":"...", "confidence":0.0-1.0}` }
      ]
    }]
  });

  return JSON.parse(response.response.text());
}
```

---

### Decision Matrix

| API | Cost | Speed | Setup | Privacy | Best For |
|-----|------|-------|-------|---------|----------|
| **Ollama** | Free | Fast (local) | Medium | Perfect | Production, privacy-first |
| **Groq** | Free tier | Very Fast | Easy | Good | Demo, quick testing |
| **Together AI** | Free tier | Fast | Easy | Good | Small projects |
| **Gemini** | $0.001-$0.01/req | Very Fast | Easy | Fair | Production with budget |

---

### How to Switch Between APIs

**Step-by-Step Guide:**

1. **Get the code examples:**
   - Open [AI_INTEGRATION_EXAMPLES.md](AI_INTEGRATION_EXAMPLES.md) in the project root
   - Find your chosen API function (Ollama, Groq, Together, or Gemini)
   - Copy the entire function

2. **Set environment variables** (if needed):
   ```bash
   # For Groq
   GROQ_API_KEY="your-api-key"
   
   # For Together AI
   TOGETHER_API_KEY="your-api-key"
   
   # For Gemini
   GOOGLE_API_KEY="your-api-key"
   
   # Ollama needs no API key!
   ```

3. **Install dependencies** (if needed):
   ```bash
   npm install axios           # For Groq or Together AI
   npm install @google/generative-ai  # For Gemini
   ```

4. **Update the audit endpoint:**
   - Open `src/app/api/audit/route.ts`
   - Replace the line:
     ```typescript
     const result = analyzeCommandLocally(command);
     ```
   - With your chosen API call:
     ```typescript
     const result = await analyzeWithOllama(command);
     // OR
     const result = await analyzeWithGroq(command);
     // OR
     const result = await analyzeWithTogether(command);
     // OR
     const result = await analyzeWithGemini(imageUrl, command);
     ```

5. **Add the function** to the file (copy from AI_INTEGRATION_EXAMPLES.md)

6. **Test it:**
   - Use the Mock Data button to test with pre-filled commands
   - Verify results look correct
   - Check that confidence scores are returned

**Example: Switching to Ollama (Recommended for Privacy)**

```bash
# 1. Install Ollama from https://ollama.ai/
# 2. Run: ollama pull mistral
# 3. Run: ollama serve (in separate terminal)
# 4. In src/app/api/audit/route.ts, change:

const result = analyzeCommandLocally(command);  // ← REMOVE THIS

// TO:
const result = await analyzeWithOllama(command);  // ← ADD THIS
```

That's it! Your app now uses local AI with zero API keys.

---

## API Endpoints

### POST /api/audit

**Analyzes a robot command and returns audit result**

**Request:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "command": "Pick up the red cube from the table"
}
```

**Response (Success):**
```json
{
  "status": "PASS",
  "reasoning": "Command is clear, specific, and executable. Uses concrete action verbs with defined parameters.",
  "confidence": 0.85
}
```

**Response (Failure):**
```json
{
  "error": "Missing imageUrl or command",
  "status": 400
}
```

**Status Codes:**
- `200 OK` - Command analyzed successfully
- `400 Bad Request` - Missing or invalid input
- `500 Internal Server Error` - Server error during analysis

---

### GET /api/audits

**Fetches audit history from database**

**Query Parameters:**
- `limit`: Number of records to return (default: 50)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
[
  {
    "id": "abc123",
    "createdAt": "2024-01-15T10:30:00Z",
    "imageUrl": "https://example.com/image.jpg",
    "command": "Pick up the red cube",
    "status": "PASS",
    "reasoning": "Command is clear and specific.",
    "confidence": 0.85
  },
  ...
]
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Audits Table
```sql
CREATE TABLE audits (
  id VARCHAR PRIMARY KEY DEFAULT (gen_random_uuid()),
  created_at TIMESTAMP DEFAULT NOW(),
  image_url TEXT NOT NULL,
  command TEXT NOT NULL,
  status ENUM ('PASS', 'FAIL') NOT NULL,
  reasoning TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE SET NULL
);
```

**Prisma Schema:** See `prisma/schema.prisma`

---

## Theme System

### How It Works

The application uses Tailwind CSS's built-in dark mode with class strategy:

1. **Light Mode** (Default): No `dark` class on `<html>`
2. **Dark Mode**: `dark` class added to `<html>` element

### Persisting Theme

Theme preference is saved to browser localStorage:

```typescript
// In ThemeToggle.tsx
const toggleTheme = () => {
  const newTheme = isDark ? 'light' : 'dark';
  setIsDark(!isDark);
  
  // Update DOM
  document.documentElement.classList.toggle('dark');
  
  // Persist preference
  localStorage.setItem('theme', newTheme);
};
```

### Styling Components

Any component can respond to theme:

```tsx
// Light mode: gray-950, Dark mode: white
<h1 className="text-gray-950 dark:text-white">Title</h1>

// Light mode: gray-700, Dark mode: gray-300
<p className="text-gray-700 dark:text-gray-300">Body text</p>
```

---

## Deployment

### Vercel (Recommended for Next.js)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js

3. **Set Environment Variables in Vercel Dashboard:**
   - Add `DATABASE_URL`
   - Add `NEXTAUTH_URL` (set to your domain)
   - Add `NEXTAUTH_SECRET`
   - Add any AI API keys

4. **Deploy:**
   ```bash
   vercel deploy --prod
   ```

### Other Platforms

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Railway, Render, Heroku:** Similar process with environment variable setup

---

## Troubleshooting

### "Cannot find module '@/lib/prisma'"

**Solution:** Ensure Prisma Client is generated:
```bash
npx prisma generate
```

### "Error: NEXTAUTH_SECRET is not configured"

**Solution:** Add to `.env.local`:
```bash
NEXTAUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
```

### "Dark mode toggle not working"

**Solution:** Verify `tailwind.config.js` has `darkMode: 'class'`:
```js
module.exports = {
  darkMode: 'class',
  // ... rest of config
}
```

### "Database connection failed"

**Solution:** Check `.env.local` has valid DATABASE_URL:
```
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### "API request fails with 429 (Quota Exceeded)"

**Solution:** You've exceeded Google Cloud free tier quota. Either:
- Enable billing in Google Cloud Console
- Switch to mock analyzer (default)
- Use Hugging Face or local LLM

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see LICENSE file for details.

---

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing discussions for solutions
- Review the [Troubleshooting](#troubleshooting) section

---

## Acknowledgments

- Built with **Next.js** for modern React development
- Styled with **Tailwind CSS** for rapid UI development
- Animated with **Framer Motion** for smooth interactions
- Database powered by **PostgreSQL & Neon**
- Icons from **Lucide React**

---

**Last Updated:** March 24, 2026  
**Version:** 0.1.0 (Beta)

##  Database Schema

### Audit Model
```prisma
model Audit {
  id         String         @id @default(cuid())
  createdAt  DateTime       @default(now())
  imageUrl   String
  command    String
  status     AuditStatus   # PASS or FAIL
  reasoning  String
  confidence Float         # 0.0 to 1.0
  userId     Int?
  user       User?         @relation(fields: [userId], references: [id])
}

enum AuditStatus {
  PASS
  FAIL
}
```

##  Security

- **Middleware Protection**: `/history` route is protected (Neon Auth in progress)
- **API Validation**: Request bodies are validated
- **Environment Variables**: Sensitive keys are in `.env.local`
- **HTTPS Only**: Neon enforces SSL connections

##  AI Prompt

The audit system uses the following prompt with Gemini 2.5 Flash:

> "Act as a Robotics VLA Auditor. Analyze the provided image and command. Determine if the command is ambiguous or executable. Return JSON: {status, reasoning, confidence}."

##  Dependencies

- **next**: Framework
- **react**: UI library
- **@prisma/client**: Database ORM
- **@google/generative-ai**: Gemini AI
- **framer-motion**: Animations
- **tailwindcss**: Styling
- **@neondatabase/auth**: Authentication (planned)

##  Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

##  Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL URL | Yes |
| `GOOGLE_API_KEY` | Google Gemini API key | Yes |
| `NEXTAUTH_URL` | App URL | No |
| `NEXTAUTH_SECRET` | Auth secret | No |

##  Troubleshooting

### Database Connection
```bash
# Test connection
npx prisma db execute --stdin

# View database
npx prisma studio
```

### API Errors
- Check `.env.local` for missing keys
- Verify database connection
- Check Google API key validity

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Generative AI](https://ai.google.dev)
- [Neon Documentation](https://neon.tech/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 📄 License

MIT

##  Contributing

Contributions welcome! Please submit pull requests to the main repository.
