import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 80, className = '' }: LogoProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Shield Background */}
      <motion.path
        d="M50 5 L85 20 L85 50 Q85 80 50 95 Q15 80 15 50 L15 20 Z"
        fill="hsl(var(--primary))"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      
      {/* Heart */}
      <motion.path
        d="M50 75 Q30 55 30 45 Q30 35 37.5 35 Q45 35 50 42 Q55 35 62.5 35 Q70 35 70 45 Q70 55 50 75 Z"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  );
};
