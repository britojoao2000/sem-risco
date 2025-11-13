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
      {/* Shield Background*/}
      <motion.path
        d="M15 25 Q50 10 85 25 V45 Q85 80 50 95 Q15 80 15 45 Z"
        fill="#FF7622" // Specific orange color from the "Sem Risco" branding
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      />
      
      {/* Heart*/}
      <motion.path
        d="M50 72 C30 55 25 40 38 32 C44 28 50 35 50 35 C50 35 56 28 62 32 C75 40 70 55 50 72 Z"
        fill="white"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  );
};