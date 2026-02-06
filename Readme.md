# Learn Swahili with AI

<div align="center">

**An AI-powered Swahili language learning platform that makes mastering a new language feel like tending a garden.**

*Personal Growth & Learning Track — Comet Competition*

---

## 🌱 Project Vision

**Jifunze** (Swahili for "Learn") reimagines language acquisition as a **personal growth journey**. Instead of gamified competition and leaderboards, we focus on what actually matters: **consistent practice, meaningful reflection, and visible progress**.

Our core philosophy: *Learning should feel like nurturing something alive.*

The **Word Garden** metaphor transforms abstract vocabulary memorization into a visual, emotional experience. Each word you learn starts as a seed 🌰, sprouts into a sapling 🌱, and eventually blossoms into a tree 🌳 — creating a living representation of your growing knowledge.

---

## 🎯 Competition Track Alignment

### Personal Growth & Learning

| Judging Criteria                     | How Jifunze Delivers                                                                                                                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Functionality**              | Lesson units with vocabulary cards, practice steps, quizzes, streaks, and resuming progress; Word Garden SRS for review and mastery growth                |
| **Real-world Relevance**       | Practical Swahili vocabulary across everyday categories with pronunciation playback and cultural context when available                                   |
| **Use of LLMs/Agents**         | Dedicated agents for teaching/SRS, quiz generation, conversation tutoring, evaluator scoring, and daily article curation (see[Architecture](#-architecture)) |
| **Evaluation & Observability** | Opik + Supabase trace logging for agent calls, evaluator scoring, admin trace dashboards, and structured metadata for analysis                            |
| **Goal Alignment**             | Growth metaphors (Word Garden), consistent practice loops, and streak/XP incentives that make learning feel rewarding and achievable                      |

---

## ✨ Features

### 🌸 The Word Garden (Bustani ya Maneno)

A visual vocabulary ecosystem powered by spaced repetition scheduling:

- **5 Growth Stages**: Seed 🌰 → Sprout 🌱 → Sapling 🌿 → Flower 🌸 → Tree 🌳
- **"Water Your Garden"**: Daily review sessions that trigger beautiful growth animations
- **Intelligent Scheduling**: Words appear for review at scientifically optimal intervals
- **Mastery Celebrations**: Sparkle bursts and float-up effects when words reach Tree stage

```
Growth Stage     Reviews Needed    XP Bonus
──────────────────────────────────────────
Seed      🌰        0              +5
Sprout    🌱        1-2            +10
Sapling   🌿        3-4            +15
Flower    🌸        5-6            +20
Tree      🌳        7+             +25
```

### 📚 Structured Lesson Journey

Each lesson follows a step-based flow:

1. **Intro** — short welcome and context for the unit
2. **Learn** — vocabulary cards with pronunciation playback
3. **Practice** — interactive exercises (multiple choice, fill-in-blank, translation)
4. **Quiz** — short assessment and XP reward
5. **Celebration** — completion summary and streak updates

Lesson units are defined in `swahili/lib/lesson-structure.ts` with Beginner and Intermediate tracks.

### 🎮 Adaptive Quiz System

- Dynamic question generation via the Quiz Agent
- Multiple formats: Swahili→English, English→Swahili, multiple choice, fill-in-blank
- Fuzzy answer matching for minor typos
- Performance-based XP rewards

### 🔥 Progress & Streaks

- **500 XP per Level** with Swahili level titles (Mwanafunzi → Bingwa)
- **Daily Streak Tracking** with fire animations
- **Session Persistence**: Resume interrupted lessons exactly where you left off
- **XP History Audit Trail**: Complete learning analytics

### 💬 AI Conversation Practice

Natural dialogue practice with an AI tutor that:

- Adapts to your vocabulary level
- Provides contextual corrections
- Offers cultural insights during conversation
- Tracks conversation history for continuity

---

## 🤖 Architecture

### Multi-Agent System

Jifunze uses specialized agents exposed via Next.js API routes:

```
┌───────────────────────────────┐
│          Frontend             │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│     Next.js API Routes        │
└──────┬─────────┬─────────┬────┘
       │         │         │
┌──────▼───┐ ┌───▼────┐ ┌──▼────────┐
│ Teaching │ │ Lesson │ │ Conversation │
│  Agent   │ │ Agent  │ │    Agent     │
└──────┬───┘ └───┬────┘ └──┬────────┘
       │         │         │
┌──────▼───┐ ┌───▼────┐ ┌──▼────────┐
│  Quiz   │ │ Article │ │ Evaluator │
│  Agent  │ │  Agent  │ │   Agent   │
└──────┬───┘ └───┬────┘ └──┬────────┘
       │         │         │
       └─────────┴─────────▼───────┐
                           TTS     │
                        (ElevenLabs) 
```

### Model Routing Strategy

Fast LLM calls use Groq (Llama 3.3 70B). The evaluator can also use Google GenAI (Gemini) when configured.

### Database Schema (Key Tables)

```sql
profiles
├── user_id, display_name, avatar
└── onboarding_completed, created_at, updated_at

vocabulary_words
├── id, swahili, english, category
└── created_at, stage

user_vocabulary
├── user_id, word_id, growth_stage
└── ease_factor, interval_days, repetitions, next_review_at

lesson_progress
├── user_id, lesson_id
└── completed, score, xp_earned, completed_at

lesson_session_progress
├── user_id, lesson_id
└── current_phase, current_word_index, practice_score, quiz_session_id

learning_progress
├── user_id, xp, level
└── streak_days, last_activity_date, updated_at

agent_traces
├── user_id, agent_name, input, output
└── feedback_score, session_id, created_at
```

---

## 🔬 Evaluation & Observability

### Agent Traces

Every agent interaction is logged to Supabase and Opik:

```typescript
interface AgentTrace {
  id: string;
  user_id: string;
  agent_name: 'teaching' | 'quiz' | 'conversation' | 'article' | 'evaluator';
  input: string;
  output: string;
  latency_ms?: number;
  feedback_score?: number;
  created_at: timestamp;
}
```

### LLM-as-Judge (Evaluator Agent)

The Evaluator Agent performs quality control across all specialist agents:

- **Teaching Clarity**: Are explanations understandable?
- **Cultural Accuracy**: Are cultural notes authentic?
- **Pedagogical Effectiveness**: Does the content teach well?
- **Response Relevance**: Is the output on-topic?

### Opik Integration

- Trace logging for all agent calls (`lib/opik.ts`)
- Admin dashboards for agent traces (`components/admin`)
- Metadata tagging for model, latency, and evaluation results

---

## 🛠 Tech Stack

| Layer                        | Technology                                    |
| ---------------------------- | --------------------------------------------- |
| **Frontend**           | Next.js 16 (App Router), React 19, TypeScript |
| **UI Components**      | shadcn/ui + Radix UI                          |
| **Backend**            | Supabase (Postgres, Auth, RLS)                |
| **LLM Infrastructure** | Groq (Llama 3.3), Google GenAI (optional)     |
| **Observability**      | Opik + Supabase trace logging                 |
| **Audio**              | ElevenLabs TTS                                |
|                              |                                               |

### Design System

A unique **"Hand-drawn Swiss"** aesthetic that removes the cold, digital feel:

- Warm cream backgrounds with terracotta accents
- Wobbly, freehand borders (no sharp edges)
- Sketch-style illustrations and icons
- Fonts: Caveat (headings), Patrick Hand (body), DM Sans (UI)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase account (for database/auth)
- Groq API key (for LLM)
- Opik API key (for tracing)
- ElevenLabs API key (for TTS, optional)
- Google GenAI API key (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Swahili.git
cd Swahili/swahili

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

### Environment Variables

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_genai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

OPIK_API_KEY=your_opik_api_key
OPIK_WORKSPACE=your_opik_workspace
OPIK_PROJECT_NAME=your_opik_project
OPIK_URL_OVERRIDE=your_opik_url
PUBLIC_TRACE_USER_ID=optional_fallback_user_id
```

### Database Setup

Run the complete schema from `docs/COMPLETE_DATABASE_SETUP.md` in your Supabase SQL Editor.

---

## 📁 Project Structure

```
Swahili/
├── Readme.md
└── swahili/
    ├── app/                     # Next.js App Router
    │   ├── (protected)/         # Auth-gated routes
    │   ├── api/agents/           # Agent API routes
    │   ├── auth/                 # Login/Signup
    │   └── onboarding/           # Onboarding flow
    ├── components/               # UI + feature components
    ├── hooks/                    # Custom React hooks
    ├── integrations/supabase/    # Supabase client + types
    ├── lib/agents/               # Agent logic
    ├── public/                   # Static assets
    ├── package.json
    └── next.config.ts
```

---

## 📊 Demo

### Lesson Flow

The lesson journey guides learners through structured acquisition:

**Step 1: Intro** → Welcome and lesson context

**Step 2: Learn** → Vocabulary cards with pronunciation playback

**Step 3: Practice** → Interactive exercises with hints and immediate feedback

**Step 4: Quiz** → Short assessment and XP reward

**Step 5: Celebration** → XP rewards, streak updates, and garden growth

### Word Garden

Watch your vocabulary grow from seeds to trees as you master words through spaced repetition.

---

## 🔮 Roadmap

- [ ] Native Swahili voice (ElevenLabs TTS)
- [ ] Grammar Agent for noun class explanations
- [ ] Culture Agent for proverbs and regional variations
- [ ] Offline mode with service worker
- [ ] Mobile app (React Native)

---

## 🙏 Acknowledgments

- **Swahili Community** for linguistic guidance
- **Comet/Opik** for observability infrastructure
- **Groq** for high-speed LLM inference
- **Supabase** for backend infrastructure

---

<div align="center">

**Karibu! Welcome to your Swahili learning journey.**

*Made with ❤️ for language learners*


</div>
