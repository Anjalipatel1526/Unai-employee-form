import { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send, Loader2, AlertTriangle } from 'lucide-react';
import { submitOnboardingForm } from '../lib/formService';

import { fullSchema, stepSchemas } from '../schemas/formSchema';
import Stepper from './Stepper';
import Step1Personal from './steps/Step1Personal';
import Step2Address from './steps/Step2Address';
import Step3Employment from './steps/Step3Employment';
import Step4Education from './steps/Step4Education';
import Step5Professional from './steps/Step5Professional';
import Step6Identity from './steps/Step6Identity';
import Step7Emergency from './steps/Step7Emergency';
import Step8Banking from './steps/Step8Banking';
import Step10Declaration from './steps/Step10Declaration';

const TOTAL_STEPS = 9;

const stepComponents = {
  1: Step1Personal,
  2: Step2Address,
  3: Step3Employment,
  4: Step4Education,
  5: Step5Professional,
  6: Step6Identity,
  7: Step7Emergency,
  8: Step8Banking,
  9: Step10Declaration,
};

const pageVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 50 : -50,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -50 : 50,
    transition: { duration: 0.18 },
  }),
};

export default function MultiStepForm({ onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const methods = useForm({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
    defaultValues: {
      skills: [],
      assets: [],
      additionalEducation: [],
      declaration: false,
    },
  });

  const { handleSubmit, trigger } = methods;

  const validateCurrentStep = useCallback(async () => {
    const schema = stepSchemas[currentStep];
    if (!schema || Object.keys(schema.shape || {}).length === 0) return true;
    const fields = Object.keys(schema.shape || {});
    return await trigger(fields);
  }, [currentStep, trigger]);

  const goNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;
    setDirection(1);
    setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitOnboardingForm(data);
      onSuccess(result);
    } catch (err) {
      console.error('[Submit] Error:', err);
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const StepComponent = stepComponents[currentStep];

  return (
    <FormProvider {...methods}>
      {/* Outer page — responsive horizontal + vertical padding */}
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col items-center">

        {/* Header / brand + stepper */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-600 to-cyan-600 flex items-center justify-center border border-electric-400/30 shadow-glow shrink-0">
              <span className="text-white font-display font-black text-sm">U</span>
            </div>
            <div>
              <p className="text-white/80 font-display font-semibold text-sm leading-tight">UNAI Tech</p>
              <p className="text-white/35 text-[10px] tracking-widest uppercase">Onboarding Portal</p>
            </div>
          </div>
          <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </motion.div>

        {/* Form card */}
        <div className="w-full max-w-2xl">
          <div className="glass-card px-5 py-6 sm:px-8 sm:py-8 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Supabase error banner */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25"
              >
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-300">Submission failed</p>
                  <p className="text-xs text-red-400/80 mt-0.5">{submitError}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mt-5 gap-3"
          >

            {/* Back */}
            <motion.button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 1}
              whileHover={{ scale: currentStep > 1 ? 1.02 : 1 }}
              whileTap={{ scale: currentStep > 1 ? 0.98 : 1 }}
              className={`btn-secondary flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm ${
                currentStep === 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <ChevronLeft size={15} />
              <span className="hidden xs:inline">Previous</span>
              <span className="xs:hidden">Back</span>
            </motion.button>

            {/* Counter */}
            <span className="text-xs text-white/30 font-medium shrink-0">
              {currentStep} / {TOTAL_STEPS}
            </span>

            {/* Next / Submit */}
            {currentStep < TOTAL_STEPS ? (
              <motion.button
                type="button"
                onClick={goNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2 px-4 sm:px-5 py-2.5 text-sm"
              >
                Next
                <ChevronRight size={15} />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="btn-primary flex items-center gap-2 px-5 sm:px-7 py-2.5 text-sm min-w-[110px] justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Submit
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-white/20 mt-8 pb-4"
        >
          © 2024 UNAI Tech · All data is encrypted per our Privacy Policy
        </motion.p>
      </div>
    </FormProvider>
  );
}
