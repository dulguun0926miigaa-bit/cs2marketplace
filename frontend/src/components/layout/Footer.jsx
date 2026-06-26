import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-cs2-card border-t border-cs2-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-cs2-accent font-bold text-lg">CS2</span>
          <span className="text-white font-semibold"> Дэлгүүр</span>
          <p className="text-gray-500 text-sm mt-1">CS2 skin-ээ аюулгүй авч, зарна.</p>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link to="/marketplace" className="hover:text-white">Дэлгүүр</Link>
          <Link to="/login" className="hover:text-white">Нэвтрэх</Link>
          <Link to="/register" className="hover:text-white">Бүртгүүлэх</Link>
        </div>
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Дөк, Ами, Чочироо 3ийн дэлгүүр.</p>
      </div>
    </footer>
  );
}
