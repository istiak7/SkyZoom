import React, { useState } from 'react';
import { Menu, Settings, Home, LogOut, Plane } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  showRoutingConfig: boolean;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showRoutingConfig, user, onLogout }) => {
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
        <div className="flex items-center justify-between h-16">
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
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
              <div className="bg-pink-600 p-2 rounded-lg shadow-lg">
                <Plane className="text-white" size={20} />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-800">SkyZoom</span>
                <div className="text-xs text-gray-500">Welcome, {user?.username || 'User'}</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm font-medium"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;