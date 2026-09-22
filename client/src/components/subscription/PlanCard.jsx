import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

export default function PlanCard({ plan, price, features, onSelect, selected }) {
  return (
    <Card className={selected ? 'border-emerald-500' : ''}>
      <h3 className="text-lg font-semibold text-white capitalize">{plan}</h3>
      <p className="text-2xl font-bold text-emerald-400 my-2">{price}</p>
      <ul className="text-neutral-400 text-sm mb-4 space-y-1">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <Button onClick={() => onSelect(plan)} className="w-full">
        Choose {plan}
      </Button>
    </Card>
  );
}