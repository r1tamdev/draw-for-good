import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Sidebar from '../../components/layout/Sidebar.jsx';

export default function AdminDashboard() {
  return (
    <DashboardLayout sidebar={<Sidebar />}>
      <Outlet />
    </DashboardLayout>
  );
}