import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';
import dbConnect from '@/lib/db';
import GameSession from '@/models/GameSession';

// Initialize Pusher for server-side
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(req: NextRequest) {
  try {
    // 检查 Pusher 环境变量是否配置
    if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) {
      console.error('Pusher credentials missing in environment variables');
      return NextResponse.json({ error: 'Pusher not configured' }, { status: 500 });
    }

    const { action, sessionId, sender, content, role, fromUser, targetUser, tags, round } = await req.json();

    if (action === 'invite' || action === 'accept') {
      if (!fromUser || !targetUser || !sessionId) {
        return NextResponse.json({ error: 'Missing invite fields' }, { status: 400 });
      }

      const eventName = action === 'invite' ? 'chat-request' : 'chat-accepted';
      const payload = {
        fromUser,
        targetUser,
        sessionId,
        timestamp: Date.now(),
        tags: tags || [], // Pass user tags to opponent
      };

      console.log('📡 Triggering lobby event:', eventName, payload);
      const triggerResult = await pusher.trigger('presence-lobby', eventName, payload);
      console.log('📡 Lobby trigger result:', triggerResult);

      return NextResponse.json({ success: true });
    }

    if (action === 'phase') {
      if (!sessionId || !content) {
        return NextResponse.json({ error: 'Missing phase fields' }, { status: 400 });
      }

      const payload = {
        sessionId,
        phase: content,
        timestamp: Date.now(),
      };

      console.log('📡 Triggering phase change on channel:', `private-session-${sessionId}`, payload);
      const triggerResult = await pusher.trigger(`private-session-${sessionId}`, 'phase-change', payload);
      console.log('📡 Phase trigger result:', triggerResult);
      return NextResponse.json({ success: true });
    }

    if (action === 'question') {
      if (!sessionId || !content) {
        return NextResponse.json({ error: 'Missing question fields' }, { status: 400 });
      }

      const payload = {
        sessionId,
        question: content,
        round: typeof round === 'number' ? round : undefined,
        timestamp: Date.now(),
      };

      console.log('📡 Triggering round question on channel:', `private-session-${sessionId}`, payload);
      const triggerResult = await pusher.trigger(`private-session-${sessionId}`, 'round-question', payload);
      console.log('📡 Round question trigger result:', triggerResult);
      return NextResponse.json({ success: true });
    }

    if (!sessionId || !content) {
      return NextResponse.json({ error: 'Missing sessionId or content' }, { status: 400 });
    }

    // 触发 Pusher 事件进行实时广播
    // 使用 private channel 以增加安全性 (格式: private-session-ID)
    const timestamp = new Date();
    const roleToSend = role || 'user';

    // Persist human chat messages for post-game profiling.
    if (process.env.MONGODB_URI) {
      try {
        await dbConnect();
        await GameSession.findOneAndUpdate(
          { sessionId },
          {
            $setOnInsert: {
              sessionId,
              startTime: new Date(),
              actualOpponent: 'HUMAN',
            },
            $push: {
              messages: {
                role: roleToSend === 'assistant' ? 'assistant' : 'user',
                content,
                sender: sender || 'unknown',
                timestamp,
              },
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (err) {
        console.warn('[Talk] Failed to persist message:', err);
      }
    }

    console.log('📡 Triggering Pusher event on channel:', `private-session-${sessionId}`, 'with data:', { sender, content, role: roleToSend, timestamp });
    const triggerResult = await pusher.trigger(`private-session-${sessionId}`, 'new-message', {
      sender,
      content,
      role: roleToSend,
      timestamp,
    });
    console.log('📡 Pusher trigger result:', triggerResult);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in human talk route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
