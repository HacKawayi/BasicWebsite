# Chat Matching Interface - Prototype MVP

A split-layout chat application prototype with user matching and personal profile display. Built with Next.js 14, TypeScript, and Tailwind CSS.

> **Previous Version**: This project was originally a Strategic Turing Test Game for research data collection. The chat matching interface is now the active prototype, with backend infrastructure ready for integration.

## 🎯 Features

- **Split Layout Design**: 60-70% chat area + 30-40% profile area
- **Mock User List**: Simulated online/offline status indicators
- **Real-time Chat Simulation**: Message exchange with auto-responses
- **Personal Profile Card**: Display user information and statistics
- **Fully Offline**: No backend dependencies, runs entirely with mock data
- **Modern UI**: Beautiful gradient designs with Tailwind CSS

## � Project Evolution

### Version 2.0 - Chat Matching Interface (Current)
- ✅ Split layout with chat + profile panels
- ✅ Mock user list and conversations
- ✅ Client-side state management only
- ✅ No backend dependencies for development
- ✅ Ready for API integration

### Version 1.0 - Strategic Turing Test Game (Legacy)
- AI-powered Turing test chat game
- Research data collection platform
- MongoDB session logging with timestamps
- Player guess evaluation and scoring
- Full backend integration (chat/game APIs still available)

**Migration**: The Turing Test game logic has been replaced with the chat matching interface. Previous API routes (`app/api/chat`, `app/api/game`) remain in the codebase and can be reused or adapted for the new chat features.

## �🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: React useState hooks
- **Styling**: Tailwind CSS
- **Database**: MongoDB (Mongoose ODM) - Ready for integration
- **AI Integration**: Vercel AI SDK - Ready for integration

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables** (for future backend integration):
   ```bash
   cp .env.example .env.local
   ```

