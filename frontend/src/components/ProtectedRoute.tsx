/**
 * Protected Route Wrapper
 * OWNER: Muditha (Frontend Developer)
 *
 * INSTRUCTIONS FOR AI AGENT:
 * This component wraps protected routes. It checks if the user is authenticated
 * via AuthContext. If not authenticated, it redirects to /login.
 *
 * IMPLEMENTATION:
 * - Use useAuth() to get isAuthenticated and isLoading
 * - If isLoading, show a loading spinner (coordinate with Kasun for design)
 * - If !isAuthenticated, return <Navigate to="/login" replace />
 * - If authenticated, render <Outlet /> (child routes)
 *
 * TODO (Muditha): Implement the logic
 * TODO (Kasun): Style the loading spinner
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // TODO (Kasun): Replace with a styled loading spinner
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
