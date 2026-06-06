import { useFormContext, useFieldArray } from 'react-hook-form';
import { FormField, Input, Select } from '../FormField';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const QUALIFICATIONS = [
  'High School (10th)', 'Intermediate (12th)', 'Diploma', 'B.Tech / B.E.',
  'B.Sc', 'B.Com', 'B.A.', 'BBA', 'BCA', 'M.Tech / M.E.',
  'M.Sc', 'MBA', 'MCA', 'Ph.D.', 'Other',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

export default function Step4Education() {
  const { register, formState: { errors }, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'additionalEducation' });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Educational Details</h2>
        <p className="text-white/50 text-sm">Share your academic qualifications.</p>
      </motion.div>

      {/* Highest Qualification */}
      <motion.div variants={item} className="space-y-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Highest Qualification</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Qualification" required error={errors.highestQualification?.message}>
            <Select {...register('highestQualification')} error={errors.highestQualification?.message}>
              <option value="">— Select Qualification —</option>
              {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
            </Select>
          </FormField>
          <FormField label="University / College" required error={errors.university?.message}>
            <Input {...register('university')} error={errors.university?.message} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Year of Passing" required error={errors.yearOfPassing?.message}>
            <Select {...register('yearOfPassing')} error={errors.yearOfPassing?.message}>
              <option value="">— Select Year —</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </Select>
          </FormField>
          <FormField label="Percentage / CGPA" required error={errors.percentage?.message}>
            <Input {...register('percentage')} error={errors.percentage?.message} />
          </FormField>
        </div>
      </motion.div>

      {/* Additional Education */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Additional Qualifications</p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => append({ degree: '', institution: '', year: '', grade: '' })}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
          >
            <Plus size={13} />
            Add More
          </motion.button>
        </div>

        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-white/10 rounded-xl p-4 space-y-3 bg-white/3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/40">Education #{index + 2}</span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400/60 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Degree" error={errors.additionalEducation?.[index]?.degree?.message}>
                  <Input {...register(`additionalEducation.${index}.degree`)} error={errors.additionalEducation?.[index]?.degree?.message} />
                </FormField>
                <FormField label="Institution" error={errors.additionalEducation?.[index]?.institution?.message}>
                  <Input {...register(`additionalEducation.${index}.institution`)} error={errors.additionalEducation?.[index]?.institution?.message} />
                </FormField>
                <FormField label="Year" error={errors.additionalEducation?.[index]?.year?.message}>
                  <Select {...register(`additionalEducation.${index}.year`)} error={errors.additionalEducation?.[index]?.year?.message}>
                    <option value="">— Select Year —</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </Select>
                </FormField>
                <FormField label="Grade / CGPA" error={errors.additionalEducation?.[index]?.grade?.message}>
                  <Input {...register(`additionalEducation.${index}.grade`)} error={errors.additionalEducation?.[index]?.grade?.message} />
                </FormField>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {fields.length === 0 && (
          <p className="text-center text-white/25 text-xs py-3">
            Click "Add More" to include additional qualifications
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
