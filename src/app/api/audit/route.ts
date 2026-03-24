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

    // Analyze command using local heuristics
    // To integrate a real AI: replace this function call with actual API call to Gemini/HF/local LLM
    const result = analyzeCommandLocally(command);

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
