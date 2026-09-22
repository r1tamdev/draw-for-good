import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function UserEditModal({ open, user, onClose, onSave }) {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('subscriber');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setRole(user.role || 'subscriber');
    }
  }, [user]);

  const handleSave = async () => {
    await onSave(user.id, { full_name: fullName, role });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit user">
      <div className="flex flex-col gap-4">
        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
          >
            <option value="subscriber">Subscriber</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  );
}