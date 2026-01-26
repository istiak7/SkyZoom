import React, { useState } from 'react';
import { Menu, Settings, Home } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  showRoutingConfig: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showRoutingConfig }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200);
  };

  const handleMenuBarClick = () => {
    if (showRoutingConfig) {
      onMenuClick();
    }
  };

  const handleLogoClick = () => {
    if (showRoutingConfig) {
      onMenuClick();
    }
  };

  const handleRoutingConfigClick = () => {
    setShowMenu(false);
    if (!showRoutingConfig) {
      onMenuClick();
    }
  };

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-sm fixed top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-4">
            <div className="relative"
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>
              <button
                onClick={handleMenuBarClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Menu"
              >
                <Menu size={28} className="text-gray-700" />
              </button>
              
              {showMenu && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 w-48 z-50">
                  <button
                    onClick={handleRoutingConfigClick}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 group"
                  >
                    <Settings size={16} className="text-gray-500 group-hover:text-red-600" />
                    Routing Config
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center transform rotate-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">FareComparison</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;