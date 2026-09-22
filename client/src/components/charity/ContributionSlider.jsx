export default function ContributionSlider({ value, onChange, min = 10, max = 100 }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-neutral-300">
        Contribution: {value}%
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-emerald-500"
      />
    </div>
  );
}