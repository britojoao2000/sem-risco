import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';
import { SafetyStatus } from '../../types/dietary';

interface SafetyBadgeProps {
  status: SafetyStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const SafetyBadge: React.FC<SafetyBadgeProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const configs = {
    safe: {
      defaultLabel: 'Seguro para você',
      bgClass: 'bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
      dotClass: 'bg-emerald-600',
      icon: ShieldCheck
    },
    caution: {
      defaultLabel: 'Atenção / Traços',
      bgClass: 'bg-amber-50/90 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
      dotClass: 'bg-amber-600',
      icon: AlertTriangle
    },
    danger: {
      defaultLabel: 'Risco Detectado',
      bgClass: 'bg-rose-50/90 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
      dotClass: 'bg-rose-600',
      icon: AlertCircle
    }
  };

  const current = configs[status];
  const IconComponent = current.icon;
  const displayLabel = label || current.defaultLabel;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold rounded-xl'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center select-none shrink-0 ${current.bgClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <IconComponent className={`${iconSizes[size]} shrink-0`} />}
      <span>{displayLabel}</span>
    </span>
  );
};
