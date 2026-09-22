import { useEffect, useState } from 'react';
import { getReports } from '../../api/admin.js';
import StatCard from './StatCard.jsx';
import Spinner from '../common/Spinner.jsx';

export default function ReportsPanel() {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    getReports().then(setReports);
  }, []);

  if (!reports) return <Spinner />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total users" value={reports.totalUsers} />
      <StatCard label="Total prize pool" value={reports.totalPool} />
      <StatCard label="Avg charity %" value={reports.avgCharityContributionPct.toFixed(1)} />
      <StatCard label="Draws run" value={reports.totalDraws} />
    </div>
  );
}