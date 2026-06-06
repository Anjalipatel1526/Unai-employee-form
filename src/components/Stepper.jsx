import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Address' },
  { id: 3, label: 'Employment' },
  { id: 4, label: 'Education' },
  { id: 5, label: 'Professional' },
  { id: 6, label: 'Identity' },
  { id: 7, label: 'Emergency' },
  { id: 8, label: 'Banking' },
  { id: 9, label: 'Declaration' },
];

export default function Stepper({ currentStep, totalSteps }) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full">
      {/* Mobile stepper - compact */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-white">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-electric-400 font-medium">
            {STEPS[currentStep - 1]?.label}
          </span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Desktop stepper */}
      <div className="hidden sm:block">
        {/* Progress bar on top */}
        <div className="progress-bar mb-6">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps - scrollable on md, wrapped on lg */}
        <div className="overflow-x-auto pb-2">
          <div className="flex items-center min-w-max mx-auto">
            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Step circle + label */}
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.15 : 1,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`
                        w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                        border-2 transition-all duration-300 relative
                        ${isCompleted
                          ? 'bg-gradient-to-br from-electric-500 to-cyan-600 border-electric-500 text-white shadow-glow'
                          : isActive
                            ? 'border-electric-500 bg-electric-500/20 text-electric-400'
                            : 'border-white/15 bg-white/5 text-white/30'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      ) : (
                        <span>{step.id}</span>
                      )}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-electric-400"
                          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    <span className={`text-[10px] font-medium whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-electric-400' : isCompleted ? 'text-white/60' : 'text-white/25'
                    }`}>
                      {step.label}
                    </span>
                  </div>

                  {/* Connector */}
                  {idx < STEPS.length - 1 && (
                    <div className={`step-connector mx-1 ${isCompleted ? 'active' : ''}`} style={{ width: 28 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
