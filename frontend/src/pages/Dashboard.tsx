/**
 * Dashboard Page (Protected)
 * OWNER: Kasun (UI/UX design), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This is the main page users see after authentication. It shows their
 * account balance and recent transaction history.
 *
 * UI REQUIREMENTS (Kasun):
 * - Welcome banner: "Welcome, {user.fullName}"
 * - Balance card: large display of current balance with currency (LKR)
 *   Format: "LKR 1,234,567.89" — use Intl.NumberFormat for formatting
 * - Action buttons: "Deposit" and "Withdraw" (link to /deposit and /withdraw)
 * - Transaction history table with columns:
 *   | Date | Type | Amount | Balance After | Description |
 *   - Type column: color-coded (green for DEPOSIT, red for WITHDRAWAL)
 *   - Date: formatted as "Mar 28, 2026, 2:30 PM"
 *   - Amount: formatted with currency
 * - Pagination: "Previous" / "Next" buttons, showing "Page X of Y"
 * - Loading skeleton while data is being fetched
 * - Empty state: "No transactions yet. Make your first deposit!"
 *
 * LOGIC REQUIREMENTS (Muditha):
 * - On mount: fetch balance (GET /api/accounts/me/balance) and
 *   transactions (GET /api/accounts/me/transactions?page=1&limit=10)
 * - Handle loading states for both requests
 * - Handle error states (show error message, retry button)
 * - Implement pagination (page state, fetch new page on button click)
 * - Auto-refresh balance after returning from deposit/withdraw pages
 *
 * TODO (Kasun): Design the dashboard layout, cards, and transaction table
 * TODO (Muditha): Fetch data from API, handle loading/error/empty states
 * TODO (Disaan): Confirm the response shapes match the types in ../types
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Transaction } from "../types";

export default function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState("LKR");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO (Muditha): Fetch balance and transactions from API
    // const fetchData = async () => {
    //   const balanceRes = await getBalance();
    //   setBalance(balanceRes.balance);
    //   setCurrency(balanceRes.currency);
    //   const txRes = await getTransactions(1, 10);
    //   setTransactions(txRes.transactions);
    //   setIsLoading(false);
    // };
    // fetchData();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      {/* TODO (Kasun): Style this dashboard */}
      <h1>Welcome, {user?.fullName}</h1>

      <div style={{ padding: "1rem", border: "1px solid #ccc", margin: "1rem 0" }}>
        <h2>Balance</h2>
        <p style={{ fontSize: "2rem" }}>
          {currency} {balance?.toLocaleString() ?? "0.00"}
        </p>
        <Link to="/deposit">Deposit</Link> | <Link to="/withdraw">Withdraw</Link>
      </div>

      <h2>Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet. Make your first deposit!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.balanceAfter}</td>
                <td>{tx.description ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
