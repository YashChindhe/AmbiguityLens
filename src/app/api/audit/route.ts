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
async function analyzeWithOpenRouter(command: string, imageUrl?: string): Promise<{ status: 'PASS' | 'FAIL'; reasoning: string; confidence: number } | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const userMessageContent = imageUrl 
      ? [
          { type: 'text', text: `Analyze this command for a robot based on the attached image scenario: "${command}"` },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      : `You are a robotics command auditor. Analyze this command for clarity and executability: "${command}"`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'AmbiguityLens (Production)',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free', // Use a versatile free vision model or gpt-4o-mini
        messages: [
          {
            role: 'system',
            content: `You are a strict robotics command auditor. Evaluate if a command is clear, specific, and safe for a robot to execute.
Respond ONLY with valid JSON (no markdown):
{
  "status": "PASS" | "FAIL",
  "reasoning": "A concise explanation of the assessment (1-2 sentences)",
  "confidence": number between 0 and 1
}`
          },
          {
            role: 'user',
            content: userMessageContent
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent JSON output
        max_tokens: 300
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter Error (${response.status}):`, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) throw new Error('Empty response from OpenRouter');
    
    const content = data.choices[0].message.content.trim();
    
    // Simple JSON extraction in case the model returns markdown or conversational text
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
    let result = await analyzeWithOpenRouter(command, imageUrl);
    
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
