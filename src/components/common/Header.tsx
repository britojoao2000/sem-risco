import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Logo } from './Logo';
import { useUser } from '../../context/UserContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  backTo,
  rightAction
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const activeRestrictionsCount = user.restrictions.length + user.customAllergens.length;

  return (
    <header className="sticky top-0 z-30 w-full bg-background/85 backdrop-blur-md transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button
              onClick={handleBack}
              aria-label="Voltar"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground hover:bg-muted/70 active:scale-95 transition-all -ml-1.5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <Logo size="sm" clickable />
          )}

          {title && (
            <div className="flex flex-col">
              <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {rightAction ? (
            rightAction
          ) : (
            <>
              {/* Active restrictions pill button */}
              <button
                onClick={() => navigate('/profile')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                title="Configurar restrições"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>
                  {activeRestrictionsCount}{' '}
                  {activeRestrictionsCount === 1 ? 'restrição ativa' : 'restrições ativas'}
                </span>
              </button>

              {/* Plan pill */}
              {user.plan === 'premium' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Premium</span>
                </span>
              ) : (
                <button
                  onClick={() => navigate('/premium')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="hidden xs:inline">Upgrade</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
