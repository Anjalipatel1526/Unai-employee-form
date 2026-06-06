import { motion } from 'framer-motion';
import { CheckCircle2, Download, RefreshCw, User, Briefcase, Calendar, Building2, QrCode, Award, Share2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

function generateEmployeeCode(data) {
  if (data?.employeeCode) return data.employeeCode;
  const dept = (data?.department || 'GEN').slice(0, 3).toUpperCase();
  const type = data?.employeeType === 'intern' ? 'INT' : 'EMP';
  const id = Math.floor(Math.random() * 90000 + 10000);
  return `UNAI-${type}-${dept}-${id}`;
}

function StatCard({ icon: Icon, label, value, color = 'electric' }) {
  const colorMap = {
    electric: 'text-electric-400 bg-electric-500/15',
    cyan: 'text-cyan-400 bg-cyan-500/15',
    emerald: 'text-emerald-400 bg-emerald-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
  };
  return (
    <motion.div variants={item} className="glass-card p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
        <Icon size={18} className={colorMap[color].split(' ')[0]} />
      </div>
      <div>
        <p className="text-xs text-white/40 font-medium">{label}</p>
        <p className="text-sm font-bold text-white/90 mt-0.5 leading-tight">{value || '—'}</p>
      </div>
    </motion.div>
  );
}

export default function SuccessDashboard({ data, onReset }) {
  const employeeCode = generateEmployeeCode(data);
  const qrRef = useRef(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(
      JSON.stringify({
        code: employeeCode,
        name: data.fullName,
        department: data.department,
        type: data.employeeType,
        joining: data.dateOfJoining,
      }),
      {
        width: 200,
        margin: 2,
        color: { dark: '#0a1628', light: '#ffffff' },
      }
    ).then(setQrDataUrl);
  }, []);

  const handleDownloadPDF = async () => {
    // Create a printable summary
    const printContent = `
      UNAI TECH - EMPLOYEE ONBOARDING SUMMARY
      ==========================================
      Employee Code: ${employeeCode}
      Name: ${data.fullName}
      Type: ${data.employeeType?.toUpperCase()}
      Department: ${data.department}
      Designation: ${data.designation}
      Date of Joining: ${data.dateOfJoining}
      Work Location: ${data.workLocation}
      Registration Date: ${new Date().toLocaleDateString('en-IN')}
    `;
    const blob = new Blob([printContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employeeCode}_onboarding_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(employeeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl"
      >
        {/* Success animation */}
        <motion.div
          variants={item}
          className="flex flex-col items-center text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-electric-500 to-cyan-500 flex items-center justify-center shadow-glow">
              <CheckCircle2 size={44} className="text-white" strokeWidth={2} />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-electric-400/30"
              animate={{ scale: [1, 1.4, 1.8], opacity: [0.7, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          </motion.div>

          <motion.h1
            variants={item}
            className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-3"
          >
            Welcome to UNAI Tech!
          </motion.h1>
          <motion.p variants={item} className="text-white/60 text-base">
            {data.fullName ? `Congratulations, ${data.fullName.split(' ')[0]}!` : 'Congratulations!'} Your onboarding is <span className="text-emerald-400 font-semibold">100% complete</span>.
          </motion.p>
        </motion.div>

        {/* Employee ID Card */}
        <motion.div variants={item} className="mb-6">
          <div
            className="relative overflow-hidden rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)',
              border: '1px solid rgba(13,130,255,0.3)',
              boxShadow: '0 0 40px rgba(13,130,255,0.2), 0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Card decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-electric-500/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cyan-500/5 translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-glow">
                  {data.fullName ? data.fullName.charAt(0).toUpperCase() : <User size={28} />}
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">{data.fullName || 'Employee'}</h2>
                  <p className="text-electric-300 text-sm font-medium">{data.designation || data.employeeType || 'Team Member'}</p>
                  <p className="text-white/50 text-xs mt-0.5">{data.department || 'UNAI Tech'}</p>

                  {/* Employee Code Badge */}
                  <button
                    onClick={handleCopyCode}
                    className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/15 border border-electric-500/30 text-electric-300 text-xs font-mono font-semibold hover:bg-electric-500/25 transition-all"
                  >
                    {copied ? '✓ Copied!' : employeeCode}
                  </button>
                </div>
              </div>

              {/* QR Code */}
              {qrDataUrl && (
                <div className="qr-container shrink-0 hidden sm:block">
                  <img src={qrDataUrl} alt="Employee QR Code" className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3">
              {[
                { label: 'Join Date', value: data.dateOfJoining || 'TBD' },
                { label: 'Type', value: data.employeeType === 'intern' ? 'Intern' : 'Employee' },
                { label: 'Location', value: data.workLocation || 'HQ' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xs text-white/35">{label}</p>
                  <p className="text-xs font-semibold text-white/80 mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                <span>Onboarding Progress</span>
                <span className="text-emerald-400 font-semibold">100% Complete</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <StatCard icon={User} label="Full Name" value={data.fullName} color="electric" />
          <StatCard icon={Briefcase} label="Department" value={data.department} color="cyan" />
          <StatCard icon={Building2} label="Employment Type" value={data.employmentType?.replace('-', ' ').toUpperCase()} color="emerald" />
          <StatCard icon={Calendar} label="Date of Joining" value={data.dateOfJoining} color="purple" />
        </motion.div>

        {/* QR Code (mobile) */}
        {qrDataUrl && (
          <motion.div variants={item} className="sm:hidden glass-card p-4 flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <QrCode size={16} className="text-electric-400" />
              <span className="text-sm font-medium text-white/70">Employee QR Code</span>
            </div>
            <div className="qr-container">
              <img src={qrDataUrl} alt="QR" className="w-32 h-32" />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadPDF}
            className="btn-primary flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Download size={16} />
            Download Summary
          </button>
          <button
            onClick={handleCopyCode}
            className="btn-secondary flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <Award size={16} />
            {copied ? 'Copied!' : 'Copy Employee Code'}
          </button>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            <RefreshCw size={15} />
            New Entry
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.p variants={item} className="text-center text-xs text-white/30 mt-6">
          Your HR team will review and verify your information within 24–48 working hours. Welcome to the family! 🚀
        </motion.p>
      </motion.div>
    </div>
  );
}
