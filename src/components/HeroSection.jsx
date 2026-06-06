import { motion } from 'framer-motion';
import { Shield, Zap, Users, BadgeCheck, ChevronDown } from 'lucide-react';

const features = [
  { icon: Shield, label: 'Secure Data Collection', color: 'electric' },
  { icon: Zap, label: 'Quick Registration', color: 'cyan' },
  { icon: Users, label: 'Employee & Intern Friendly', color: 'electric' },
  { icon: BadgeCheck, label: 'HR Verified Process', color: 'cyan' },
];

export default function HeroSection({ onStart }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Logo / Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-electric-500 to-cyan-500 opacity-20 blur-md" />
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-electric-600 to-cyan-600 flex items-center justify-center border border-electric-400/30 shadow-glow">
            <span className="text-white font-display font-black text-lg">U</span>
          </div>
        </div>
        <div className="text-left">
          <p className="text-white font-display font-bold text-lg leading-tight">UNAI Tech</p>
          <p className="text-white/40 text-[10px] font-medium tracking-widest uppercase">Employee Portal</p>
        </div>
      </motion.div>

      {/* Main headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="max-w-3xl mb-6"
      >
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-tight mb-4">
          <span className="text-white">Welcome</span>
          <br />
          <span className="gradient-text">to the Team</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-xl mx-auto">
          Complete your onboarding process and help us build the future together.
        </p>
      </motion.div>

      {/* Feature chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-3 mb-10"
      >
        {features.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              border backdrop-blur-sm
              ${color === 'electric'
                ? 'bg-electric-500/10 border-electric-500/25 text-electric-300'
                : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300'
              }
            `}
          >
            <Icon size={14} />
            {label}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="relative px-10 py-4 rounded-2xl text-white font-display font-bold text-lg overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #0d82ff 0%, #00a3cd 100%)',
            boxShadow: '0 8px 32px rgba(13,130,255,0.4)',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Begin Onboarding
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >→</motion.span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
        </motion.button>

        <p className="text-white/30 text-sm">Takes approximately 8–10 minutes</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 grid grid-cols-3 gap-8 text-center"
      >
        {[
          { value: '10', label: 'Easy Steps', suffix: '' },
          { value: '100', label: 'Secure & Compliant', suffix: '%' },
          { value: '5', label: 'Minute Process', suffix: 'min' },
        ].map(({ value, label, suffix }) => (
          <div key={label}>
            <p className="text-3xl font-display font-black gradient-text">{value}<span className="text-xl">{suffix}</span></p>
            <p className="text-xs text-white/35 mt-1">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={20} className="text-white/20" />
      </motion.div>
    </div>
  );
}
