export default function Footer() {
  return (
    <footer className="px-6 py-6 border-t border-neutral-800 text-neutral-500 text-sm text-center">
      DrawForGood © {new Date().getFullYear()}
    </footer>
  );
}