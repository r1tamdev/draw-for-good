import { useEffect, useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription.js';
import SubscriptionStatus from '../../components/subscription/SubscriptionStatus.jsx';
import UpcomingDraw from '../../components/draws/UpcomingDraw.jsx';
import WinningsOverview from '../../components/winners/WinningsOverview.jsx';
import { getUpcomingDraw } from '../../api/draws.js';
import axiosInstance from '../../api/axiosInstance.js';

export default function Dashboard() {
  const { subscription } = useSubscription();
  const [draw, setDraw] = useState(null);
  const [winnings, setWinnings] = useState([]);

  useEffect(() => {
    getUpcomingDraw().then(setDraw).catch(() => setDraw(null));
    axiosInstance
      .get('/winners/mine')
      .then((res) => setWinnings(res.data))
      .catch(() => setWinnings([]));
  }, []);

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <SubscriptionStatus subscription={subscription} />
      <UpcomingDraw draw={draw} />
      <WinningsOverview winnings={winnings} />
    </div>
  );
}