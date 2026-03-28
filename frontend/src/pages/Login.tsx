/**
 * Login Page
 * OWNER: Kasun (UI/UX design), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This page renders a login form with email and password fields.
 *
 * UI REQUIREMENTS (Kasun):
 * - Clean, centered card layout with the Banking System logo/title
 * - Email input field with email validation feedback
 * - Password input field with show/hide toggle
 * - "Login" submit button (disabled while submitting, shows spinner)
 * - "Don't have an account? Register" link below the form → navigates to /register
 * - Error message display area (wrong password, user not found, server error)
 * - Responsive: works on mobile and desktop
 *
 * LOGIC REQUIREMENTS (Muditha):
 * - Use useAuth() hook to access the login function
 * - On form submit: call login(email, password)
 * - On success: navigate to /otp (user must verify OTP before accessing dashboard)
 * - On error: display error message from API (e.g., "Invalid credentials")
 * - Prevent double-submit with loading state
 * - Client-side validation: email format, password not empty
 *
 * API CALL: POST /api/auth/login { email, password }
 * SUCCESS RESPONSE: 200 { user, accessToken, refreshToken }
 * ERROR RESPONSES: 401 (wrong password), 404 (user not found)
 *
 * TODO (Kasun): Design and style the login form
 * TODO (Muditha): Wire up useAuth().login and navigation
 */
import { useState, type FormEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // TODO (Muditha): Call useAuth().login(email, password)
      // Then navigate to /otp
      console.log("TODO: implement login", { email, password });
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* TODO (Kasun): Style this page */}
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
