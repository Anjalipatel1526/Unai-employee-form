import { useFormContext } from 'react-hook-form';
import { FormField, Input } from '../FormField';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const SUGGESTED_SKILLS = [
  'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Go',
  'AI/ML', 'Machine Learning', 'Deep Learning', 'UI/UX Design', 'Figma',
  'AWS', 'Docker', 'Kubernetes', 'DevOps', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'REST APIs', 'Agile', 'Product Management',
];

export default function Step5Professional() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const skills = watch('skills') || [];
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setValue('skills', [...skills, trimmed]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setValue('skills', skills.filter(s => s !== skill));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Professional Details</h2>
        <p className="text-white/50 text-sm">Your experience and online presence.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Years of Experience" error={errors.yearsOfExperience?.message}>
            <Input
              {...register('yearsOfExperience')}
              type="number"
              min="0"
              max="50"
              error={errors.yearsOfExperience?.message}
            />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Previous Company" error={errors.previousCompany?.message}>
            <Input {...register('previousCompany')} error={errors.previousCompany?.message} />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <FormField label="Previous Designation" error={errors.previousDesignation?.message}>
          <Input {...register('previousDesignation')} error={errors.previousDesignation?.message} />
        </FormField>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="LinkedIn Profile URL" error={errors.linkedin?.message} hint="e.g. https://linkedin.com/in/yourname">
            <Input {...register('linkedin')} type="url" error={errors.linkedin?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Portfolio / Website URL" error={errors.portfolio?.message}>
            <Input {...register('portfolio')} type="url" error={errors.portfolio?.message} />
          </FormField>
        </motion.div>
      </div>

      {/* Skills tag input */}
      <motion.div variants={item} className="space-y-3">
        <FormField label="Skills" hint="Press Enter or comma to add">
          <div
            className="form-input h-auto min-h-[76px] flex flex-wrap gap-2 p-3 cursor-text"
            onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
          >
            <AnimatePresence>
              {skills.map(skill => (
                <motion.span
                  key={skill}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="skill-tag flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-electric-400/60 hover:text-electric-400 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder=""
              className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-white/80 placeholder:text-white/25"
            />
          </div>
        </FormField>

        {/* Suggested */}
        <div>
          <p className="text-xs text-white/35 mb-2">Suggested skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).slice(0, 12).map(skill => (
              <motion.button
                key={skill}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addSkill(skill)}
                className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-electric-500/40 hover:bg-electric-500/10 transition-all flex items-center gap-1"
              >
                <Plus size={10} />
                {skill}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
