import React from 'react';
import { Shield, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  clickable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  clickable = false
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold'
  };

  const content = (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`${iconSizes[size]} rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-subtle shrink-0`}>
        <div className="relative flex items-center justify-center">
          <Shield className="w-4/5 h-4/5 stroke-[2.2]" />
          <Check className="absolute w-2/5 h-2/5 stroke-[3] -bottom-0.5" />
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`${textSizes[size]} tracking-tight text-foreground leading-tight`}>
          Sem Risco
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-muted-foreground tracking-normal">
            Alimentação Segura & Consciente
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
