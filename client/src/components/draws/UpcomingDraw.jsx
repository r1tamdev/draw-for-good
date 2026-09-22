import Card from '../common/Card.jsx';

export default function UpcomingDraw({
  draw,
}) {
  const today = new Date();

  today.setHours(
    0,
    0,
    0,
    0,
  );

  const drawDate = draw?.draw_month
    ? new Date(draw.draw_month)
    : null;

  const isUpcoming =
    drawDate &&
    !Number.isNaN(
      drawDate.getTime(),
    ) &&
    drawDate >= today;

  if (!isUpcoming) {
    return (
      <Card>
        <h3 className="text-white font-semibold mb-1">
          Next draw
        </h3>

        <p className="text-neutral-400 text-sm">
          No upcoming draw scheduled.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-white font-semibold mb-1">
        Next draw
      </h3>

      <p className="text-neutral-400 text-sm">
        {drawDate.toLocaleDateString()} —{' '}
        {draw.mode} mode
      </p>
    </Card>
  );
}