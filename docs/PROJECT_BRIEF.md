# Project Brief: Breathe Nerd

## Problem

Developers and people who work at computers often spend long stretches of time in high-focus, high-stress work states without intentional recovery. When breaks happen, they are commonly passive activities like scrolling, watching videos, or checking notifications. Those breaks can feel easy, but they do not always help the nervous system reset.

There is not a simple, low-friction tool designed for this exact moment inside a work session. Many wellness apps are too broad, too complex, or require too much commitment to open when someone only needs a short reset before returning to work.

## Solution

Breathe Nerd is a web application that guides users through a short structured breathing exercise. The app is designed to be quick and easy to use during a work session: open it, breathe, and return to work.

The MVP focuses on authentication, protected routes, one guided breathing exercise, and a database prepared for future breathing-session tracking.

In later stretch versions, users can rate their stress level before and after breathing, save completed breathing sessions, and view a personal dashboard. That feedback loop can help users see whether the exercise is working and build a consistent recovery habit.

## MVP

The MVP is the smallest version of Breathe Nerd that proves the core value of the app. A user should be able to create an account, log in, access a protected breathing exercise, and complete one guided breathing flow.

The MVP includes:

- User authentication with signup, login, logout, bcrypt password hashing, server-side auth sessions, and protected routes.
- One guided breathing exercise with a timer and a clean calming interface.
- A database prepared for future breathing-session tracking without building the full dashboard yet.

Future saved breathing sessions could include:

```text
user_id
created_at
mood_before
mood_after
duration
```

## Possible Features

Stretch features are optional additions that can make the app more useful after the MVP is complete.

- Mood check-in before and after the breathing exercise using a 1 to 10 stress scale.
- Breathing-session saving to the database with user ID, timestamp, mood before, mood after, and duration.
- A personal dashboard with breathing-session history, average mood before vs. after, and total breathing exercises completed.
- Chrome extension reminders that prompt users to take a breathing break at set intervals.
- One-click access from the browser so users can start a breathing exercise without leaving their workflow.
- Live breathing room showing how many other people are currently doing a breathing exercise.
- Multiple breathing exercises for different needs, such as box breathing, 4-7-8 breathing, and physiological sigh.
- Streak tracking to encourage consistent daily use.
- Pomodoro integration that prompts users to breathe after focused work blocks.
- Mood analytics dashboard showing trends over time, average improvement, best days of the week, and longer-term progress.

## Technical Challenges

- Keeping the breathing animation synchronized with the timer and breathing phases.
- Implementing secure authentication with bcrypt, auth sessions, and protected routes.
- Designing a Supabase PostgreSQL schema that can support future breathing-session tracking.
- Keeping auth sessions clearly separate from future breathing-session records.
- Planning for future dashboard stats without requiring the dashboard in the MVP.

