/**
 * Withdraw Page (Protected)
 * OWNER: Kasun (UI/UX design), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This page allows authenticated users to withdraw money from their account.
 * Similar to Deposit but with additional insufficient funds handling.
 *
 * UI REQUIREMENTS (Kasun):
 * - Card layout with "Withdraw Funds" title
 * - Current balance display at the top (fetched on mount) — IMPORTANT for UX
 *   so users know how much they can withdraw
 * - Amount input: number field, min 0.01, step 0.01
 *   Optionally show a "Max" button that fills in the current balance
 * - Description input: optional text field
 * - "Withdraw" submit button with loading state
 * - Success state: "Withdrew LKR X. New balance: LKR Y"
 * - Error states:
 *   - INSUFFICIENT_FUNDS: "Insufficient funds. Your balance is LKR X"
 *   - Other: generic error message
 * - "Cancel" link back to /dashboard
 *
 * LOGIC REQUIREMENTS (Muditha):
 * - On mount: fetch current balance to display and use for client-side validation
 * - Client-side validation: amount > 0 AND amount <= current balance
 * - On submit: call api.withdraw({ amount, description })
 * - On success: show confirmation with new balance
 * - On 400 INSUFFICIENT_FUNDS error: show specific error with current balance
 *
 * API CALL: POST /api/accounts/me/withdraw { amount, description? }
 * SUCCESS: 200 { transaction, newBalance }
 * ERROR: 400 { error: { code: "INSUFFICIENT_FUNDS", message: "..." } }
 *
 * TODO (Kasun): Design the withdraw form with balance display
 * TODO (Muditha): Wire up API call and insufficient funds handling
 */
import { useState, useEffect, type FormEvent } from "react";
import { Link } from "react-router-dom";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // TODO (Muditha): Fetch current balance on mount
    // const fetchBalance = async () => {
    //   const res = await getBalance();
    //   setBalance(res.balance);
    // };
    // fetchBalance();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    if (balance !== null && numAmount > balance) {
      setError(`Insufficient funds. Your balance is LKR ${balance.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO (Muditha): Call api.withdraw({ amount: numAmount, description })
      console.log("TODO: implement withdraw", { amount: numAmount, description });
    } catch (err) {
      setError("Withdrawal failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* TODO (Kasun): Style this page */}
      <h1>Withdraw Funds</h1>
      {balance !== null && (
        <p>Available balance: LKR {balance.toLocaleString()}</p>
      )}
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
            {isSubmitting ? "Processing..." : "Withdraw"}
          </button>
          {" "}
          <Link to="/dashboard">Cancel</Link>
        </form>
      )}
    </div>
  );
}
