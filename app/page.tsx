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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        setIsLoggedIn(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Small helper to pick a random emoji avatar for new logins
  function getRandomAvatar() {
    const avatars = ['👤', '🧑', '👨', '👩', '🧔', '👱', '🧑‍💼', '👨‍💻', '👩‍🔬'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  function handleJoin(name: string) {
    if (!name || !name.trim()) return;
    const profile = { name: name.trim(), avatar: getRandomAvatar(), bio: 'Turing Test Participant' };
    try {
      localStorage.setItem('turing_user', JSON.stringify(profile));
    } catch (e) {}
    setUser(profile);
    setIsLoggedIn(true);
  }

  function handleContinueAsGuest() {
    // Guest mode: no persistence needed
    setUser({ name: 'Guest', avatar: '👤', bio: 'Turing Test Participant' });
    setIsLoggedIn(false);
  }

  function handleLogout() {
    try { localStorage.removeItem('turing_user'); } catch (e) {}
    setUser({ name: 'Guest', avatar: '👤', bio: 'Turing Test Participant' });
    setIsLoggedIn(false);
  }

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
        </div>

        {/* Login / Guest UI */}
        {!isLoggedIn ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).elements.namedItem('homepage_username') as HTMLInputElement;
              handleJoin(input.value);
            }}
            className="mt-6 flex gap-2"
          >
            <input
              name="homepage_username"
              placeholder="Your Name"
              className="px-4 py-2 rounded-lg w-56"
            />
            <button type="submit" className="px-4 py-2 bg-white text-black rounded-lg">Join</button>
            <button type="button" onClick={() => handleContinueAsGuest()} className="px-4 py-2 bg-white/20 text-white rounded-lg">Continue as Guest</button>
          </form>
        ) : (
          <div className="mt-6">
            <div className="text-white">Signed in as <strong>{user.name}</strong></div>
            <button onClick={() => handleLogout()} className="mt-2 px-4 py-2 bg-white/20 text-white rounded-lg">Logout</button>
          </div>
        )}
      </main>

      <aside className="w-full md:w-80 bg-white/10 p-6 backdrop-blur rounded-t-2xl md:rounded-l-2xl flex flex-col items-center justify-center">
        <div className="text-7xl">{user.avatar}</div>
        <div className="text-white font-semibold mt-3 text-lg">{user.name}</div>
        <div className="text-white/80 text-sm mt-1 text-center max-w-[12rem]">{user.bio}</div>
      </aside>
    </div>
  );
}
