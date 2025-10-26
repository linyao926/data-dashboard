import React, { useState } from 'react';
import { Button, Badge, Input } from '@/components/common';

interface HeaderProps {
  onSearch?: (query: string) => void;
  userName?: string;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  userName = 'Admin User',
  notificationCount = 3,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Sales Dashboard</h1>
              <p className="text-xs text-gray-500">Analytics Platform</p>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeNav === item.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveNav(item.id)}
                leftIcon={<span>{item.icon}</span>}
                className={activeNav === item.id ? 'bg-blue-50 text-blue-600' : ''}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex items-center">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                leftIcon={<span className="text-gray-400">🔍</span>}
                className="w-64 bg-gray-50"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm">
                <span className="text-xl">🔔</span>
              </Button>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <Badge.Count count={notificationCount} variant="danger" />
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                leftIcon={
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                }
                rightIcon={
                  <span className="text-gray-400 text-xs">{isUserMenuOpen ? '▲' : '▼'}</span>
                }
              >
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userName}
                </span>
              </Button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-slide-down">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    👤 Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    ⚙️ Settings
                  </a>
                  <a
                    href="#help"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    ❓ Help
                  </a>
                  <hr className="my-1 border-gray-200" />
                  <a
                    href="#logout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🚪 Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
