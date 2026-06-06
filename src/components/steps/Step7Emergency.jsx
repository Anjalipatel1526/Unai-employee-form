import { useFormContext } from 'react-hook-form';
import { FormField, Input, Select, Textarea } from '../FormField';
import { PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const RELATIONSHIPS = [
  'Father', 'Mother', 'Spouse', 'Sibling', 'Child',
  'Friend', 'Colleague', 'Guardian', 'Other',
];

export default function Step7Emergency() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Emergency Contact</h2>
        <p className="text-white/50 text-sm">Who should we reach in an emergency?</p>
      </motion.div>

      {/* Notice */}
      <motion.div variants={item}>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
          <PhoneCall size={15} className="text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">
            This information is kept confidential and used only in emergencies. Please provide accurate contact details.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Contact Full Name" required error={errors.emergencyName?.message}>
            <Input {...register('emergencyName')} error={errors.emergencyName?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Relationship" required error={errors.emergencyRelationship?.message}>
            <Select {...register('emergencyRelationship')} error={errors.emergencyRelationship?.message}>
              <option value="">— Select Relationship —</option>
              {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Primary Mobile" required error={errors.emergencyMobile?.message}>
            <Input {...register('emergencyMobile')} type="tel" error={errors.emergencyMobile?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Alternate Mobile" error={errors.emergencyAlternate?.message}>
            <Input {...register('emergencyAlternate')} type="tel" error={errors.emergencyAlternate?.message} />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <FormField label="Emergency Contact Address" error={errors.emergencyAddress?.message}>
          <Textarea {...register('emergencyAddress')} error={errors.emergencyAddress?.message} rows={3} />
        </FormField>
      </motion.div>
    </motion.div>
  );
}
