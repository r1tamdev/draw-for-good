import { Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home.jsx';
import CharityDirectory from '../pages/public/CharityDirectory.jsx';
import CharityDetail from '../pages/public/CharityDetail.jsx';
import Login from '../pages/auth/Login.jsx';
import Signup from '../pages/auth/Signup.jsx';
import Dashboard from '../pages/user/Dashboard.jsx';
import Scores from '../pages/user/Scores.jsx';
import Subscription from '../pages/user/Subscription.jsx';
import Winnings from '../pages/user/Winnings.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import UserManagement from '../pages/admin/UserManagement.jsx';
import DrawManagement from '../pages/admin/DrawManagement.jsx';
import CharityManagement from '../pages/admin/CharityManagement.jsx';
import WinnerManagement from '../pages/admin/WinnerManagement.jsx';
import Reports from '../pages/admin/Reports.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/charities" element={<CharityDirectory />} />
      <Route path="/charities/:id" element={<CharityDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scores"
        element={
          <ProtectedRoute>
            <Scores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscribe"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/winnings"
        element={
          <ProtectedRoute>
            <Winnings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      >
        <Route path="users" element={<UserManagement />} />
        <Route path="draws" element={<DrawManagement />} />
        <Route path="charities" element={<CharityManagement />} />
        <Route path="winners" element={<WinnerManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}