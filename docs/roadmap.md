# Roadmap

This roadmap describes the intended direction of Breathe Nerd at a durable, project-level view. It is not the active task list.

Use `TODO.md` for current work items. Use this roadmap to understand what the project is building toward and what should wait until later.

## Guiding Principle

Breathe Nerd should stay low friction.

The app should help someone take a short breathing break in the middle of a work session without creating a large setup process, a complicated wellness program, or a distracting dashboard-first experience.

## MVP

Goal: prove that a logged-in user can access and complete one guided breathing exercise.

The MVP includes:

- User signup, login, and logout.
- bcrypt password hashing.
- Server-side auth sessions.
- Protected routes for logged-in pages.
- One guided breathing exercise with a timer and calming UI.
- A database prepared for future breathing-session tracking.

The MVP is complete when:

- A user can create an account.
- A user can log in and log out.
- A logged-out user cannot access protected pages.
- A logged-in user can complete the guided breathing exercise.
- The database structure is ready to support future breathing-session records.
## Posible Features

## 1: Breathing-Session Tracking

Goal: add the first layer of personal progress tracking after the MVP works end to end.

- Mood check-in before and after the breathing exercise.
- Saving completed breathing sessions to the database.
- Breathing-session records tied to the logged-in user.
- Basic personal dashboard with breathing-session history.
- Simple stats such as total breathing exercises completed and average mood before vs. after.

Important language distinction:

- Auth sessions manage login state.
- Breathing sessions are completed breathing exercises saved for tracking.

This stage is complete when:

- A completed breathing exercise can be saved as a breathing-session record.
- Users only see their own breathing-session data.
- The dashboard shows real data from the database.

## 2: Habit-Building Features

Goal: make Breathe Nerd more useful for repeated use.

- Streak tracking.
- Pomodoro integration.
- Chrome extension.
- One-click browser access to start a breathing exercise.

These features should stay optional and should not make the app feel heavy.

## 3: Social Extensions

Goal: explore features that reduce friction or add lightweight community.

- Live breathing room showing how many people are currently doing an exercise.


## 4: Multiple Exercises

Goal: give user more options to pick from.

- Multiple breathing exercises.
- More detailed mood analytics.
- User preferences for default exercise type or duration.

## Long-Term Direction

The long-term version of Breathe Nerd can become a small recovery habit tool for developers and focused workers.

The project should continue to prioritize:

- Short, intentional use.
- Calm interaction design.
- Clear privacy boundaries.
- Simple progress feedback.
- Features that help users return to work feeling better.
