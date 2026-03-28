/**
 * Shared Layout Component
 * OWNER: Kasun (UI/UX Designer), Muditha (logic)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This component provides the shared layout for all protected pages.
 * It includes a header with navigation and a main content area.
 *
 * DESIGN REQUIREMENTS (Kasun):
 * - Header: App name "Banking System", nav links (Dashboard, Deposit, Withdraw), Logout button
 * - Show logged-in user's name in the header (from AuthContext)
 * - Responsive design: hamburger menu on mobile
 * - Main content area renders child routes via <Outlet />
 * - Footer (optional): copyright, version info
 *
 * IMPLEMENTATION (Muditha):
 * - Use useAuth() to get user data and logout function
 * - Use <NavLink> from react-router-dom for active link styling
 * - Call logout() on Logout button click
 *
 * TODO (Kasun): Design and style this layout — colors, spacing, typography
 * TODO (Muditha): Wire up navigation and logout logic
 */
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div>
      {/* TODO (Kasun): Style this header */}
      <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <nav>
          <strong>Banking System</strong>
          {" | "}
          <Link to="/dashboard">Dashboard</Link>
          {" | "}
          <Link to="/deposit">Deposit</Link>
          {" | "}
          <Link to="/withdraw">Withdraw</Link>
          {" | "}
          <span>Welcome, {user?.fullName}</span>
          {" | "}
          <button onClick={() => logout()}>Logout</button>
        </nav>
      </header>

      {/* Page content rendered here */}
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
