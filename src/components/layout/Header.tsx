import React, { useState } from 'react';
import {
  Bell,
  User,
  ChevronDown,
  BarChart3,
  Home,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Search,
  Moon,
  Sun,
} from 'lucide-react';
import { Button, Badge, Input } from '@/components/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark, toggleTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('dashboard');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header
      className={`sticky top-0 z-50 ${theme.bg.card}/80 backdrop-blur-md border-b ${theme.border.primary} shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-bold ${theme.text.primary}`}>Sales Dashboard</h1>
              <p className={`text-xs ${theme.text.tertiary}`}>Analytics Platform</p>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeNav === item.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveNav(item.id)}
                  leftIcon={<IconComponent size={16} />}
                  className={activeNav === item.id ? 'bg-blue-50 text-blue-600' : ''}
                >
                  {item.label}
                </Button>
              );
            })}
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
                leftIcon={<Search size={16} className={theme.text.tertiary} />}
                className="w-64"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme.hover.bg} transition-colors`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell size={20} />
              </Button>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <Badge.Count count={notificationCount} variant="danger" />
                </div>
              )}
            </div>

            {/* ✅ User Menu - shadcn DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 p-2 rounded-lg ${theme.hover.bg} transition-colors`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
                    />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className={`hidden sm:block text-sm font-medium ${theme.text.primary}`}>
                    {userName}
                  </span>
                  <ChevronDown size={16} className={theme.text.tertiary} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;