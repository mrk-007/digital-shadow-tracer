// frontend/src/components/Loader.jsx
import { motion } from 'framer-motion';
export default function Loader(){ 
  return (
    <div className="flex items-center justify-center py-2">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-10 h-10 border-4 border-t-transparent rounded-full border-cyan-400"
      />
    </div>
  );
}
