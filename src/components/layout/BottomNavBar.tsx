import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Camera, Package, MapPin, User } from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  isPrimary?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/scan', label: 'Escanear', icon: Camera, isPrimary: true },
  { to: '/products', label: 'Produtos', icon: Package },
  { to: '/map', label: 'Locais', icon: MapPin },
  { to: '/profile', label: 'Perfil', icon: User }
];

export const BottomNavBar: React.FC = () => {
  return (
    <nav
      aria-label="Navegação Principal"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border/40 shadow-soft pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -mt-4 group relative`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-card transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground scale-105 shadow-elevated'
                          : 'bg-primary/95 text-primary-foreground hover:bg-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold mt-1 transition-colors ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative p-1">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium tracking-tight mt-0.5">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
