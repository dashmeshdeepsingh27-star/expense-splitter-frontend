import { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import GroupDetail from "./GroupDetail";

function Logo() {
  return (
    <div className="app-header">
      <div className="app-logo-icon">₹</div>
      <div className="app-logo">SplitEasy</div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  function handleLoginSuccess() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  if (!isLoggedIn) {
    if (showSignup) {
      return (
        <>
          <Logo />
          <Signup
            onSignupSuccess={() => setShowSignup(false)}
            onSwitchToLogin={() => setShowSignup(false)}
          />
        </>
      );
    }
    return (
      <>
        <Logo />
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setShowSignup(true)}
        />
      </>
    );
  }

  if (selectedGroupId) {
    return (
      <>
        <Logo />
        <GroupDetail
          groupId={selectedGroupId}
          onBack={() => setSelectedGroupId(null)}
        />
      </>
    );
  }

  return (
    <>
      <Logo />
      <Dashboard
        onSelectGroup={(id) => setSelectedGroupId(id)}
        onLogout={handleLogout}
      />
    </>
  );
}

export default App;