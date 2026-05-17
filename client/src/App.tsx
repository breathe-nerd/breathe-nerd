import { useState, useEffect } from "react";
import type { User } from "./types";
import LoginModal from "./components/LoginModal";
import BreathingPage from "./components/BreathingPage";
import "./App.css";

/*
  Responsibilities:
  - Verify auth session on app load
  - Store authenticated user state
  - Render login flow vs authenticated app
  - Handle logout

  Flow:
  App → passes auth callbacks to child components
  Child → reports successful login back to App
*/

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function authCheck() {
      try {
        const res = await fetch("/auth/verify", {
          method: "GET",
          // credentials required so session cookie is sent with the request
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    }
    authCheck();
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }
      // clear user state client-side after server session is destroyed
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  }

  // prevent app render until auth check completes
  if (loading) {
    return <p>npm installing calm...</p>;
    //make separate loading page component and pass function into here and style it with css
  }

  //BreathingPAge is always visible
  //LoginModal appears on top when user is logged out
  return (
    <>
      <BreathingPage user={user} onLogout={handleLogout} isBlurred={!user} />
      {!user && <LoginModal onLoginSuccess={(user: User) => setUser(user)} />}
    </>
  );
}

export default App;
