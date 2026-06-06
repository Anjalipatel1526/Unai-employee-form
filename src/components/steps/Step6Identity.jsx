import { useFormContext } from 'react-hook-form';
import { FormField, Input } from '../FormField';
import { Upload, X, FileText, Image as ImageIcon, Shield } from 'lucide-react';
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

function FileUploadField({ label, name, hint }) {
  const { setValue, watch } = useFormContext();
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();
  const file = watch(name);

  const handleFile = (f) => { if (f) setValue(name, f); };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getIcon = (filename) => {
    if (!filename) return <Upload size={18} className="text-electric-400" />;
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <ImageIcon size={18} className="text-cyan-400" />;
    return <FileText size={18} className="text-electric-400" />;
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white/80 block">{label}</label>
      <div
        className={`file-upload-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex items-center gap-3">
            {getIcon(file.name)}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm text-white/80 font-medium truncate">{file.name}</p>
              <p className="text-xs text-white/40">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setValue(name, null); }}
              className="text-white/30 hover:text-red-400 transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-9 h-9 rounded-xl bg-electric-500/10 flex items-center justify-center">
              {getIcon(null)}
            </div>
            <p className="text-sm text-white/50 text-center">
              <span className="text-electric-400">Click</span> or drag & drop
            </p>
            {hint && <p className="text-xs text-white/30">{hint}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Step6Identity() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Government & Identity</h2>
        <p className="text-white/50 text-sm">Secure identity verification for HR compliance.</p>
      </motion.div>

      {/* Identity Numbers */}
      <motion.div variants={item} className="space-y-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Identity Numbers</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Aadhaar Number" error={errors.aadhaar?.message} hint="12-digit Aadhaar UID">
            <Input {...register('aadhaar')} maxLength={14} error={errors.aadhaar?.message} />
          </FormField>
          <FormField label="PAN Number" error={errors.pan?.message} hint="10-character (e.g. ABCDE1234F)">
            <Input
              {...register('pan')}
              maxLength={10}
              error={errors.pan?.message}
              style={{ textTransform: 'uppercase' }}
            />
          </FormField>
          <FormField label="Passport Number" error={errors.passport?.message}>
            <Input {...register('passport')} maxLength={8} error={errors.passport?.message} />
          </FormField>
          <FormField label="Driving License Number" error={errors.drivingLicense?.message}>
            <Input {...register('drivingLicense')} error={errors.drivingLicense?.message} />
          </FormField>
        </div>
      </motion.div>

      {/* Document Uploads */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Document Uploads</p>
          <p className="text-xs text-white/30">PDF, PNG, JPG · max 5 MB</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FileUploadField label="Aadhaar Copy" name="aadhaarFile" hint="PDF, PNG or JPG" />
          <FileUploadField label="PAN Copy" name="panFile" hint="PDF, PNG or JPG" />
          <FileUploadField label="Resume / CV" name="resumeFile" hint="PDF preferred" />
        </div>
      </motion.div>

      {/* Security notice */}
      <motion.div variants={item}>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-electric-500/5 border border-electric-500/15">
          <Shield size={15} className="text-electric-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/50 leading-relaxed">
            Your documents are encrypted with AES-256 and accessible only to authorized HR personnel.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
