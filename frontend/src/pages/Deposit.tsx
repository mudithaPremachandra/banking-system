/**
 * Deposit Page (Protected)
 * OWNER: Kasun (UI/UX design), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This page allows authenticated users to deposit money into their account.
 *
 * UI REQUIREMENTS (Kasun):
 * - Card layout with "Deposit Funds" title
 * - Current balance display at the top (fetched on mount)
 * - Amount input: number field, min 0.01, step 0.01
 *   Consider a formatted currency input (LKR prefix)
 * - Description input: optional text field (e.g., "Salary", "Transfer")
 * - "Deposit" submit button with loading state
 * - Success state: "Deposited LKR X. New balance: LKR Y" with a
 *   "Back to Dashboard" link
 * - Error state: display API error message
 * - "Cancel" link back to /dashboard
 *
 * LOGIC REQUIREMENTS (Muditha):
 * - On mount: fetch current balance to display
 * - Client-side validation: amount must be > 0
 * - On submit: call api.deposit({ amount, description })
 * - On success: show confirmation with new balance
 * - On error: show error message
 *
 * API CALL: POST /api/accounts/me/deposit { amount, description? }
 * SUCCESS: 200 { transaction, newBalance }
 *
 * TODO (Kasun): Design the deposit form
 * TODO (Muditha): Wire up API call and state management
 */
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO (Muditha): Call api.deposit({ amount: numAmount, description })
      // On success: setSuccess(`Deposited LKR ${numAmount}. New balance: LKR ${res.newBalance}`);
      console.log("TODO: implement deposit", { amount: numAmount, description });
    } catch (err) {
      setError("Deposit failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* TODO (Kasun): Style this page */}
      <h1>Deposit Funds</h1>
      {success ? (
        <div>
          <p style={{ color: "green" }}>{success}</p>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div>
            <label>Amount (LKR):</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description (optional):</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Deposit"}
          </button>
          {" "}
          <Link to="/dashboard">Cancel</Link>
        </form>
      )}
    </div>
  );
}
