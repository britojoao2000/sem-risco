import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, Package, MapPin, User, Sparkles, LogOut, ShieldCheck } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { Logo } from '../common/Logo';
import { useUser } from '../../context/UserContext';

const DESKTOP_NAV_ITEMS = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/scan', label: 'Escanear Rótulo', icon: Camera },
  { to: '/products', label: 'Buscar Produtos', icon: Package },
  { to: '/map', label: 'Locais Seguros', icon: MapPin },
  { to: '/profile', label: 'Meu Perfil', icon: User },
  { to: '/premium', label: 'Plano Premium', icon: Sparkles }
];

export const AppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const isScanPage = location.pathname === '/scan';
  const totalRestrictions = user.restrictions.length + user.customAllergens.length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-card/60 border-r border-border/40 p-6 min-h-screen sticky top-0 justify-between">
        <div className="space-y-8">
          <div className="px-2">
            <Logo size="md" showSubtitle clickable />
          </div>

          {/* Quick Action: Scan Button */}
          <button
            onClick={() => navigate('/scan')}
            className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-subtle hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span>Escanear Produto</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Menu Lateral">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-secondary text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{item.label}</span>
                      {item.to === '/premium' && user.plan !== 'premium' && (
                        <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          PRO
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Profile Card & Footer info */}
        <div className="space-y-4 pt-6 border-t border-border/40">
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
              {user.avatarInitials || user.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {totalRestrictions} {totalRestrictions === 1 ? 'restrição' : 'restrições'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacidade Local</span>
            </span>
            <button
              onClick={logout}
              title="Encerrar Sessão"
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className={`flex-1 pb-20 md:pb-8 ${isScanPage ? 'p-0' : 'px-4 sm:px-6 lg:px-8 py-4 sm:py-6'}`}>
          <div className="max-w-4xl mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavBar />
      </div>
    </div>
  );
};
