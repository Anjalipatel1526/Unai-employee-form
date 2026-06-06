import { useFormContext } from 'react-hook-form';
import { FormField, Input, Select, Textarea } from '../FormField';
import { motion } from 'framer-motion';
import { useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Germany', 'France', 'Singapore', 'UAE', 'Other',
];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function Step2Address() {
  const { register, formState: { errors }, setValue, getValues } = useFormContext();
  const [sameAddress, setSameAddress] = useState(false);

  const handleSameAddress = (e) => {
    const checked = e.target.checked;
    setSameAddress(checked);
    if (checked) {
      const values = getValues();
      setValue('permanentAddress', values.currentAddress);
      setValue('permanentCity', values.currentCity);
      setValue('permanentState', values.currentState);
      setValue('permanentCountry', values.currentCountry);
      setValue('permanentPincode', values.currentPincode);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Address Information</h2>
        <p className="text-white/50 text-sm">Where do you currently reside?</p>
      </motion.div>

      {/* Current Address */}
      <motion.div variants={item} className="space-y-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Current Address</p>

        <FormField label="Street / House Address" required error={errors.currentAddress?.message}>
          <Textarea {...register('currentAddress')} error={errors.currentAddress?.message} rows={3} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City" required error={errors.currentCity?.message}>
            <Input {...register('currentCity')} error={errors.currentCity?.message} />
          </FormField>
          <FormField label="State" required error={errors.currentState?.message}>
            <Select {...register('currentState')} error={errors.currentState?.message}>
              <option value="">— Select State —</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormField>
          <FormField label="Pincode" required error={errors.currentPincode?.message}>
            <Input {...register('currentPincode')} maxLength={6} error={errors.currentPincode?.message} />
          </FormField>
        </div>

        <FormField label="Country" required error={errors.currentCountry?.message}>
          <Select {...register('currentCountry')} error={errors.currentCountry?.message}>
            <option value="">— Select Country —</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
      </motion.div>

      {/* Divider + checkbox */}
      <motion.div variants={item} className="border-t border-white/8 pt-4">
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <input
            type="checkbox"
            className="custom-checkbox"
            checked={sameAddress}
            onChange={handleSameAddress}
          />
          <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
            Permanent address same as current address
          </span>
        </label>
      </motion.div>

      {/* Permanent Address */}
      <motion.div variants={item} className="space-y-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Permanent Address</p>

        <FormField label="Street / House Address" required error={errors.permanentAddress?.message}>
          <Textarea
            {...register('permanentAddress')}
            error={errors.permanentAddress?.message}
            disabled={sameAddress}
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="City" required error={errors.permanentCity?.message}>
            <Input {...register('permanentCity')} error={errors.permanentCity?.message} disabled={sameAddress} />
          </FormField>
          <FormField label="State" required error={errors.permanentState?.message}>
            <Select {...register('permanentState')} error={errors.permanentState?.message} disabled={sameAddress}>
              <option value="">— Select State —</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </FormField>
          <FormField label="Pincode" required error={errors.permanentPincode?.message}>
            <Input
              {...register('permanentPincode')}
              maxLength={6}
              error={errors.permanentPincode?.message}
              disabled={sameAddress}
            />
          </FormField>
        </div>

        <FormField label="Country" required error={errors.permanentCountry?.message}>
          <Select {...register('permanentCountry')} error={errors.permanentCountry?.message} disabled={sameAddress}>
            <option value="">— Select Country —</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
        </FormField>
      </motion.div>
    </motion.div>
  );
}
