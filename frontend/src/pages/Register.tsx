/**
 * Registration Page
 * OWNER: Kasun (UI/UX design), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This page renders a registration form for new users.
 *
 * UI REQUIREMENTS (Kasun):
 * - Centered card layout matching the Login page style
 * - Fields: Full Name, Email, Phone (optional), Password, Confirm Password
 * - Inline validation feedback (red borders, error messages under fields)
 * - "Register" submit button with loading state
 * - "Already have an account? Login" link → navigates to /login
 * - Success state: brief confirmation before redirecting to /otp
 *
 * LOGIC REQUIREMENTS (Muditha):
 * - Use useAuth() hook to access the register function
 * - Client-side validation:
 *   - fullName: min 2 characters
 *   - email: valid email format
 *   - password: min 8 characters
 *   - confirmPassword: must match password
 *   - phone: optional, if provided must be valid format
 * - On submit: call register(email, password, fullName, phone)
 * - On success: navigate to /otp
 * - On error: display API error (e.g., "Email already registered" → 409)
 *
 * API CALL: POST /api/auth/register { email, password, fullName, phone? }
 * SUCCESS: 201 { user, accessToken, refreshToken }
 * ERROR: 409 (duplicate email), 400 (validation)
 *
 * TODO (Kasun): Design and style the registration form
 * TODO (Muditha): Wire up useAuth().register and validation
 */
import { useState, type FormEvent } from "react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // TODO (Muditha): Add client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO (Muditha): Call useAuth().register(email, password, fullName, phone)
      // Then navigate to /otp
      console.log("TODO: implement register", { fullName, email, phone, password });
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* TODO (Kasun): Style this page */}
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <label>Full Name:</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone (optional):</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
