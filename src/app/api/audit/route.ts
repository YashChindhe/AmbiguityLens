// POST /api/audit - Main audit endpoint
// Accepts image URL and robot command, analyzes and returns audit result
// Returns: { status: PASS|FAIL, reasoning: string, confidence: 0-1 }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock AI auditor - returns realistic results based on command analysis
function analyzeCommandLocally(command: string): { status: 'PASS' | 'FAIL'; reasoning: string; confidence: number } {
  const lowerCmd = command.toLowerCase();
  
  // Simple heuristics for demonstration
  const ambiguousKeywords = ['approximately', 'around', 'maybe', 'sort of', 'roughly'];
  const isAmbiguous = ambiguousKeywords.some(kw => lowerCmd.includes(kw));
  
  const clearKeywords = ['pick up', 'move to', 'rotate', 'grasp', 'place', 'push', 'pull', 'lift'];
  const isClear = clearKeywords.some(kw => lowerCmd.includes(kw));
  
  const commandLength = command.split(' ').length;
  
  // Decision logic
  if (isAmbiguous) {
    return {
      status: 'FAIL',
      reasoning: 'Command contains ambiguous language. Use specific measurements and clear action verbs.',
      confidence: 0.9,
    };
  }
  
  if (isClear && commandLength >= 3 && commandLength <= 20) {
    return {
      status: 'PASS',
      reasoning: 'Command is clear, specific, and executable. Uses concrete action verbs with defined parameters.',
      confidence: 0.85,
    };
  }
  
  if (commandLength < 3) {
    return {
      status: 'FAIL',
      reasoning: 'Command is too brief. Provide more context (target object, location, parameters).',
      confidence: 0.8,
    };
  }
  
  if (commandLength > 25) {
    return {
      status: 'FAIL',
      reasoning: 'Command is too complex or runs multiple actions. Break into discrete, single-purpose commands.',
      confidence: 0.75,
    };
  }
  
  return {
    status: 'PASS',
    reasoning: 'Command is reasonably clear and executable based on structure and vocabulary.',
    confidence: 0.7,
  };
}


// Real AI auditor using OpenRouter
async function analyzeWithOpenRouter(command: string): Promise<{ status: 'PASS' | 'FAIL'; reasoning: string; confidence: number } | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AmbiguityLens',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `You are a robotics command auditor. Analyze this command for clarity and executability.

Command: "${command}"

Respond ONLY with valid JSON (no markdown):
{
  "status": "PASS",
  "reasoning": "1-2 sentences why",
  "confidence": 0.85
}`
          }
        ],
        temperature: 0.3,
      })
    });

    if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Simple JSON extraction in case the model returns markdown
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);

    return {
      status: result.status === 'PASS' ? 'PASS' : 'FAIL',
      reasoning: result.reasoning || 'Unable to provide reasoning',
      confidence: typeof result.confidence === 'number' ? result.confidence : 0.7,
    };
  } catch (error) {
    console.error('OpenRouter integration error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, command } = await request.json();

    if (!imageUrl || !command) {
      return NextResponse.json(
        { error: 'Missing imageUrl or command' },
        { status: 400 }
      );
    }

    console.log('Auditing command:', command);

    // Analyze command: try OpenRouter first, then fallback to local heuristics
    let result = await analyzeWithOpenRouter(command);
    
    if (!result) {
      console.log('Falling back to local analysis...');
      result = analyzeCommandLocally(command);
    }

    // Save to database
    try {
      await prisma.audit.create({
        data: {
          imageUrl,
          command,
          status: result.status,
          reasoning: result.reasoning,
          confidence: result.confidence,
        },
      });
      console.log('✓ Audit saved to database');
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - return result even if DB fails
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Audit error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'Failed to audit command', details: errorMessage.substring(0, 150) },
      { status: 500 }
    );
  }
}
