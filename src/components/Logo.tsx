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
      xmlns="http://www.w3.org/2000/svg "
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Shield Base - Heater shield with rounded top apex, filleted corners, parabolic sides, acute bottom point */}
      <motion.path
        d="M256 100 
           C260 98, 264 96, 268 96
           L344 96
           Q364 96, 376 108
           L380 112
           Q384 118, 384 130
           L384 240
           Q384 300, 368 352
           Q352 404, 320 440
           Q288 476, 256 492
           Q224 476, 192 440
           Q160 404, 144 352
           Q128 300, 128 240
           L128 130
           Q128 118, 132 112
           L136 108
           Q148 96, 168 96
           L244 96
           C248 96, 252 98, 256 100
           Z"
        fill="#FF7622"
        stroke="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {/* Heart Cutout (white negative space) - centered within shield */}
      <motion.path
        d="M256 320 L206 275 C186 257, 184 228, 202 210 C216 196, 238 196, 252 210 L256 214 L260 210 C274 196, 296 196, 310 210 C328 228, 326 257, 306 275 L256 320 Z"
        fill="#FFFFFF"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
};