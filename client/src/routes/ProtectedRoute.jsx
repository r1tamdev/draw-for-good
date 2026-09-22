import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}