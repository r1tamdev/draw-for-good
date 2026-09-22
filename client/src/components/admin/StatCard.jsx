import Card from '../common/Card.jsx';

export default function StatCard({ label, value }) {
  return (
    <Card>
      <p className="text-neutral-500 text-xs">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </Card>
  );
}