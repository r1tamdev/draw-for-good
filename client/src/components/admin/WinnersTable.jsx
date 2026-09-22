import { useEffect, useState } from 'react';
import { getAllWinners, verifyWinner, markWinnerPaid } from '../../api/admin.js';
import Spinner from '../common/Spinner.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

export default function WinnersTable() {
  const [winners, setWinners] = useState(null);

  const refresh = async () => {
    const data = await getAllWinners();
    setWinners(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleVerify = async (id, status) => {
    await verifyWinner(id, status);
    refresh();
  };

  const handlePay = async (id) => {
    await markWinnerPaid(id);
    refresh();
  };

  if (!winners) return <Spinner />;

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-neutral-500 border-b border-neutral-800">
          <th className="py-2">Match</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Verification</th>
          <th className="py-2">Payment</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {winners.map((w) => (
          <tr key={w.id} className="border-b border-neutral-900">
            <td className="py-2 text-white">{w.match_type}-match</td>
            <td className="py-2 text-white">{w.amount}</td>
            <td className="py-2">
              <Badge status={w.verification_status} />
            </td>
            <td className="py-2">
              <Badge status={w.payment_status} />
            </td>
            <td className="py-2 flex gap-2">
              {w.verification_status === 'pending' && (
                <>
                  <Button variant="outline" onClick={() => handleVerify(w.id, 'approved')}>
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => handleVerify(w.id, 'rejected')}>
                    Reject
                  </Button>
                </>
              )}
              {w.verification_status === 'approved' && w.payment_status === 'pending' && (
                <Button onClick={() => handlePay(w.id)}>Mark paid</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}