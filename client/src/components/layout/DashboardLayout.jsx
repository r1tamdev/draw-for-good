export default function DashboardLayout({ sidebar, children }) {
  return (
    <div className="flex min-h-[calc(100vh-140px)]">
      {sidebar && (
        <aside className="w-56 border-r border-neutral-800 p-4">{sidebar}</aside>
      )}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}