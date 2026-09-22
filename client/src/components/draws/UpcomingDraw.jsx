import Card from '../common/Card.jsx';

export default function UpcomingDraw({ draw }) {
  if (!draw) {
    return (
      <Card>
        <p className="text-neutral-400">No upcoming draw scheduled.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-white font-semibold mb-1">Next draw</h3>
      <p className="text-neutral-400 text-sm">
        {new Date(draw.draw_month).toLocaleDateString()} — {draw.mode} mode
      </p>
    </Card>
  );
}