import { Home, History, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/app/home', icon: Home, label: 'Home' },
    { path: '/app/history', icon: History, label: 'Histórico' },
    { path: '/app/profile', icon: User, label: 'Perfil' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                className={cn(
                  'flex flex-col items-center gap-1',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  className="absolute top-0 left-1/2 w-12 h-1 bg-primary rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ x: '-50%' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
