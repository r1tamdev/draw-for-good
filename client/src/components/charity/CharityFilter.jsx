import Input from '../common/Input.jsx';

export default function CharityFilter({ value, onChange }) {
  return (
    <Input
      placeholder="Search charities..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}