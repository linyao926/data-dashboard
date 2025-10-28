import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer className={`mt-auto ${theme.bg.card} ${theme.border.primary} border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <span className={`text-xl font-bold ${theme.text.primary}`}>SalesPro</span>
            </div>
            <p className={`${theme.text.secondary} text-sm mb-4 max-w-md`}>
              Your comprehensive sales management solution. Track, analyze, and optimize your sales
              performance with powerful analytics and insights.
            </p>
            <div className={`space-y-2 text-sm ${theme.text.tertiary}`}>
              <p className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:contact@salespro.com"
                  className={`${theme.hover.text} transition-colors`}
                >
                  contact@salespro.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+15551234567" className={`${theme.hover.text} transition-colors`}>
                  +1 (555) 123-4567
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Business St, San Francisco, CA 94105</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className={`font-semibold ${theme.text.primary} mb-4`}>Quick Links</h3>
            <ul className={`space-y-2 text-sm ${theme.text.secondary}`}>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Analytics
                </a>
              </li>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Reports
                </a>
              </li>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className={`font-semibold ${theme.text.primary} mb-4`}>Resources</h3>
            <ul className={`space-y-2 text-sm ${theme.text.secondary}`}>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Support
                </a>
              </li>
              <li>
                <a href="#" className={`${theme.hover.text} transition-colors`}>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-8 pt-8 ${theme.border.primary} border-t flex flex-col sm:flex-row justify-between items-center gap-4`}
        >
          <p className={`text-sm ${theme.text.tertiary}`}>© 2025 linyao926</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className={`${theme.text.tertiary} ${theme.hover.text} transition-colors`}>
              Terms of Service
            </a>
            <a href="#" className={`${theme.text.tertiary} ${theme.hover.text} transition-colors`}>
              Privacy
            </a>
            <a href="#" className={`${theme.text.tertiary} ${theme.hover.text} transition-colors`}>
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;