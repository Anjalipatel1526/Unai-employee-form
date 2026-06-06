import { forwardRef } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FormField = forwardRef(function FormField(
  { label, error, success, required, hint, children, className = '' },
  ref
) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-white/80 flex items-center gap-1">
          {label}
          {required && <span className="text-cyan-400 text-xs">*</span>}
        </label>
      )}
      <div className="relative">
        {children}
      </div>
      {hint && !error && (
        <p className="text-xs text-white/35 pl-1">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-400 flex items-center gap-1.5 pl-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
        {success && !error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-emerald-400 flex items-center gap-1.5 pl-1"
          >
            <CheckCircle2 size={12} />
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export function Input({ error, success, className = '', ...props }) {
  return (
    <input
      className={`form-input ${error ? 'error' : ''} ${success && !error ? 'success' : ''} ${className}`}
      {...props}
    />
  );
}

export function Select({ error, children, className = '', ...props }) {
  return (
    <select
      className={`form-input ${error ? 'error' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function Textarea({ error, className = '', ...props }) {
  return (
    <textarea
      className={`form-input resize-none ${error ? 'error' : ''} ${className}`}
      rows={3}
      {...props}
    />
  );
}
