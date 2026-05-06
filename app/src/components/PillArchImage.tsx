import { motion } from "framer-motion";

interface PillArchImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export default function PillArchImage({ src, alt, className = "", aspectRatio = "1 / 1.3" }: PillArchImageProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-pill border border-borderMuted ${className}`}
      style={{ aspectRatio }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.div>
  );
}
