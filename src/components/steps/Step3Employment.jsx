import { useFormContext } from 'react-hook-form';
import { FormField, Input, Select } from '../FormField';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const DEPARTMENTS = [
  'Engineering', 'Product Management', 'Design', 'Data Science & AI',
  'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations',
  'Customer Success', 'Legal', 'Research & Development',
];

export default function Step3Employment() {
  const { register, formState: { errors }, watch } = useFormContext();
  const employeeType = watch('employeeType');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Employment Information</h2>
        <p className="text-white/50 text-sm">Your role details at UNAI Tech.</p>
      </motion.div>

      {/* Employee / Intern toggle */}
      <motion.div variants={item} className="space-y-3">
        <label className="text-sm font-medium text-white/80 block">
          I am joining as <span className="text-cyan-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Employee', 'Intern'].map((type) => {
            const val = type.toLowerCase();
            const isSelected = employeeType === val;
            return (
              <label
                key={type}
                className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-electric-500 bg-electric-500/10'
                    : 'border-white/10 bg-white/5 hover:border-white/25'
                }`}
              >
                <input
                  type="radio"
                  value={val}
                  {...register('employeeType')}
                  className="custom-radio"
                />
                <div>
                  <p className={`font-semibold text-sm ${isSelected ? 'text-electric-300' : 'text-white/70'}`}>{type}</p>
                  <p className="text-xs text-white/35">
                    {type === 'Employee' ? 'Full / Part time position' : 'Temporary internship role'}
                  </p>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="employeeTypeIndicator"
                    className="absolute inset-0 rounded-xl border-2 border-electric-500 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400 }}
                  />
                )}
              </label>
            );
          })}
        </div>
        {errors.employeeType && (
          <p className="text-xs text-red-400 pl-1">{errors.employeeType.message}</p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Department" required error={errors.department?.message}>
            <Select {...register('department')} error={errors.department?.message}>
              <option value="">— Select Department —</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Designation" required error={errors.designation?.message}>
            <Input {...register('designation')} error={errors.designation?.message} />
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Reporting Manager" error={errors.reportingManager?.message}>
            <Input {...register('reportingManager')} error={errors.reportingManager?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Work Location" error={errors.workLocation?.message}>
            <Input {...register('workLocation')} error={errors.workLocation?.message} />
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Date of Joining" required error={errors.dateOfJoining?.message}>
            <Input {...register('dateOfJoining')} type="date" error={errors.dateOfJoining?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Employment Type" required error={errors.employmentType?.message}>
            <Select {...register('employmentType')} error={errors.employmentType?.message}>
              <option value="">— Select Type —</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </Select>
          </FormField>
        </motion.div>
      </div>
    </motion.div>
  );
}
