// Example AI Integration Functions
// Copy the appropriate function into src/app/api/audit/route.ts and uncomment the ONE you want to use

// ============================================================================
// 1. OLLAMA (LOCAL - RECOMMENDED FOR PRIVACY & ZERO COST)
// ============================================================================
// Installation: Download Ollama from https://ollama.ai/
// Run: ollama pull mistral
// Then: ollama serve (runs on http://localhost:11434)
// No API key needed!

async function analyzeWithOllama(command: string) {
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: `You are a robotics command auditor. Analyze this command for clarity and executability.

Command: "${command}"

Respond ONLY with valid JSON (no markdown, no explanation):
{
  "status": "PASS",
  "reasoning": "your 1-2 sentence explanation",
  "confidence": 0.85
}

Rules:
- PASS: Command is specific, clear, executable
- FAIL: Command is ambiguous, vague, or unclear
- Confidence should be between 0.0 and 1.0`,
        stream: false,
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.response);

    return {
      status: result.status || 'FAIL',
      reasoning: result.reasoning || 'Unable to analyze command',
      confidence: result.confidence || 0.5,
    };
  } catch (error) {
    console.error('Ollama error:', error);
    throw new Error('Ollama service not available. Make sure it\'s running on http://localhost:11434');
  }
}

// ============================================================================
// 2. GROQ API (FASTEST FREE TIER - RECOMMENDED)
// ============================================================================
// Setup: https://console.groq.com/keys
// 1. Sign up (free)
// 2. Generate API key
// 3. Add to .env.local: GROQ_API_KEY="your-key"
// Install: npm install axios

import axios from 'axios';

async function analyzeWithGroq(command: string) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: `You are a robotics command auditor. Analyze this command:

Command: "${command}"

Respond ONLY with valid JSON:
{
  "status": "PASS",
  "reasoning": "1-2 sentences",
  "confidence": 0.85
}`
          }
        ],
        temperature: 0.3,
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const content = response.data.choices[0].message.content;
    const result = JSON.parse(content);

    return {
      status: result.status || 'FAIL',
      reasoning: result.reasoning || 'Unable to analyze',
      confidence: result.confidence || 0.5,
    };
  } catch (error) {
    console.error('Groq error:', error);
    throw new Error('Failed to call Groq API. Check GROQ_API_KEY.');
  }
}

// ============================================================================
// 3. TOGETHER AI (FREE TIER)
// ============================================================================
// Setup: https://www.together.ai/
// 1. Sign up (free)
// 2. Get API key from dashboard
// 3. Add to .env.local: TOGETHER_API_KEY="your-key"
// Install: npm install axios

async function analyzeWithTogether(command: string) {
  if (!process.env.TOGETHER_API_KEY) {
    throw new Error('TOGETHER_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.together.xyz/inference',
      {
        model: 'mistralai/Mistral-7B-Instruct-v0.1',
        prompt: `Robotics command auditor. Analyze this command:

Command: "${command}"

Respond in JSON format:
{"status":"PASS"|"FAIL","reasoning":"...","confidence":0.0-1.0}`,
        max_tokens: 200,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const content = response.data.output[0];
    const result = JSON.parse(content);

    return {
      status: result.status || 'FAIL',
      reasoning: result.reasoning || 'Unable to analyze',
      confidence: result.confidence || 0.5,
    };
  } catch (error) {
    console.error('Together error:', error);
    throw new Error('Failed to call Together API. Check TOGETHER_API_KEY.');
  }
}

// ============================================================================
// 4. GOOGLE GEMINI (WITH BILLING - MOST CAPABLE)
// ============================================================================
// Setup: https://console.cloud.google.com/
// 1. Create project, enable Generative AI API
// 2. Create API key
// 3. Enable billing in Google Cloud Console
// 4. Add to .env.local: GOOGLE_API_KEY="your-key"
// Install: npm install @google/generative-ai

import { GoogleGenerativeAI } from '@google/generative-ai';

async function analyzeWithGemini(imageUrl: string, command: string) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const response = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: `You are a robotics command auditor. Analyze this command for clarity and executability.

Command: "${command}"
${imageUrl ? `Context Image: ${imageUrl}` : ''}

Respond ONLY with valid JSON:
{
  "status": "PASS",
  "reasoning": "1-2 sentences why",
  "confidence": 0.85
}

Criteria:
- PASS: Clear, specific, executable
- FAIL: Ambiguous, vague, unclear`
            }
          ]
        }
      ]
    });

    const text = response.response.text();
    const result = JSON.parse(text);

    return {
      status: result.status || 'FAIL',
      reasoning: result.reasoning || 'Unable to analyze',
      confidence: result.confidence || 0.5,
    };
  } catch (error) {
    console.error('Gemini error:', error);
    throw new Error('Failed to call Gemini API.');
  }
}

// ============================================================================
// HOW TO USE IN src/app/api/audit/route.ts
// ============================================================================

/*
In your POST handler, replace this line:
  const result = analyzeCommandLocally(command);

With ONE of these (uncomment your choice):
  const result = await analyzeWithOllama(command);
  const result = await analyzeWithGroq(command);
  const result = await analyzeWithTogether(command);
  const result = await analyzeWithGemini(imageUrl, command);

Then add the corresponding function above your POST handler.
Also install any required packages (axios, google/generative-ai, etc)
*/

// ============================================================================
// API COMPARISON QUICK REFERENCE
// ============================================================================

/*
OLLAMA (Best for Privacy & Local)
- Cost: FREE (runs on your machine)
- Speed: Fast (depends on CPU/GPU)
- Setup: Install Ollama, pull model, run locally
- Privacy: Perfect (data never leaves your computer)
- API Key: None needed
- Recommendation: Dev/testing, production if self-hosted
- Command: ollama pull mistral

GROQ (Best for Free Tier Power)
- Cost: FREE (30 req/min, then paid)
- Speed: VERY FAST
- Setup: Sign up, get API key
- Privacy: Good (encrypted transit)
- API Key: Yes (free tier)
- Recommendation: Production demo or MVP
- Website: https://console.groq.com

TOGETHER AI (Free Tier)
- Cost: FREE (small quota)
- Speed: Fast
- Setup: Sign up, get API key
- Privacy: Good
- API Key: Yes
- Recommendation: Testing, small projects
- Website: https://www.together.ai/

GEMINI (Most Capable)
- Cost: Paid (starts ~$0.001/request)
- Speed: Instant
- Setup: Google Cloud, enable billing
- Privacy: Good (Google)
- API Key: Yes (requires billing)
- Recommendation: Production apps with budget
- Website: https://console.cloud.google.com/

MOCK (Current Default)
- Cost: FREE
- Speed: Instant
- Setup: No setup needed
- Privacy: Perfect (local only)
- API Key: None
- Recommendation: Testing UI/UX
*/

export {
  analyzeWithOllama,
  analyzeWithGroq,
  analyzeWithTogether,
  analyzeWithGemini,
};
