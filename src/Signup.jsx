import { useState } from "react";
import { signup } from "./api";

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const response = await signup(name, email, password);

    if (response.ok) {
      setSuccess("Account created! You can now log in.");
    } else {
      const message = await response.text();
      setError(message || "Signup failed");
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <p>
        Already have an account?{" "}
        <button onClick={onSwitchToLogin}>Login</button>
      </p>
    </div>
  );
}

export default Signup;