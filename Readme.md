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

| Agent                        | Role                                                      | Why It Matters                                                                                                 |
| :--------------------------- | :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Teaching Agent**     | Provides pronunciation, cultural notes, example sentences | Every word gets rich, personalized context rather than a dry dictionary definition.                            |
| **Quiz Agent**         | Generates adaptive quizzes and exercises                  | Questions adjust to each learner’s performance, keeping them challenged but not overwhelmed.                  |
| **Conversation Agent** | Engages the learner in natural dialogue practice          | Simulates real conversations instead of rote drills, improving confidence.                                     |
| **Article Agent**      | Curates daily reading passages                            | Generates fresh daily, level-appropriate short articlesand videos to learn more about the swahili way of life. |
| **Evaluator Agent**    | Acts as an AI “judge” for quality control               | Uses an LLM to score the clarity and cultural accuracy of content, ensuring high quality.                      |

### Agent Architecture & Dependencies

The agents function as a cohesive system rather than isolated chatbots. Their workflow is orchestrated to ensure consistency:

1. **The Router**: Central API gateway that analyzes user intent and dispatches the request to the appropriate specialist agent.
2. **Inter-Agent Dependency**:
   * **Shared Context**: Agents operate on common data structures (like `UserWord` or `Lesson`) provided by the frontend controller.
   * **Evaluator Loop**: The **Evaluator Agent** sits downstream of the Conversation Agent, asynchronously grading its outputs to ensure quality without slowing down the chat.
3. **Observability (Opik)**: Every step of an agent's "thought process"—from prompt construction to the final LLM response—is traced in Opik. This provides a black-box flight recorder for AI logic, allowing us to debug why an agent chose a specific teaching example or quiz question.

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

## 🗄️ Database Architecture

The application relies on a robust relational schema in **Supabase (PostgreSQL)** to maintain the complex state of user progress, content, and AI interactions.

### Core User & Content

* **`profiles`**: The central user identity table linked to Supabase Auth. Stores preferences, daily goals, and native language.
* **`user_roles`**: Manages RBAC (Role-Based Access Control) for admins and regular users.
* **`vocabulary_words`**: The master dictionary. Contains canonical Swahili words, definitions, audio links, and metadata. Read-heavy and shared by all users.

### Learning Engine (SRS & Progress)

* **`user_vocabulary`**: The heart of the SM-2 algorithm. Links users to words and stores individual review schedules (`next_review_at`, `ease_factor`, `growth_stage`).
* **`lesson_progress`**: Tracks which lessons/modules a user has completed or is currently working on.
* **`learning_progress`**: Aggregates high-level progress metrics like daily streaks.
* **`xp_history`**: A granular ledger of every XP point earned, allowing for detailed gamification history and charts.

### Session & Activity Tracking

* **`practice_sessions`**: Logs general vocabulary practice intervals.
* **`quiz_sessions`**: specific records of quiz attempts generated by the Quiz Agent, including scores and completion times.
* **`conversation_sessions`**: Stores the history of chat interactions with the Conversation Agent, maintaining context for the AI.
* **`agent_traces`**: Links high-level AI actions (e.g., "Generated Quiz") to specific user sessions, acting as a bridge between the application and Opik observability.

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

## 🌸 Word Garden Integration (The Science of Tracking)

RAFIKI uses a custom implementation of the **SM-2 Spaced Repetition Algorithm** to manage vocabulary retention. This system ensures that words are reviewed at scientifically optimal intervals, maximizing long-term memory while minimizing time spent studying.

### How the Algorithm Works

For every word a learner encounters, the system tracks three core metrics in the database:

1. **Interval (I)**: The number of days until the next review is due.
2. **Repetition (n)**: The number of consecutive times the word has been recalled successfully.
3. **Ease Factor (EF)**: A multiplier (starting at 2.5) that determines how quickly the interval increases.

### The Feedback Loop

When a user reviews a word, they provide feedback (or answer a quiz), which results in a grade:

* **"Forgot" / Incorrect**: The interval resets to 1 day. The Ease Factor is slightly reduced. The word returns to the "Sprout" stage.
* **"Struggled"**: The interval stays short. The system recognizes the word is difficult for the user.
* **"Good" / "Perfect"**: The Ease Factor increases. The new interval is calculated as `Previous Interval * Ease Factor`. This pushes the next review further into the future (e.g., 3 days -> 10 days -> 30 days).

