import { useState, useEffect } from "react";
import type { User } from "../types";

type BreathingPageProps = {
  user: User | null;
  onLogout: () => Promise<void>;
  isBlurred?: boolean;
};

/*
  BreathingPage remaining work:

  [ ] Animate the breathing circle:
      - grow during inhale
      - hold during pause
      - shrink during exhale
      - hold during pause

  [ ] Finish user connection:
      - confirm user name displays correctly after backend auth is complete
      - keep fallback welcome message if user or name is missing

  [ ] Use isBlurred prop:
      - blur or visually soften the breathing page when LoginModal is open
      - keep LoginModal as the focused foreground UI

  [ ] Cleanup:
      - remove temporary console logs
      - set timeRemaining back to 140 after testing
      - decide whether Stop should reset phase/count/timeRemaining
      - add class names for completion screen styling
      - make button text/capitalization consistent
      - check spelling in comments
      - test landing → breathing loop → completion → repeat
      - test logout after backend auth routes are finished
*/

function BreathingPage({ user, onLogout, isBlurred }: BreathingPageProps) {
  /*
  Create welcome message:
  -if user has a name, include user's name
  -otherwise show default message
  */

  const welcomeMessage = user?.name ? `Welcome, ${user.name}` : "Welcome, nerd";

  /*
  State variable declarations to track:
  -whether the beathing session has started
  -the current breathing phase
  -the countdown number for the current phase
  -the total time remaining in the current breathing session
  -keep track of when the session is complete
  */

  const [breathe, setBreathe] = useState(false);
  const [phase, setPhase] = useState("notStarted");
  const [count, setCount] = useState(4);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isComplete, setIsComplete] = useState(false);

  /* 
  Helper functions for moving through the breathing cycle
  */

  function goToInhale() {
    setBreathe(true);
    setPhase("inhale");
    setCount(4);
  }

  function goToPauseAfterInhale() {
    setPhase("pauseAfterInhale");
    setCount(1);
  }

  function goToExhale() {
    setPhase("exhale");
    setCount(6);
  }

  function goToPauseAfterExhale() {
    setPhase("pauseAfterExhale");
    setCount(1);
  }

  function handleStart() {
    goToInhale();
  }

  function handleStop() {
    setBreathe(false);
  }

  function handleRepeat() {
    setIsComplete(false);
    goToInhale();
  }

  /* 
  Helper functions to display/hide text
  -displays both pause phases simple as "pause"
  -hides countdown number during pauses so screen doesn't feel too text heavy
  */

  function getPhaseDisplayText() {
    if (!breathe) {
      return "";
    } else if (phase === "pauseAfterInhale" || phase === "pauseAfterExhale") {
      return "pause";
    } else {
      return phase;
    }
  }

  function getCountDisplayText() {
    if (!breathe) {
      return "";
    } else if (phase === "pauseAfterInhale" || phase === "pauseAfterExhale") {
      return "";
    } else {
      return count;
    }
  }

  /* 
  Use useEffect to run the breahting loop:
  -if the session has not started, do nothing
  -when it starts, run an interval every second
  -decrement the total time remaning
  -decrement the count for the current phase
  -check which phase the user is currently in
  -move to the next phase when the current count finishes
  -repeat the inhale, pause, exhale, pause cycle until total time <= 1
  -when total time <= 1 clear timer, set breathe to false, set is complete to true, reset time remaining
  -clear the interval so multiple timers don't run at once
  */

  useEffect(() => {
    if (!breathe) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(timer);
          setBreathe(false);
          setIsComplete(true);
          return 60;
        }
        console.log("currentTime", currentTime);
        return currentTime - 1;
      });

      if (count > 1) {
        setCount((currentCount) => currentCount - 1);
      } else if (phase === "inhale") {
        goToPauseAfterInhale();
      } else if (phase === "pauseAfterInhale") {
        goToExhale();
      } else if (phase === "exhale") {
        goToPauseAfterExhale();
      } else if (phase === "pauseAfterExhale") {
        goToInhale();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };

    /* 
    Place breathe, count, and phase state variables inside the dependency array
    -effect re-runs when breathing session starts
    -also re-runs each time count or phase changes
    -this keeps timer and current breathing state synced 
    */
  }, [breathe, count, phase]);

  /* 
    If breathing session is complete
    -return a completion screen
    -show buttons to start another session or log out
    */

  if (isComplete) {
    return (
      <main className="breathing-page">
        <section className="breathing-content">
          <h1>Session Promise Resolved</h1>

          <button onClick={handleRepeat}>run again</button>
          <button onClick={onLogout}>git checkout reality</button>
        </section>
      </main>
    );
  }

  /* 
  Otherwise, render the main page:
  -apply CSS classes for layout and styling
  -display title
  -welcome message appears until breathing cycle begins
  -current breathing instruction begins when start button is clicked
  -show animated breathing circle
  -show count when appropriate
  -show button that starts breathing session to start
  -show button that stops breathing session once cycle begins
  */

  return (
    <main className="breathing-page">
      <section className="breathing-content">
        <p className="app-title">Breathe Nerd</p>
        {!breathe && <p className="welcome-message">{welcomeMessage}</p>}

        <h1 className="phase-display">{getPhaseDisplayText()}</h1>

        <div className="breathing-circle">
          <span className="breathing-count">{getCountDisplayText()}</span>
        </div>

        {!breathe && <button onClick={handleStart}>npm install calm</button>}
        {breathe && <button onClick={handleStop}>esc</button>}
      </section>
    </main>
  );
}

export default BreathingPage;
