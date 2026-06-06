import { useFormContext } from 'react-hook-form';
import { Laptop, Monitor, Mouse, Keyboard, Headphones, CreditCard, IdCard, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const ASSETS = [
  { id: 'laptop',     label: 'Laptop',       description: 'Primary work machine',    icon: Laptop },
  { id: 'monitor',    label: 'Monitor',      description: 'External display',        icon: Monitor },
  { id: 'mouse',      label: 'Mouse',        description: 'Wireless or wired',       icon: Mouse },
  { id: 'keyboard',   label: 'Keyboard',     description: 'Mechanical or membrane',  icon: Keyboard },
  { id: 'headset',    label: 'Headset',      description: 'Noise cancelling',        icon: Headphones },
  { id: 'idCard',     label: 'ID Card',      description: 'Employee identity card',  icon: IdCard },
  { id: 'accessCard', label: 'Access Card',  description: 'Building & floor access', icon: CreditCard },
];

export default function Step9Assets() {
  const { register, watch } = useFormContext();
  const assets = watch('assets') || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Company Assets</h2>
        <p className="text-white/50 text-sm">Select the equipment you'll need for your role.</p>
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/15 mb-4">
          <Package size={15} className="text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">
            Asset requests are subject to HR and manager approval. Final allocation will be confirmed during your first week.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSETS.map(({ id, label, description, icon: Icon }) => {
            const isChecked = assets.includes(id);
            return (
              <motion.label
                key={id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isChecked
                    ? 'border-electric-500/60 bg-electric-500/8'
                    : 'border-white/10 bg-white/3 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  value={id}
                  {...register('assets')}
                  className="custom-checkbox shrink-0"
                />
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isChecked ? 'bg-electric-500/20' : 'bg-white/5'
                }`}>
                  <Icon size={17} className={isChecked ? 'text-electric-400' : 'text-white/30'} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold transition-colors duration-200 ${isChecked ? 'text-white' : 'text-white/60'}`}>
                    {label}
                  </p>
                  <p className="text-xs text-white/30 truncate">{description}</p>
                </div>
              </motion.label>
            );
          })}
        </div>
      </motion.div>

      {assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-white/5 border border-white/10"
        >
          <p className="text-xs text-white/40 mb-2">Selected ({assets.length}):</p>
          <div className="flex flex-wrap gap-2">
            {assets.map(id => {
              const asset = ASSETS.find(a => a.id === id);
              return asset ? (
                <span key={id} className="skill-tag text-xs">{asset.label}</span>
              ) : null;
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