**Growth Stages:**

- **Seed** 🌰 (New): Words not yet studied.
- **Sprout** 🌱 (Learning): High frequency reviews (Days 1-3).
- **Sapling** 🌿 (Reviewing): Medium intervals (Weeks).
- **Flower** 🌸 (Known): Long intervals (Months).
- **Tree** 🌳 (Mastered): Very long intervals (Years).

The visual state of the garden directly reflects these underlying math metrics. A "wilted" flower visually signals that the `next_review_at` timestamp has passed, prompting the user to water (review) it.

## 🔬 Multi-Agent Pipeline

RAFIKI orchestrates five specialized agents to deliver a comprehensive learning experience:

### Core Agent Functionality

Detailed breakdown of how each specialist agent operates based on the actual codebase implementation:

1. **Teaching Agent** (`/lib/agents/teaching.ts`)

   * **Goal**: To introduce new vocabulary and manage the spaced repetition review cycle.
   * **Input**: Specific words to introduce or review + user performance data.
   * **Process**:
     1. **Introduction**: Generates structured content (phonetics, examples, cultural notes) for new words using Llama 3.3.
     2. **Review**: Calculates the next review date using a custom SM-2 implementation (`calculateNextStage`, `calculateSM2`). It updates the word's "Growth Stage" (Seed → Sprout → ... → Tree) based on user feedback.
     3. **Practice**: Generates encouraging practice session intros using garden metaphors.
   * **Output**: JSON data containing the educational content and updated scheduling metrics.
2. **Quiz Agent** (`/lib/agents/quiz.ts`)

   * **Goal**: To generate and grade assessment questions.
   * **Input**: A list of vocabulary words provided by the lesson controller.
   * **Process**:
     1. **Generation**: Uses Groq (Llama 3.3) to dynamically create questions (Multiple Choice, Translation, Fill-in-the-blank) based on the input words. It uses the other input words as "distractors" for multiple-choice questions.
     2. **Grading**: Compares user answers against the correct values (using fuzzy matching for minor typos) and calculates an XP score.
     3. **Feedback**: Generates personalized, encouraging feedback based on the quiz score.
   * **Output**: A set of quiz questions or a graded result object with feedback.
3. **Conversation Agent** (`/lib/agents/conversation.ts`)

   * **Goal**: To provide a supportive chat interface for practicing Swahili.
   * **Input**: User message + Conversation History.
   * **Process**:
     1. Maintains a consistent "Rafiki" persona (friendly, patient tutor) via a system prompt.
     2. Sends the recent chat history (last 10 turns) to the LLM to maintain context.
     3. **Async Evaluation**: Triggers a background process where the **Evaluator Agent** reviews the exchange.
   * **Output**: A natural language text response.
4. **Article Agent** (`/app/api/agents/article-agent-proxy/route.ts`)

   * **Goal**: To find fresh, relevant reading content from the web.
   * **Input**: Daily topics (e.g., "Swahili music", "Tanzania culture") based on the day of the year.
   * **Process**:
     1. **Search**: Queries the **Firecrawl API** to find real-world articles matching the daily topic.
     2. **Caching**: Caches the result for 15 minutes to prevent rate-limiting and ensure consistent content for the day.
     3. **Curating**: Filters results to find the most relevant article metadata (Title, URL, Source).
   * **Output**: A JSON object representing the "Daily Read" article.
5. **Evaluator Agent** (`/lib/agents/evaluator.ts`)

   * **Goal**: To act as a quality guardrail for AI responses.
   * **Input**: User input + AI response (typically from the Conversation Agent).
   * **Process**:
     1. Uses a separate LLM call to score the interaction on Accuracy, Cultural Relevance, and Pedagogical Value.
     2. **Observability**: Logs the score and reasoning to **Opik** as a "delayed feedback" trace. This allows developers to monitor the quality of the conversation bot over time.
   * **Output**: A JSON score (0.0 - 1.0) and a qualitative reason.

### Observability & Tracing

All agents utilize a shared logger (`logTrace` in `/lib/opik.ts`) to send detailed execution data to **Opik**. This includes:

* **Inputs/Outputs**: The exact prompts sent to the LLM and the raw responses.
* **Latency**: How long each step took.
* **Metadata**: Specific context like `wordId`, `lessonId`, or `growthStage`.
* **Tags**: Labels like `teaching`, `quiz`, or `error` for easy filtering in the Opik dashboard.
