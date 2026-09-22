import { useState } from 'react';
import UserTable from '../../components/admin/UserTable.jsx';
import UserEditModal from '../../components/admin/UserEditModal.jsx';

export default function UserManagement() {
  const [editingUser, setEditingUser] = useState(null);

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Users</h1>
      <UserTable onEdit={setEditingUser} />
      <UserEditModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={() => {}}
      />
    </div>
  );
}