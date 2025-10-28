import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme.bg.secondary}`}>
      <Header onSearch={handleSearch} userName="John Doe" notificationCount={5} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
