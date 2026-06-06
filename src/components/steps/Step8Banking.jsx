import { useFormContext } from 'react-hook-form';
import { FormField, Input } from '../FormField';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Step8Banking() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Bank Details</h2>
        <p className="text-white/50 text-sm">Required for salary disbursement and reimbursements.</p>
      </motion.div>

      {/* Security notice */}
      <motion.div variants={item}>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-electric-500/5 border border-electric-500/15">
          <Lock size={15} className="text-electric-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">
            Bank details are encrypted with AES-256 and stored in a secured vault. Only the payroll team has access.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <FormField label="Account Holder Name" error={errors.accountHolderName?.message} hint="As printed on passbook">
          <Input {...register('accountHolderName')} autoComplete="new-password" error={errors.accountHolderName?.message} />
        </FormField>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Bank Name" error={errors.bankName?.message}>
            <Input {...register('bankName')} autoComplete="new-password" error={errors.bankName?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Branch Name" error={errors.branchName?.message}>
            <Input {...register('branchName')} autoComplete="new-password" error={errors.branchName?.message} />
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Account Number" error={errors.accountNumber?.message}>
            <Input
              {...register('accountNumber')}
              type="password"
              autoComplete="new-password"
              error={errors.accountNumber?.message}
            />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="IFSC Code" error={errors.ifscCode?.message} hint="11-character code (e.g. HDFC0001234)">
            <Input
              {...register('ifscCode')}
              maxLength={11}
              autoComplete="new-password"
              error={errors.ifscCode?.message}
              style={{ textTransform: 'uppercase' }}
            />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <FormField label="UPI ID" error={errors.upiId?.message} hint="Optional — for quick reimbursements">
          <Input {...register('upiId')} error={errors.upiId?.message} />
        </FormField>
      </motion.div>
    </motion.div>
  );
}
