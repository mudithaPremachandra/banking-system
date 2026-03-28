/**
 * OTP Entry Page
 * OWNER: Kasun (UI/UX design), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * After login/registration, the user is redirected here to enter the 6-digit
 * OTP code that was sent to their email by the Notification Service.
 *
 * UI REQUIREMENTS (Kasun):
 * - Centered card with instructions: "Enter the 6-digit code sent to your email"
 * - Show the user's email address (from AuthContext or route state)
 * - OTP input: either 6 separate single-digit boxes or one text field
 *   (6 separate boxes is better UX — auto-focus next box on input)
 * - Countdown timer showing OTP expiry (5 minutes from when it was sent)
 * - "Verify" submit button with loading state
 * - "Resend OTP" button (disabled during countdown, e.g., 60 seconds cooldown)
 * - Error display: "Invalid OTP", "OTP expired"
 *
 * LOGIC REQUIREMENTS (Muditha):
 * - Use useAuth() to access verifyOTP function and user data
 * - On submit: call verifyOTP(userId, otpCode)
 * - On success (verified: true): navigate to /dashboard
 * - On 400 error: show "Invalid OTP code"
 * - On 410 error: show "OTP has expired. Please resend."
 * - Resend: call loginUser again to trigger a new OTP email
 *
 * API CALL: POST /api/otp/verify { userId, otpCode }
 * SUCCESS: 200 { verified: true }
 * ERROR: 400 (invalid OTP), 410 (expired OTP)
 *
 * TODO (Kasun): Design OTP input boxes and timer UI
 * TODO (Muditha): Wire up OTP verification and resend logic
 */
import { useState, type FormEvent } from "react";

export default function OTPEntry() {
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (otpCode.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO (Muditha): Call useAuth().verifyOTP(userId, otpCode)
      // Then navigate to /dashboard
      console.log("TODO: verify OTP", { otpCode });
    } catch (err) {
      setError("Invalid or expired OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* TODO (Kasun): Style this page with OTP input boxes */}
      <h1>Verify OTP</h1>
      <p>Enter the 6-digit code sent to your email</p>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <input
            type="text"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            required
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
      </form>
      {/* TODO (Muditha): Add resend OTP button with cooldown timer */}
      <button disabled>Resend OTP</button>
    </div>
  );
}
