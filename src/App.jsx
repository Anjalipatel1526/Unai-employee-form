import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import HeroSection from './components/HeroSection';
import MultiStepForm from './components/MultiStepForm';
import SuccessDashboard from './components/SuccessDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'hero';
  });
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      setView(window.location.pathname === '/admin' ? 'admin' : 'hero');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSuccess = (data) => {
    setSubmittedData(data);
    setView('success');
  };

  const handleReset = () => {
    setSubmittedData(null);
    setView('hero');
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: '#050b18' }}>
      {/* Always-present animated background */}
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              <HeroSection onStart={() => setView('form')} />
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <MultiStepForm onSuccess={handleSuccess} />
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <SuccessDashboard data={submittedData} onReset={handleReset} />
            </motion.div>
          )}

          {view === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <AdminDashboard onBack={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
