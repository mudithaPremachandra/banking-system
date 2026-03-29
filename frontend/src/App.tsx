/**
 * Main Application Router
 * OWNER: Muditha (Frontend Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This file defines all routes for the banking SPA. Implement the following:
 *
 * 1. PUBLIC ROUTES (accessible without authentication):
 *    - /login      → <Login />       — Email + password login form
 *    - /register   → <Register />    — New user registration form
 *    - /otp        → <OTPEntry />    — 6-digit OTP verification after login
 *
 * 2. PROTECTED ROUTES (require valid JWT in AuthContext):
 *    - /dashboard  → <Dashboard />   — Shows balance, recent transactions
 *    - /deposit    → <Deposit />     — Deposit money form
 *    - /withdraw   → <Withdraw />    — Withdraw money form
 *
 * 3. REDIRECT LOGIC:
 *    - "/" redirects to /dashboard if authenticated, /login if not
 *    - Any unknown route redirects to /dashboard or /login
 *
 * 4. Use the <ProtectedRoute /> wrapper component for protected routes.
 *    It checks AuthContext.isAuthenticated and redirects to /login if false.
 *
 * TODO (Muditha):
 * - Import all page components from ./pages/
 * - Import ProtectedRoute from ./components/ProtectedRoute
 * - Set up Routes with proper nesting
 * - Optionally wrap protected routes in a <Layout /> component for shared nav
 */
// TODO (Muditha): Uncomment these imports as you implement each route
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import OTPEntry from "./pages/OTPEntry";
// import Dashboard from "./pages/Dashboard";
// import Deposit from "./pages/Deposit";
// import Withdraw from "./pages/Withdraw";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Layout from "./components/Layout";

function App() {
  // TODO (Muditha): Implement routing logic as described above
  // Example structure:
  //
  // <Routes>
  //   {/* Public routes */}
  //   <Route path="/login" element={<Login />} />
  //   <Route path="/otp" element={<OTPEntry />} />
  //
  //   {/* Protected routes wrapped in Layout */}
  //   <Route element={<ProtectedRoute />}>
  //     <Route element={<Layout />}>
  //       <Route path="/dashboard" element={<Dashboard />} />
  //       <Route path="/deposit" element={<Deposit />} />
  //       <Route path="/withdraw" element={<Withdraw />} />
  //     </Route>
  //   </Route>
  //
  //   {/* Catch-all redirect */}
  //   <Route path="*" element={<Navigate to="/login" replace />} />
  // </Routes>

  return (
    <div>
      <h1>Banking System — Scaffold</h1>
      <p>TODO: Implement routing (see comments in this file)</p>
    </div>
  );
}

export default App;
