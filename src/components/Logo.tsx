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
      {/* Shield silhouette – geometrically accurate heater-style */}
      <motion.path
        d="
          M256 64
          C256 64 275 64 287 72
          C299 80 306 92 306 108
          C306 124 306 144 304 168
          C302 216 290 264 270 312
          C260 336 248 356 236 376
          C224 396 212 412 200 424
          C188 436 176 444 164 448
          C152 452 140 456 128 456
          C116 456 104 452 92 448
          C80 444 68 436 56 424
          C44 412 32 396 20 376
          C8 356 4 336 2 312
          C0 264 0 216 2 168
          C4 144 4 124 4 108
          C4 92 11 80 23 72
          C35 64 54 64 256 64
          Z
        "
        fill="#FF7622"
        stroke="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Heart cut-out (negative space) */}
      <motion.path
        d="
          M256 320
          L206 275
          C186 257 184 228 202 210
          C216 196 238 196 252 210
          L256 214
          L260 210
          C274 196 296 196 310 210
          C328 228 326 257 306 275
          L256 320
          Z
        "
        fill="#FFFFFF"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
};