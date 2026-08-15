import { login } from "./api";
import { useState, useEffect, useRef } from "react";

function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const googleButtonRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
  function renderGoogleButton() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "866211342910-fhp7668n17655mcgtd1ghaqsegcvi300.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 280,
      });
    } else {
      setTimeout(renderGoogleButton, 200);
    }
  }

  renderGoogleButton();
}, []);

   

async function handleGoogleResponse(response) {
  const idToken = response.credential;

  const res = await fetch("http://localhost:8080/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (res.ok) {
    const token = await res.text();
    localStorage.setItem("token", token);
    onLoginSuccess();
  } else {
    setError("Google sign-in failed");
  }
}

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const response = await login(email, password);

    if (response.ok) {
      const token = await response.text();
      localStorage.setItem("token", token);
      onLoginSuccess();
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <div style={{ position: "relative" }}>
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={{ paddingRight: "70px" }}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "8px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      color: "#6b7780",
      padding: "4px 8px",
      margin: 0,
      fontSize: "12px",
      fontWeight: "600",
    }}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>
        <br />
        <button type="submit">Login</button>
      </form>
      <div style={{ margin: "16px 0", textAlign: "center", color: "#888" }}>or</div>
<div ref={googleButtonRef}></div>
      {error && <p className="error-text">{error}</p>}
      <p>
        Don't have an account?{" "}
        <button onClick={onSwitchToSignup}>Sign up</button>
      </p>
    </div>
  );
}

export default Login;