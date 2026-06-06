import { useFormContext } from 'react-hook-form';
import { Shield, PenTool, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#00d1ff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    onChange(canvas.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="signature-canvas w-full"
          style={{ height: 140, touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-1.5 text-white/20">
              <PenTool size={18} />
              <span className="text-xs">Sign here with your mouse or finger</span>
            </div>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
      >
        <RotateCcw size={11} />
        Clear signature
      </button>
    </div>
  );
}

export default function Step10Declaration() {
  const { register, formState: { errors }, setValue, watch } = useFormContext();
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const declared = watch('declaration');

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <h2 className="text-xl sm:text-2xl font-display font-bold gradient-text mb-1">Declaration</h2>
        <p className="text-white/50 text-sm">Please read carefully and sign to complete your registration.</p>
      </motion.div>

      {/* Declaration text */}
      <motion.div variants={item} className="space-y-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Declaration Statement</p>
        <div className="p-4 rounded-xl bg-white/3 border border-white/8 space-y-3">
          <p className="text-xs text-white/55 leading-relaxed">
            I hereby solemnly declare that all information provided in this onboarding form is true, accurate, and complete to the best of my knowledge. I understand that any misrepresentation or omission of facts may result in immediate termination of my employment or internship.
          </p>
          <p className="text-xs text-white/55 leading-relaxed">
            I consent to UNAI Tech collecting and processing my personal data as described in the company's Privacy Policy and for the purposes of employment administration.
          </p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register('declaration')}
            className="custom-checkbox mt-0.5 shrink-0"
          />
          <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">
            I confirm that all information provided is <strong className="text-white/90">true and accurate</strong>, and I agree to the onboarding terms and conditions.
          </span>
        </label>
        {errors.declaration && (
          <p className="text-xs text-red-400 pl-1">{errors.declaration.message}</p>
        )}
      </motion.div>

      {/* Digital signature */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between border-t border-white/8 pt-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">Digital Signature</p>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <PenTool size={11} />
            Draw to sign
          </div>
        </div>
        <SignaturePad onChange={(data) => setValue('signature', data)} />
      </motion.div>

      {/* Date */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10">
          <span className="text-sm text-white/40">Date</span>
          <span className="text-sm font-semibold text-white/80">{today}</span>
        </div>
      </motion.div>

      {/* Confirmed state */}
      {declared && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
        >
          <Shield size={14} className="text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-300/80">
            Declaration confirmed — ready to submit!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