3. **Configure your `.env.local` file**:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

   - Get MongoDB URI from [MongoDB Atlas](https://cloud.mongodb.com)
   - Get OpenAI API Key from [OpenAI Platform](https://platform.openai.com)

## 🚀 Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **No backend required**: The app runs entirely with mock data!

## 📁 Project Structure

```
├── app/
│   ├── api/                       # API routes (ready for integration)
│   │   ├── chat/route.ts          # AI chat endpoint with data logging
│   │   └── game/
│   │       ├── init/route.ts      # Game session initialization
│   │       └── submit/route.ts    # Player guess submission
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main chat matching UI (ACTIVE)
│   └── globals.css                # Global styles
├── lib/
│   └── db.ts                      # MongoDB connection helper
├── models/
│   └── GameSession.ts             # Mongoose schema for game data
├── .env.example                   # Environment variables template
├── next.config.mjs                # Next.js configuration
├── package.json                   # Dependencies
├── tailwind.config.ts             # Tailwind CSS configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🎮 How It Works

### Current Implementation (Mock Data)

1. **User Selection**: Click any user from the left panel to open their chat
2. **Send Messages**: Type and send messages in the chat window
3. **Auto Response**: Receive a simulated response after 1 second
4. **Profile Display**: View mock user profile on the right side
5. **No API Calls**: Everything runs client-side with useState

### Mock Data Structure

```typescript
// Users
interface User {
  id: number;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

// Messages
interface Message {
  id: number;
  sender: string;
  text: string;
  isUserMessage: boolean;
  timestamp: Date;
}

// Profile
interface UserProfile {
  name: string;
  email: string;
  bio: string;
  joinDate: string;
  avatar: string;
}
```

## 🔌 Backend Integration Guide

Ready to connect to real APIs? Follow the integration checklist:

### Quick Reference: Where to Add Keys

**MongoDB Connection**: `lib/db.ts` (✅ Already exists)
```env
# Add to .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```
Get from: [MongoDB Atlas](https://cloud.mongodb.com) → Clusters → Connect

**OpenAI API Key**: `app/api/chat/route.ts` (✅ Already exists)
```env
# Add to .env.local
OPENAI_API_KEY=sk-proj-...your-key-here
```
Get from: [OpenAI Platform](https://platform.openai.com) → API Keys

### Integration Steps

### 1. MongoDB Connection
**Location**: `lib/db.ts` (already created)
- Add your MongoDB URI to `.env.local`
- The connection helper caches connections for Next.js

### 2. User API Endpoints
**Create**: `app/api/users/list/route.ts`
```typescript
// GET /api/users/list - Fetch all users
// Returns: User[]
```

**Update**: `app/page.tsx` line ~38
```typescript
// Replace: const mockUsers: User[] = [...]
// With: useEffect(() => fetch('/api/users/list'))
```

### 3. Messages API Endpoints
**Create**: `app/api/chat/messages/[userId]/route.ts`
```typescript
// GET /api/chat/messages/[userId] - Fetch conversation
// POST /api/chat/send - Save new message
```

**Update**: `app/page.tsx` line ~56
```typescript
// Replace: const initialMockMessages: Record<...> = {...}
// With: API fetch in useEffect
```

### 4. Profile API Endpoints
**Create**: `app/api/user/profile/route.ts`
```typescript
// GET /api/user/profile - Fetch current user
// PUT /api/user/profile - Update profile
```

### 5. Database Models
**Create** in `models/` folder:
- `User.ts` - User schema (name, email, avatar, status)
- `Message.ts` - Message schema (senderId, receiverId, text, timestamp)
- `Conversation.ts` - Conversation schema (participants, lastMessage)

### 6. Optional: Real-time Chat
**Technology**: Socket.io or Next.js Server-Sent Events
- Install: `npm install socket.io socket.io-client`
- Create: `app/api/socket/route.ts`
- Update message handling to use WebSockets

### 7. Reuse Existing Backend (Optional)
The previous Turing Test game APIs are still available:
- `app/api/chat/route.ts` - AI chat with OpenAI (can adapt for chatbot responses)
- `app/api/game/init/route.ts` - Session initialization pattern
- `app/api/game/submit/route.ts` - Data submission pattern
- `models/GameSession.ts` - Example Mongoose schema

**Tip**: You can modify these existing routes for your chat application instead of creating new ones from scratch.

## 📊 Database Schema (For Future Integration)

### Users Collection
```typescript
{
  _id: ObjectId
  name: String
  email: String (unique)
  avatar: String
  bio: String
  status: 'online' | 'offline'
  joinDate: Date
  createdAt: Date
  updatedAt: Date
}
```

### Messages Collection
```typescript
{
  _id: ObjectId
  conversationId: ObjectId
  senderId: ObjectId
  receiverId: ObjectId
  text: String
  isRead: Boolean
  timestamp: Date
  createdAt: Date
}
```

### Conversations Collection
```typescript
{
  _id: ObjectId
  participants: [ObjectId]
  lastMessage: {
    text: String
    senderId: ObjectId
    timestamp: Date
  }
  createdAt: Date
  updatedAt: Date
}
```

## 🎨 UI Features

### Left Panel (Chat Container)
- ✅ User list with avatars and online status
- ✅ Click to select and open conversation
- ✅ Active user highlighting
- ✅ Message history display
- ✅ Text input with send button
- ✅ Auto-scroll to latest message
- ✅ Empty state placeholder

### Right Panel (Profile Container)
- ✅ Profile avatar with gradient background
- ✅ User information display
- ✅ Statistics cards (messages, contacts, chats)
- ✅ Action buttons (Edit Profile, Settings)
- ✅ Information note about mock data

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard (when ready for backend)
4. Deploy!

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- Next.js 14+
- Environment variables (for future backend)

## 🔄 Migration Path

### Current State: Prototype ✅
- ✅ Full UI implementation with split layout
- ✅ Mock data and state management
- ✅ User interactions working (select, chat, send messages)
- ✅ No dependencies on backend services
- ✅ Runs with `npm run dev` without errors

### Phase 1: Environment Setup 🔑
- [ ] Create `.env.local` file in project root
- [ ] Add `MONGODB_URI` from MongoDB Atlas
- [ ] Add `OPENAI_API_KEY` from OpenAI Platform
- [ ] Test connection with `npm run dev`

### Phase 2: API Development 🔌
- [ ] Create user list endpoint: `app/api/users/list/route.ts`
- [ ] Create message endpoints: `app/api/chat/messages/[userId]/route.ts`
- [ ] Create profile endpoints: `app/api/user/profile/route.ts`
- [ ] Add Mongoose models: `User.ts`, `Message.ts`, `Conversation.ts`

### Phase 3: Frontend Integration 🎨
- [ ] Replace `mockUsers` with API fetch in `app/page.tsx`
- [ ] Replace `initialMockMessages` with API fetch
- [ ] Replace `mockUserProfile` with API fetch
- [ ] Add error handling and loading states

### Phase 4: Authentication & Real-time 🔐
- [ ] Install NextAuth.js: `npm install next-auth`
- [ ] Create auth endpoints: `app/api/auth/[...nextauth]/route.ts`
- [ ] Add Socket.io for real-time messaging (optional)
- [ ] Implement user sessions and JWT tokens

### Phase 5: Production Ready 🚀
- [ ] Add file upload for avatars (AWS S3 or Cloudinary)
- [ ] Implement search and filtering
- [ ] Add notification system
- [ ] Deploy to Vercel with environment variables
- [ ] Set up MongoDB indexes for performance

## 📝 Recent Changes

### January 2026 Updates
- ✅ Replaced Turing Test game with Chat Matching interface
- ✅ Implemented split layout (60/40 chat/profile)
- ✅ Added mock data for offline development
- ✅ Updated to use `@ai-sdk/react` instead of `ai/react`
- ✅ Fixed TypeScript errors with Vercel AI SDK v6
- ✅ Changed `maxTokens` to `maxOutputTokens` (AI SDK breaking change)
- ✅ Changed `toDataStreamResponse()` to `toTextStreamResponse()`
- ✅ Added comprehensive backend integration guide
- ✅ Created 10-step TODO list for API integration

### Key File Changes
- `app/page.tsx` - Complete rewrite for chat matching UI
- `README.md` - Updated documentation with migration guide
- `package.json` - Added `@ai-sdk/react` dependency
- Backend files preserved for future integration

## 📝 Development Notes

- **No Backend Errors**: App runs without MongoDB or API keys
- **TypeScript**: Full type safety with interfaces
- **Clean Code**: Separated mock data from component logic
- **Commented Code**: Previous game logic preserved in git history
- **Tailwind CSS**: Utility-first styling throughout

## 📝 License

MIT

## 🙏 Acknowledgments

Built as a prototype for chat matching platform development. Ready to scale with real backend integration.
