export default function CharitySelector({
  charities,
  value,
  onChange,
}) {
  return (
    <select
      value={value || ''}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
    >
      <option value="" disabled>
        Select a charity
      </option>

      {charities.map((charity) => (
        <option
          key={charity.id}
          value={charity.id}
        >
          {charity.name}
        </option>
      ))}
    </select>
  );
}