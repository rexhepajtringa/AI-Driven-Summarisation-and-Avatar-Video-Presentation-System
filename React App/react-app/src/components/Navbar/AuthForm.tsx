import React, { useState } from "react";
import config from "config";

interface AuthFormProps {
  isSignUp: boolean;
  onLoginSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_GATEWAY_URL = config.API_GATEWAY_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint = isSignUp
      ? `${API_GATEWAY_URL}/USER-MANAGEMENT-SERVICE/api/v1/auth/register`
      : `${API_GATEWAY_URL}/USER-MANAGEMENT-SERVICE/api/v1/auth/login`;

    const payload = isSignUp
      ? JSON.stringify({ username, email, password })
      : JSON.stringify({ username, password });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Operation successful!");
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError(data.message || "Failed to complete the operation");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
      </div>
      {isSignUp && (
        <div>
          <label>
            Email address:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
      )}
      <div>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Submit</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
    </form>
  );
};

export default AuthForm;
