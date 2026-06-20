import { BookOpen, BarChart3, Plus } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

interface HeaderProps {
  onAddBook: () => void;
}

export default function Header({ onAddBook }: HeaderProps) {
  const location = useLocation();
  const isStatsPage = location.pathname === '/statistics';

  return (
    <header className="sticky top-0 z-50 glass border-b border-brown-100 animate-fade-in-down">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brown-500 to-brown-700 rounded-xl flex items-center justify-center shadow-soft">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-brown-800">
                我的书架
              </h1>
              <p className="text-xs text-brown-500">个人图书管理工具</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-brown-600 text-white shadow-soft'
                    : 'text-brown-700 hover:bg-brown-100'
                }`
              }
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">图书列表</span>
            </NavLink>

            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-brown-600 text-white shadow-soft'
                    : 'text-brown-700 hover:bg-brown-100'
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">阅读统计</span>
            </NavLink>

            {!isStatsPage && (
              <button
                onClick={onAddBook}
                className="btn-primary flex items-center gap-2 ml-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">添加图书</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
