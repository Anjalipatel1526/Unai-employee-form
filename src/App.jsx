import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import MultiStepForm from './components/MultiStepForm';
import SuccessDashboard from './components/SuccessDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [view, setView] = useState(() => {
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    return cleanPath === '/admin' ? 'admin' : 'hero';
  });
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    const handlePopState = () => {
      const cleanPath = window.location.pathname.replace(/\/$/, '');
      setView(cleanPath === '/admin' ? 'admin' : 'hero');
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
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    if (cleanPath !== '') {
      window.history.pushState({}, '', '/');
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: '#ffffff' }}>
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
