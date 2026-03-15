import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import GameSession from '@/models/GameSession';
import {
  generateArchitectQuestion,
  getDefaultArchitectModelId,
  getDefaultProfilerModelId,
} from '@/lib/gameAgents';

interface InitRequest {
  sessionId: string;
  opponentType?: 'AI' | 'HUMAN';
  forceNewQuestion?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: InitRequest = await req.json();
    const { sessionId, opponentType, forceNewQuestion } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const resolvedArchitectModelId = getDefaultArchitectModelId();
    const resolvedProfilerModelId = getDefaultProfilerModelId();

    const existing = await GameSession.findOne({ sessionId });

    if (existing?.roundQuestion && !forceNewQuestion) {
      if (
        existing.architectModelId !== resolvedArchitectModelId ||
        existing.profilerModelId !== resolvedProfilerModelId
      ) {
        await GameSession.updateOne(
          { sessionId },
          {
            $set: {
              architectModelId: resolvedArchitectModelId,
              profilerModelId: resolvedProfilerModelId,
            },
          }
        );
      }
      return NextResponse.json({
        success: true,
        sessionId,
        question: existing.roundQuestion,
        architectModelId: resolvedArchitectModelId,
        profilerModelId: resolvedProfilerModelId,
      });
    }

    const architectResult = await generateArchitectQuestion({
      modelId: resolvedArchitectModelId,
      sessionId,
    });

    console.log('[GameInit] Architect question generated', {
      sessionId,
      requestedModelId: undefined,
      resolvedModelId: resolvedArchitectModelId,
      usedFallback: architectResult.usedFallback,
    });

    await GameSession.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          startTime: new Date(),
          messages: [],
        },
        $set: {
          roundQuestion: architectResult.question,
          architectModelId: resolvedArchitectModelId,
          profilerModelId: resolvedProfilerModelId,
          actualOpponent: opponentType === 'HUMAN' ? 'HUMAN' : 'AI',
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      sessionId,
      question: architectResult.question,
      architectModelId: resolvedArchitectModelId,
      profilerModelId: resolvedProfilerModelId,
      architectUsedFallback: architectResult.usedFallback,
    });
  } catch (error) {
    console.error('Error initializing game session:', error);
    return NextResponse.json(
      { error: 'Failed to initialize game session' },
      { status: 500 }
    );
  }
}
