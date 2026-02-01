# Script Writing Guide

Write a complete narrative script before breaking it into storyboard scenes. This phase focuses purely on **what to tell** and **how to tell it well**, without worrying about visual specifications, frame numbers, or animation parameters.

## Table of Contents

- [Why Script First](#why-script-first)
- [Script Template](#script-template)
- [Writing Process](#writing-process)
  - [Step 1: Define Narrative Strategy](#step-1-define-narrative-strategy)
  - [Step 2: Write the Full Script](#step-2-write-the-full-script)
  - [Step 3: Annotate Pacing](#step-3-annotate-pacing)
  - [Step 4: Self-Review](#step-4-self-review)
- [Narrative Techniques](#narrative-techniques)
  - [Story Arc Design](#story-arc-design)
  - [Metaphor and Analogy Design](#metaphor-and-analogy-design)
  - [Knowledge Scaffolding](#knowledge-scaffolding)
  - [Emotional Curve](#emotional-curve)
- [Script Examples](#script-examples)
- [Review Checklist](#review-checklist)

---

## Why Script First

The script phase exists to separate **narrative creation** from **visual specification**:

- **Here (Script)**: Focus on storytelling — what to say, in what order, with what analogies
- **Next (Storyboard)**: Focus on visualization — how to show it on screen with precise parameters

This separation ensures:
1. Better narrative quality (full attention on story coherence)
2. Cheaper iteration (modifying text is much faster than modifying storyboard specs)
3. Easier review (users can evaluate "is the story good?" without wading through frame numbers)
4. Better LLM output (each phase has a focused, manageable cognitive load)

---

## Script Template

```markdown
# Script: [Video Title]

## Core Message
- **One-line summary**: [What this video is about in one sentence]
- **Target audience**: [From Phase 1 requirements]
- **Learning objectives**: [From Phase 1 requirements]
- **Estimated duration**: [X minutes]

## Narrative Strategy
- **Entry angle**: [How to hook the audience into the topic]
- **Core metaphor/analogy**: [A central metaphor that runs through the video]
- **Emotional arc**: [e.g., Curiosity → Understanding → Wonder → Satisfaction]
- **Knowledge building order**: [Why this sequence — what depends on what]

## Full Script

### Opening (Hook + Introduction)
> [Complete narration text]
>
> Visual intent: [Brief description of what should be on screen — no frame numbers or animation specs]

### Chapter 1: [Title]
> [Complete narration text]
>
> Visual intent: [Brief visual description]

### Chapter 2: [Title]
> [Complete narration text]
>
> Visual intent: [Brief visual description]

### Chapter 3: [Title]
> [Complete narration text]
>
> Visual intent: [Brief visual description]

...

### Summary
> [Complete narration text]
>
> Visual intent: [Brief visual description]

### Ending
> [Complete narration text]
>
> Visual intent: [Brief visual description]

## Pacing Notes
- **Speed up**: [Sections with high information density that should move quickly]
- **Slow down**: [Key concepts that need time to digest]
- **Pause**: [Moments where the audience needs to think]

## Self-Review Checklist
- [ ] Story flows coherently from start to finish
- [ ] Knowledge builds progressively (no forward references)
- [ ] Metaphors/analogies are appropriate and consistent
- [ ] Tone matches the target audience
- [ ] Duration estimate is reasonable
- [ ] Each chapter serves a clear purpose
- [ ] The opening hook creates genuine curiosity
- [ ] The ending provides closure and satisfaction
```

---

## Writing Process

### Step 1: Define Narrative Strategy

Before writing any script text, decide:

**Entry Angle** — How to pull the audience in:
- Question: "Have you ever wondered why...?"
- Scenario: "Imagine you are..."
- Challenge: "Most people think X, but actually..."
- Story: "In 1905, a young clerk in a patent office..."

**Core Metaphor** — A familiar concept that maps to the topic:
- Good: "DNA is like a recipe book" (familiar → unfamiliar)
- Good: "The internet is like a postal system" (concrete → abstract)
- Bad: "Quantum mechanics is like a wave" (still abstract)

**Knowledge Order** — What must come before what:
```
Example for "How planes fly":
1. First: planes are heavy → creates the question
2. Second: four forces → gives the framework
3. Third: lift (the answer) → depends on knowing the question
4. Fourth: wing shape → explains HOW lift works
5. Fifth: balance → ties everything together
```

### Step 2: Write the Full Script

Write as if you're speaking to the audience. Key principles:

- **Write complete narration text** — every word that will be spoken
- **Add visual intents** — brief descriptions of what should appear on screen (NOT technical specs)
- **Mark emphasis** — bold for stressed words, italic for softer tone
- **Use natural language** — read it aloud to check flow

**Visual Intent vs Visual Specification:**
```
✓ Visual intent (script phase):
  "Show the airplane from the side with four arrows representing the forces"

✗ Visual specification (storyboard phase):
  "Airplane SVG centered at (960, 540), 300x120px, ForceArrow components
   with spring(damping:12) at frames 240-360"
```

### Step 3: Annotate Pacing

After the full script is written, go back and mark:

- Where to **speed up** (information the audience already half-knows)
- Where to **slow down** (new or counterintuitive concepts)
- Where to **pause** (let the audience process before moving on)
- Where to **build tension** (short sentences leading to a reveal)

### Step 4: Self-Review

Read the entire script from start to finish and check:

1. **Coherence**: Does the story make sense as a continuous narrative?
2. **Progressive building**: Does each section build on the previous one?
3. **Audience fit**: Is the language appropriate for the target audience?
4. **Completeness**: Are all learning objectives covered?
5. **Engagement**: Would YOU want to keep watching?

---

## Narrative Techniques

### Story Arc Design

Every good educational video follows an arc:

```
Engagement ▲
           │         ╱╲
           │        ╱  ╲        ╱╲
           │   ╱╲  ╱    ╲      ╱  ╲
           │  ╱  ╲╱      ╲    ╱    ╲
           │ ╱              ╲  ╱      ╲
           │╱                ╲╱        ╲___
           └──────────────────────────────→ Time
           Hook  Build  Climax  Resolve  End
```

- **Hook**: Highest initial curiosity — a question or surprise
- **Build**: Gradually introduce concepts, each raising new questions
- **Climax**: The "aha moment" — when the key insight clicks
- **Resolve**: Connect everything together
- **End**: Satisfaction + lingering curiosity

### Metaphor and Analogy Design

Good metaphors for educational content:

| Technique | When to Use | Example |
|-----------|-------------|---------|
| **Direct analogy** | New concept similar to familiar one | "Electrons orbit like planets" |
| **Contrast analogy** | Correcting misconceptions | "Unlike a battery, a capacitor..." |
| **Scale analogy** | Making large/small tangible | "If an atom were a stadium..." |
| **Process analogy** | Explaining mechanisms | "Encryption is like a secret language..." |

Rules for metaphors:
- Introduce the metaphor early, reference it throughout
- Acknowledge where the metaphor breaks down (if relevant)
- Don't mix metaphors — one central metaphor per video
- Ensure the familiar side is truly familiar to the target audience

### Knowledge Scaffolding

Build knowledge like a staircase — each step supports the next:

```
Step 4: [Advanced concept]    ← Requires steps 1-3
Step 3: [How it works]        ← Requires steps 1-2
Step 2: [Basic framework]     ← Requires step 1
Step 1: [Foundation concept]  ← No prerequisites
```

Anti-pattern: **Forward references**
```
✗ "As we'll see later, this is because of quantum tunneling..."
  (Don't reference concepts not yet explained)

✓ "Remember how we said electrons are like balls on a hill?
   Well, imagine that ball could sometimes pass through the hill..."
  (Build on what's already established)
```

### Emotional Curve

Plan the emotional journey:

| Phase | Emotion | How to Create |
|-------|---------|---------------|
| Opening | **Curiosity** | Ask a surprising question |
| Foundation | **Interest** | Reveal the framework |
| Deep dive | **Focus** | Step-by-step explanation |
| Key insight | **Wonder** | The "aha!" moment |
| Application | **Connection** | Real-world relevance |
| Closing | **Satisfaction** | Everything clicks together |

---

## Script Examples

### Short Script Example (1-2 min): Why is the sky blue?

```markdown
# Script: 天空为什么是蓝色的

## Core Message
- **One-line summary**: Light from the sun gets scattered by the atmosphere, and blue light scatters the most
- **Target audience**: Children (8-12)
- **Learning objectives**: Understand that sunlight contains all colors; know that air scatters blue light more
- **Estimated duration**: 1.5 minutes

## Narrative Strategy
- **Entry angle**: Question — "Have you ever wondered why?"
- **Core metaphor**: Light as a bouncing ball — different colors bounce differently
- **Emotional arc**: Curiosity → Surprise (sunlight is all colors) → Understanding → Delight
- **Knowledge building order**: Sky is blue (observation) → sunlight has all colors (foundation) → air scatters light (mechanism) → blue scatters most (answer)

## Full Script

### Opening
> "每天抬头看天空，它都是**蓝色**的。
> 但你有没有想过——为什么偏偏是蓝色，而不是绿色、红色？"
>
> Visual intent: Blue sky, then flash different colored skies to show the question

### Chapter 1: Sunlight's Secret
> "秘密要从阳光说起。
> 阳光看起来是白色的，对吧？
> 但其实，它是由**所有颜色**混合在一起的！
> 红、橙、黄、绿、蓝、紫——全都藏在阳光里。"
>
> Visual intent: White sunlight beam splits into rainbow colors (like a prism)

### Chapter 2: The Bouncing Game
> "当阳光穿过大气层时，会碰到很多很多*小小的*空气分子。
> 这些分子会让光「弹来弹去」。
> 但有意思的是——**蓝色**的光最容易被弹开，
> 它会向四面八方散射。
> 而红色的光呢？它大多直接穿过去了。"
>
> Visual intent: Show light particles hitting air molecules, blue ones bouncing everywhere, red ones passing through

### Summary
> "所以我们抬头看到的，就是从四面八方弹过来的蓝色光。
> 整个天空都在发出蓝色的光芒！"
>
> Visual intent: Pull back to show the whole sky filled with scattered blue light

### Ending
> "对了，你知道为什么日落时天空会变成*橙红色*吗？
> 那是因为——嗯，这个问题留给你想想看！"
>
> Visual intent: Sunset transition, ending with a question mark

## Pacing Notes
- **Speed up**: The color listing (red, orange, yellow...) — keep it rhythmic
- **Slow down**: "Blue light scatters the most" — this is the key insight
- **Pause**: After "Why blue and not green or red?" — let the question sink in

## Self-Review Checklist
- [x] Story flows coherently from start to finish
- [x] Knowledge builds progressively
- [x] Metaphors are appropriate (bouncing ball for scattering)
- [x] Tone is appropriate for children
- [x] Duration ~1.5 min is reasonable
- [x] Hook creates curiosity
- [x] Ending leaves the audience wanting more
```

---

## Review Checklist

Before passing the script to the Storyboard phase, verify:

### Narrative Quality
- [ ] The story has a clear beginning, middle, and end
- [ ] The hook creates genuine curiosity or engagement
- [ ] Each chapter has a clear purpose in the overall narrative
- [ ] Transitions between chapters feel natural
- [ ] The conclusion provides satisfying closure

### Educational Quality
- [ ] All learning objectives from Phase 1 are addressed
- [ ] Knowledge is built progressively — no forward references
- [ ] Concepts are explained at the right level for the audience
- [ ] Analogies/metaphors are accurate and accessible
- [ ] Key terms are introduced and explained naturally

### Script Quality
- [ ] Narration reads naturally when spoken aloud
- [ ] Sentence length is appropriate for the audience
- [ ] Emphasis markers are placed on truly important words
- [ ] Visual intents give enough direction without over-specifying
- [ ] Pacing notes identify where to speed up, slow down, and pause

### Completeness
- [ ] Core message is defined
- [ ] Narrative strategy is documented
- [ ] Full narration text is written for every section
- [ ] Visual intents accompany each section
- [ ] Pacing notes are provided
- [ ] Estimated duration is realistic
