import { useEffect, useState } from 'react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function UserEditModal({
  open,
  user,
  onClose,
  onSave,
}) {
  const [fullName, setFullName] =
    useState('');

  const [role, setRole] =
    useState('subscriber');

  const [plan, setPlan] =
    useState('monthly');

  const [status, setStatus] =
    useState('inactive');

  const [periodEnd, setPeriodEnd] =
    useState('');

  const [contribution, setContribution] =
    useState(10);

  useEffect(() => {
    if (!user) return;

    setFullName(
      user.full_name || '',
    );

    setRole(
      user.role || 'subscriber',
    );

    const subscription =
      [...(user.subscriptions || [])]
        .sort(
          (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at),
        )[0];

    setPlan(
      subscription?.plan ||
        'monthly',
    );

    setStatus(
      subscription?.status ||
        'inactive',
    );

    setPeriodEnd(
      subscription?.current_period_end
        ? subscription.current_period_end.slice(
            0,
            10,
          )
        : '',
    );
  }, [user]);

  const handleSave = async () => {
    await onSave(
      user.id,
      {
        full_name: fullName,
        role,
      },
      {
        plan,
        status,
        current_period_end:
          periodEnd || null,
        cancel_at_period_end: false,
      },
    );

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit user"
    >
      <div className="flex flex-col gap-4">

        <Input
          label="Full name"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">
            Role
          </label>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
          >
            <option value="subscriber">
              Subscriber
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">
            Subscription plan
          </label>

          <select
            value={plan}
            onChange={(event) =>
              setPlan(event.target.value)
            }
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
          >
            <option value="monthly">
              Monthly
            </option>

            <option value="yearly">
              Yearly
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">
            Subscription status
          </label>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

            <option value="cancelled">
              Cancelled
            </option>

            <option value="lapsed">
              Lapsed
            </option>
          </select>
        </div>

        <Input
          label="Renewal date"
          type="date"
          value={periodEnd}
          onChange={(event) =>
            setPeriodEnd(
              event.target.value,
            )
          }
        />

        <Input
          label="Charity contribution %"
          type="number"
          min={10}
          max={100}
          value={contribution}
          onChange={(event) =>
            setContribution(
              event.target.value,
            )
          }
        />

        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </Modal>
  );
}