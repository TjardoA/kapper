import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { loading, user, isAdmin } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Laden...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
}
