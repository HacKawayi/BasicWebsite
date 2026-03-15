import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sender?: string;
}

export interface IProfilerAnalysis {
  instinct: number; // 底层动力：主动生存vs被动反应
  empathy: number; // 情绪体验：共情体验vs语意映射
  creativity: number; // 思维方式：发散创造vs理性计算
  authenticity: number; // 成长轨迹：实体生命vs数据拟合
  summary: string;
  evidence: string[];
}

export interface IGameSession extends Document {
  sessionId: string;
  startTime: Date;
  messages: IMessage[];
  roundQuestion?: string;
  architectModelId?: string;
  profilerModelId?: string;
  profilerAnalysis?: IProfilerAnalysis;
  playerGuess?: 'AI' | 'HUMAN';
  actualOpponent: 'AI' | 'HUMAN';
  isCorrect?: boolean;
  decisionTime?: Date;
  score?: number;
  modelId?: string; // Full model ID string (e.g., 'Qwen/Qwen2.5-7B-Instruct')
  status?: 'active' | 'closed';
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sender: {
    type: String,
    required: false,
  },
});

const GameSessionSchema = new Schema<IGameSession>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
    roundQuestion: {
      type: String,
      required: false,
    },
    architectModelId: {
      type: String,
      required: false,
    },
    profilerModelId: {
      type: String,
      required: false,
    },
    profilerAnalysis: {
      type: Schema.Types.Mixed,
      required: false,
    },
    playerGuess: {
      type: String,
      enum: ['AI', 'HUMAN'],
      required: false,
    },
    actualOpponent: {
      type: String,
      default: 'AI',
      enum: ['AI', 'HUMAN'],
    },
    isCorrect: {
      type: Boolean,
      required: false,
    },
    decisionTime: {
      type: Date,
      required: false,
    },
    score: {
      type: Number,
      required: false,
    },
    modelId: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during hot reload
const GameSession: Model<IGameSession> =
  mongoose.models.GameSession || mongoose.model<IGameSession>('GameSession', GameSessionSchema);

export default GameSession;
