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
      initial="hidden"
      animate="visible"
    >
      {/* SHIELD LAYER 
        Shape: Heater Shield with rounded top corners and acute bottom tip
      */}
      <motion.path
        d="M256 472C256 472 448 384 448 136C448 96 448 80 448 64C448 46.3 433.7 32 416 32H96C78.3 32 64 46.3 64 64C64 80 64 96 64 136C64 384 256 472 256 472Z"
        fill="#FF7622"
        stroke="none"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1, 
            transition: { duration: 0.5, ease: "easeOut" } 
          }
        }}
      />

      {/* HEART LAYER 
        Shape: Geometric heart centered on the shield
      */}
      <motion.path
        d="M256 320.6L235.6 302C163.2 236.4 115.4 193.2 115.4 140.2C115.4 97 149.4 63 192.6 63C217 63 240.4 74.4 256 92.6C271.6 74.4 295 63 319.4 63C362.6 63 396.6 97 396.6 140.2C396.6 193.2 348.8 236.4 276.4 302L256 320.6Z"
        fill="#FFFFFF"
        // We center the heart path relative to the viewbox 
        // (The path above is native to ~512, but we shift it down slightly to optical center)
        style={{ transformOrigin: "center", translateY: 40 }} 
        variants={{
          hidden: { scale: 0, opacity: 0 },
          visible: { 
            scale: 1, 
            opacity: 1, 
            transition: { delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 } 
          }
        }}
      />
    </motion.svg>
  );
};