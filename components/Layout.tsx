
import React from 'react';
import { Bell, User, LayoutDashboard, History } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, showNav = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, path: '/dashboard', label: 'Dashboard' },
    { icon: History, path: '/history', label: 'History' },
    { icon: User, path: '/profile', label: 'Profile' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <h1 className="font-bold text-lg tracking-tight text-gray-800">
            {title || 'Pureingo'}
          </h1>
        </div>
        <button className="p-2 bg-gray-50 rounded-full relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 safe-area-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center space-y-1 ${isActive ? 'text-green-600' : 'text-gray-400'}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};
