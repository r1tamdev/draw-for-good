import { useEffect, useState } from 'react';
import { getUsers, updateUser } from '../../api/admin.js';
import Spinner from '../common/Spinner.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import UserEditModal from './UserEditModal.jsx';

export default function UserTable() {
  const [users, setUsers] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const refresh = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSave = async (id, payload) => {
    await updateUser(id, payload);
    refresh();
  };

  if (!users) return <Spinner />;

  return (
    <>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-neutral-500 border-b border-neutral-800">
            <th className="py-2">Name</th>
            <th className="py-2">Role</th>
            <th className="py-2">Joined</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-neutral-900">
              <td className="py-2 text-white">{u.full_name}</td>
              <td className="py-2">
                <Badge status={u.role} />
              </td>
              <td className="py-2 text-neutral-400">
                {new Date(u.created_at).toLocaleDateString()}
              </td>
              <td className="py-2">
                <Button variant="outline" onClick={() => setEditingUser(u)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserEditModal
        open={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
    </>
  );
}