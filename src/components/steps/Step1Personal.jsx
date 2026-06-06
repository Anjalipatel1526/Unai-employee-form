import { useFormContext } from 'react-hook-form';
import { FormField, Input, Select } from '../FormField';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Step1Personal() {
  const { register, formState: { errors }, setValue } = useFormContext();
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('profilePhoto', file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Personal Information</h2>
        <p className="text-white/50 text-sm">Tell us about yourself to get started.</p>
      </motion.div>

      {/* Profile Photo */}
      <motion.div variants={item} className="flex flex-col items-center gap-3">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-electric-500/40 flex items-center justify-center cursor-pointer hover:border-electric-500 transition-all group overflow-hidden"
          style={{ background: 'rgba(13,130,255,0.05)' }}
        >
          {preview ? (
            <img src={preview} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-white/40 group-hover:text-electric-400 transition-colors">
              <Camera size={22} />
              <span className="text-[10px] font-medium text-center leading-tight">Upload Photo</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={18} className="text-white" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
        <p className="text-xs text-white/35">JPG, PNG (max 5MB)</p>
      </motion.div>

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Full Name" required error={errors.fullName?.message}>
            <Input {...register('fullName')} error={errors.fullName?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Preferred Name" error={errors.preferredName?.message} hint="Name you'd like to be called">
            <Input {...register('preferredName')} error={errors.preferredName?.message} />
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={item}>
          <FormField label="Gender" required error={errors.gender?.message}>
            <Select {...register('gender')} error={errors.gender?.message}>
              <option value="">— Select —</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-Binary</option>
              <option value="prefer-not">Prefer not to say</option>
            </Select>
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Date of Birth" required error={errors.dateOfBirth?.message}>
            <Input
              {...register('dateOfBirth')}
              type="date"
              error={errors.dateOfBirth?.message}
              max={new Date().toISOString().split('T')[0]}
            />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Marital Status" error={errors.maritalStatus?.message}>
            <Select {...register('maritalStatus')} error={errors.maritalStatus?.message}>
              <option value="">— Select —</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </Select>
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Nationality" error={errors.nationality?.message}>
            <Input {...register('nationality')} error={errors.nationality?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Blood Group" error={errors.bloodGroup?.message}>
            <Select {...register('bloodGroup')} error={errors.bloodGroup?.message}>
              <option value="">— Select —</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </Select>
          </FormField>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <FormField label="Personal Email" required error={errors.personalEmail?.message}>
            <Input {...register('personalEmail')} type="email" error={errors.personalEmail?.message} />
          </FormField>
        </motion.div>
        <motion.div variants={item}>
          <FormField label="Mobile Number" required error={errors.mobile?.message}>
            <Input {...register('mobile')} type="tel" error={errors.mobile?.message} />
          </FormField>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <FormField label="Alternate Number" error={errors.alternateNumber?.message} hint="Optional secondary contact">
          <Input {...register('alternateNumber')} type="tel" error={errors.alternateNumber?.message} />
        </FormField>
      </motion.div>
    </motion.div>
  );
}
