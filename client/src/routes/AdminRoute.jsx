import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}