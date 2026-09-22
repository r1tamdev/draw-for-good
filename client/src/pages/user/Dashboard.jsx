import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';

export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    let mounted = true;

    axiosInstance
      .get('/dashboard')
      .then((res) => {
        if (mounted) {
          setDashboard(res.data);
          setError('');
        }
      })
      .catch((err) => {
        console.error(
          'Dashboard error:',
          err,
        );

        if (mounted) {
          setError(
            err.response?.data?.error ||
              'Unable to load dashboard.',
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <p className="text-neutral-400">
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="px-6 py-10 max-w-6xl mx-auto">
        <Card>
          <p className="text-red-400">
            {error ||
              'Unable to load dashboard.'}
          </p>
        </Card>
      </div>
    );
  }

  const subscription =
    dashboard.subscription;

  const scores =
    dashboard.scores || [];

  const charity =
    dashboard.charity;

  const upcomingDraw =
    dashboard.participation
      ?.upcomingDraw || null;

  const drawsEntered =
    dashboard.participation
      ?.drawsEntered || 0;

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-neutral-400 mt-1">
          Track your golf performance,
          charity impact and draw
          participation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <h2 className="text-white font-semibold mb-3">
            Subscription
          </h2>

          {subscription?.status ===
          'active' ? (
            <>
              <p className="text-emerald-400 text-lg font-semibold">
                Active
              </p>

              <p className="text-neutral-400 text-sm mt-1 capitalize">
                {subscription.plan} plan
              </p>

              <p className="text-neutral-500 text-sm mt-1">
                Renews:{' '}
                {subscription.current_period_end
                  ? new Date(
                      subscription.current_period_end,
                    ).toLocaleDateString()
                  : 'N/A'}
              </p>

              <Link
                to="/subscribe"
                className="inline-block mt-4"
              >
                <Button variant="outline">
                  Manage subscription
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-neutral-400">
                No active subscription.
              </p>

              <Link
                to="/subscribe"
                className="inline-block mt-4"
              >
                <Button>
                  Subscribe
                </Button>
              </Link>
            </>
          )}
        </Card>

        <Card>
          <h2 className="text-white font-semibold mb-3">
            Next draw
          </h2>

          {upcomingDraw ? (
            <>
              <p className="text-white">
                {new Date(
                  upcomingDraw.draw_month,
                ).toLocaleDateString()}
              </p>

              <p className="text-neutral-400 text-sm mt-1 capitalize">
                {upcomingDraw.mode} mode
              </p>
            </>
          ) : (
            <p className="text-neutral-400">
              No upcoming draw scheduled.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="text-white font-semibold mb-3">
            Winnings
          </h2>

          <p className="text-emerald-400 text-3xl font-bold">
            $
            {Number(
              dashboard.totalWon || 0,
            ).toFixed(2)}
          </p>

          <p className="text-neutral-400 text-sm mt-2">
            Paid: $
            {Number(
              dashboard.paidWinnings || 0,
            ).toFixed(2)}
          </p>

          <p className="text-neutral-400 text-sm">
            Pending: $
            {Number(
              dashboard.pendingWinnings || 0,
            ).toFixed(2)}
          </p>

          <Link
            to="/winnings"
            className="inline-block mt-4"
          >
            <Button variant="outline">
              View winnings
            </Button>
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <div className="flex items-center justify-between mb-4 gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                My golf scores
              </h2>

              <p className="text-neutral-400 text-sm mt-1">
                Your latest 5 Stableford scores
              </p>
            </div>

            <Link to="/scores">
              <Button variant="outline">
                Manage
              </Button>
            </Link>
          </div>

          {scores.length === 0 ? (
            <div>
              <p className="text-neutral-400">
                No scores added yet.
              </p>

              <Link
                to="/scores"
                className="inline-block mt-4"
              >
                <Button>
                  Add score
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score) => (
                <div
                  key={score.id}
                  className="flex items-center justify-between border-b border-neutral-800 pb-3"
                >
                  <div>
                    <p className="text-white font-medium">
                      {score.score} points
                    </p>

                    <p className="text-neutral-500 text-sm">
                      {new Date(
                        score.score_date,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">
            Your charity
          </h2>

          {charity ? (
            <div className="flex gap-4 items-center">

              {charity.image_url ? (
                <img
                  src={charity.image_url}
                  alt={charity.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-neutral-800" />
              )}

              <div>
                <p className="text-white font-medium">
                  {charity.name}
                </p>

                <p className="text-neutral-400 text-sm mt-1">
                  Your selected charity
                </p>
              </div>

            </div>
          ) : (
            <>
              <p className="text-neutral-400">
                No charity selected.
              </p>

              <Link
                to="/charities"
                className="inline-block mt-4"
              >
                <Button>
                  Choose a charity
                </Button>
              </Link>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">
            Draw participation
          </h2>

          <p className="text-neutral-400">
            Draws entered
          </p>

          <p className="text-3xl font-bold text-white mt-1">
            {drawsEntered}
          </p>

          {subscription?.status !==
            'active' && (
            <p className="text-neutral-500 text-sm mt-3">
              Subscribe to participate
              in draws.
            </p>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent winnings
          </h2>

          {dashboard.winnings?.length ? (
            <div className="space-y-3">
              {dashboard.winnings
                .slice(0, 5)
                .map((winner) => (
                  <div
                    key={winner.id}
                    className="flex items-center justify-between border-b border-neutral-800 pb-3"
                  >
                    <p className="text-white">
                      {winner.match_type}-match
                    </p>

                    <div className="text-right">
                      <p className="text-white">
                        $
                        {Number(
                          winner.amount || 0,
                        ).toFixed(2)}
                      </p>

                      <p className="text-neutral-500 text-sm capitalize">
                        {winner.payment_status ||
                          'pending'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-neutral-400">
              No winnings yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}