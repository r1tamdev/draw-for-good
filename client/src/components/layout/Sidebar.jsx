import { Link } from 'react-router-dom';

const links = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/draws', label: 'Draws' },
  { to: '/admin/charities', label: 'Charities' },
  { to: '/admin/winners', label: 'Winners' },
  { to: '/admin/reports', label: 'Reports' },
];

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-2">
      {links.map((l) => (
        <Link key={l.to} to={l.to} className="text-neutral-300 hover:text-white">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}