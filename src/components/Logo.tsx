import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 80, className = "" }: LogoProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Shield Base */}
      <motion.path
        d="M256 32L64 96v128c0 141.4 93.1 259.9 192 288 98.9-28.1 192-146.6 192-288V96L256 32z"
        fill="#FF7622"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Heart Cutout (white negative space) */}
      <motion.path
        d="M256 344l-88-80c-28-26-32-72-4-100 22-22 58-22 80 0l12 12 12-12c22-22 58-22 80 0 28 28 24 74-4 100l-88 80z"
        fill="#FFFFFF"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
};
