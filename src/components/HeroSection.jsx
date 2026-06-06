import { motion } from 'framer-motion';
import { Shield, Zap, Users, BadgeCheck } from 'lucide-react';

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
        <div className="w-12 h-12 flex items-center justify-center">
          <img src="/logo.png" alt="UNAI Tech Logo" className="w-full h-full object-contain" />
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
          <span className="text-electric-500">to the Team</span>
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
        {features.map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-100 border border-slate-200 text-slate-600"
          >
            <Icon size={14} className="text-electric-500" />
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
    </div>
  );
}
