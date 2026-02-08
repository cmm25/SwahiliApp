# RAFIKI (SWAHILIAPP)

**Your language journey has roots. Grow them.**

RAFIKI is an AI-powered Swahili language learning platform where learners cultivate their vocabulary like a living garden. Moving beyond static flashcards, RAFIKI captures "learning context" - the cultural nuances, usage patterns, and personal progress that create fluency rather than just memorization.

## The Problem We're Solving

The global market for language-learning apps is already in the double-digit billions, reflecting enormous demand for new language skills. However, these apps suffer from extremely poor long-term engagement: studies show that only about 2% of users remain active after 30 days, meaning the vast majority of learners drop out quickly. This suggests the current ecosystem is fundamentally broken:

**Gamification fatigue**
Most apps rely on points, badges, leaderboards and streaks to drive engagement. Research indicates such extrinsic rewards can boost short-term motivation but fail to produce lasting learning commitment. Learners quickly tire of repetitive incentives, which may even induce stress or anxiety, without actually building true fluency.

**Cultural disconnection**
Vocabulary is often taught out of context (e.g., as isolated flashcards or drills), which undermines retention. Language experts emphasize that words tied to cultural experiences are much easier to remember and use correctly. Without grounding in culture, learners miss the rich social meaning of phrases and expressions.

**One-size-fits-all pacing**
Many apps present a fixed curriculum and review schedule for everyone. In reality, each learner has unique memory patterns and needs. Proven methods like spaced repetition dramatically improve retention, but are often implemented in a static way (or ignored entirely) in popular apps, so users don’t get optimally timed reviews.

**African languages underserved**
Most commercial apps focus on European or widely studied languages. In contrast, African languages (over 2,000 in number) have been largely bypassed by mainstream educational tech. Swahili alone is spoken by roughly 150–200 million people across East Africa and beyond, yet high-quality Swahili learning resources remain scarce.

Traditional platforms tend to treat words like collectibles (“you get a new badge!”) rather than elements of living culture. In summary, the industry faces churn due to superficial engagement tactics and lack of personalization, and it has largely ignored contexts like African culture and language needs.

**RAFIKI fixes this**: You learn words → our AI provides rich cultural context and usage examples → spaced repetition schedules present reviews at optimal intervals → your Word Garden visualizes each word’s growth (from seed to tree) as you master it. This pipeline ensures learning is both meaningful and memorable.

## Why Multi-Agent AI Matters

Most language apps rely on static content or simple scripted chatbots. In RAFIKI, we deploy a team of specialized AI agents that work together, each solving a specific pedagogical challenge:

| Agent                        | Role                                                      | Why It Matters                                                                                              |
| :--------------------------- | :-------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **Teaching Agent**     | Provides pronunciation, cultural notes, example sentences | Every word gets rich, personalized context rather than a dry dictionary definition.                         |
| **Quiz Agent**         | Generates adaptive quizzes and exercises                  | Questions adjust to each learner’s performance, keeping them challenged but not overwhelmed.               |
| **Conversation Agent** | Engages the learner in natural dialogue practice          | Simulates real conversations instead of rote drills, improving confidence.                                  |
| **Article Agent**      | Curates daily reading passages                            | Generates fresh daily, level-appropriate short articlesand videos to learn more about the swahili way of life. |
| **Evaluator Agent**    | Acts as an AI “judge” for quality control               | Uses an LLM to score the clarity and cultural accuracy of content, ensuring high quality.                   |

Each agent has a clear role – this isn’t AI for its own sake. By modularizing these functions, RAFIKI overcomes limitations of one-size-fits-all systems. The Evaluator Agent reviews each interaction to maintain consistent teaching quality.

## Tech Stack

**Frontend**

- Next.js 16
- Tailwind CSS

**Backend & Infrastructure**

- Supabase (PostgreSQL database + Auth + RLS)
- Next.js API Routes for agent endpoints

**AI & Observability**

- Groq (Llama 3.3 70B) for high-speed inference
- Google GenAI (Gemini) for evaluation (optional)
- Opik for trace logging and observability
- ElevenLabs for Text-to-Speech audio

## 📁 Project Structure

```
swahili/
├── app/                          # Next.js app router pages
│   ├── (protected)/              # Authenticated routes
│   │   ├── dashboard/            # Learner dashboard
│   │   ├── lessons/              # Lesson journey flow
│   │   ├── vocabulary/           # Word Garden interface
│   │   └── conversation/         # AI tutor chat
│   ├── api/agents/               # Agent API endpoints
│   ├── auth/                     # Login/Signup pages
│   └── onboarding/               # User onboarding flow
│
├── components/                   # React components
│   ├── admin/                    # Admin trace dashboard
│   ├── article/                  # Daily article feature
│   ├── landingpage/              # Landing page UI
│   ├── lesson/                   # Lesson phase components
│   ├── shared/                   # Reusable UI (SketchCard, etc.)
│   └── vocabulary/               # Word Garden visualizations
│
├── hooks/                        # Custom React hooks
│   ├── useTeaching.ts            # Spaced repetition logic
│   ├── useLesson.ts              # Lesson orchestration state
│   └── useQuiz.ts                # Quiz generation & handling
│
├── lib/                          # Core business logic
│   ├── agents/                   # Agent implementation files
│   ├── agent-logger.ts           # Trace logging to Opik/Supabase
│   └── llm.ts                    # LLM client abstraction
│
└── integrations/                 # External service clients
    └── supabase/                 # Supabase client & types
```

## Installation

### Prerequisites

- Node.js (v18+)
- npm
- Supabase account
- Groq API key
- Opik API key

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/your-username/Swahili.git
cd Swahili/swahili
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Fill in all required environment variables (Supabase, Groq, Opik, ElevenLabs).

4. **Set up Supabase database**

- Create a new Supabase project.
- Run the provided SQL schema in your project's SQL editor.

5. **Run development server**

```bash
npm run dev
```

Open http://localhost:3000

## 🌸 Word Garden Integration

RAFIKI uses a custom implementation of the **SM-2 Spaced Repetition Algorithm** to manage vocabulary retention. This system ensures that words are reviewed at scientifically optimal intervals.

**Growth Stages:**

- **Seed** 🌰 (New)
- **Sprout** 🌱 (Learning)
- **Sapling** 🌿 (Reviewing)
- **Flower** 🌸 (Known)
- **Tree** 🌳 (Mastered)

The visual state of the garden directly reflects the user's memory strength, providing immediate, intuitive feedback on learning progress.

## 🔬 Multi-Agent Pipeline

RAFIKI orchestrates five specialized agents to deliver a comprehensive learning experience:

1. **Teaching Agent** explains concepts and enhances vocabulary.
2. **Quiz Agent** assesses understanding through adaptive tests.
3. **Conversation Agent** facilitates natural dialogue practice.
4. **Article Agent** generates level-appropriate reading materials and cultural content from blogs to youtube videos on a daily basis ( new day new content)
5. **Evaluator Agent** (LLM-as-a-Judge) scores interaction quality.

All agent interactions are traced and logged via **Opik** for analysis and improvement.

## Demo

**Live Site:** https://swahili-app.vercel.app/
