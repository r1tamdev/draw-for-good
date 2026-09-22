import CharityCard from './CharityCard.jsx';

export default function CharitySpotlight({ charities }) {
  const spotlighted = charities.filter((c) => c.is_spotlighted);

  if (!spotlighted.length) return null;

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold text-white mb-4">Featured charities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {spotlighted.map((c) => (
          <CharityCard key={c.id} charity={c} />
        ))}
      </div>
    </section>
  );
}