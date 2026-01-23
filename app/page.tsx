'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type User = {
  name?: string;
  avatar?: string;
  bio?: string;
};

export default function Homepage() {
  const [user, setUser] = useState<User>({ name: 'Guest', avatar: '👤', bio: 'Turing Test Participant' });

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('turing_user') : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser({
          name: parsed.name || 'Guest',
          avatar: parsed.avatar || '👤',
          bio: parsed.bio || 'Turing Test Participant',
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-400 to-blue-500 flex-col md:flex-row">
      <main className="flex-1 p-8 flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">TuringChat</h1>
        <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl">
          Welcome to the Turing Test game. Start the TuringChat to challenge conversational agents and see if you can tell AI from humans.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/turingchat" className="inline-block bg-white text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition">
            Start TuringChat
          </Link>
          <Link href="/turingchat" className="inline-block border border-white/30 text-white px-5 py-3 rounded-lg hover:bg-white/10 transition">
            Open Lobby
          </Link>
        </div>
      </main>

      <aside className="w-full md:w-80 bg-white/10 p-6 backdrop-blur rounded-t-2xl md:rounded-l-2xl flex flex-col items-center justify-center">
        <div className="text-7xl">{user.avatar}</div>
        <div className="text-white font-semibold mt-3 text-lg">{user.name}</div>
        <div className="text-white/80 text-sm mt-1 text-center max-w-[12rem]">{user.bio}</div>
      </aside>
    </div>
  );
}
