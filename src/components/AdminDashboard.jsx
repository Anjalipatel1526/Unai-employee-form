import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle2, AlertCircle, XCircle, Search, 
  ArrowLeft, Download, ShieldCheck, Mail, Phone, Calendar, 
  MapPin, Briefcase, GraduationCap, FileText, Landmark,
  ExternalLink, UserCheck, UserX, UserMinus, Plus, Pencil, Trash2
} from 'lucide-react';
import { getAllSubmissions, updateSubmissionStatus, updateSubmissionDetails, deleteSubmission } from '../lib/formService';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

export default function AdminDashboard({ onBack }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editFiles, setEditFiles] = useState({});

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const startEditing = (sub) => {
    setEditForm({
      full_name: sub.full_name || '',
      mobile: sub.mobile || '',
      personal_email: sub.personal_email || '',
      department: sub.department || '',
      designation: sub.designation || '',
      aadhaar_number: sub.aadhaar_number || '',
      pan_number: sub.pan_number || '',
    });
    setEditFiles({});
    setIsEditing(true);
  };

  const handleEditChange = (field, val) => {
    setEditForm(prev => ({ ...prev, [field]: val }));
  };

  const handleEditFileChange = (field, file) => {
    setEditFiles(prev => ({ ...prev, [field]: file }));
  };

  const saveEditedDetails = async () => {
    try {
      setUpdating(true);
      const cleanedForm = {
        ...editForm,
        pan_number: editForm.pan_number ? editForm.pan_number.toUpperCase() : '',
      };
      
      const updated = await updateSubmissionDetails(
        selectedSubmission.id,
        selectedSubmission.employee_code,
        cleanedForm,
        editFiles
      );

      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? updated : s));
      setSelectedSubmission(updated);
      setIsEditing(false);
      alert('Candidate details and documents updated successfully!');
    } catch (err) {
      alert('Failed to update candidate details: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };
  const triggerDeleteConfirm = (sub) => {
    setCandidateToDelete(sub);
    setShowDeleteConfirm(true);
  };

  const executeDeleteSubmission = async () => {
    if (!candidateToDelete) return;
    try {
      setUpdating(true);
      await deleteSubmission(candidateToDelete.id);
      setSubmissions(prev => prev.filter(s => s.id !== candidateToDelete.id));
      setSelectedSubmission(null);
      setIsEditing(false);
      setShowDeleteConfirm(false);
      setCandidateToDelete(null);
    } catch (err) {
      alert('Failed to delete candidate: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissions();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employee onboarding records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput === 'admin@unaitech.com' && passwordInput === 'Unaitech@2026') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid Administrator credentials.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdating(true);
      const updated = await updateSubmissionStatus(id, newStatus, notes);
      setSubmissions(prev => prev.map(s => s.id === id ? updated : s));
      setSelectedSubmission(updated);
      setNotes('');
    } catch (err) {
      alert('Failed to update submission status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.personal_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesDept = deptFilter === 'all' || sub.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Stats
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const verifiedCount = submissions.filter(s => s.status === 'verified' || s.status === 'onboarded').length;
  const employeeCount = submissions.filter(s => s.employee_type === 'employee').length;
  const internCount = submissions.filter(s => s.employee_type === 'intern').length;

  const departments = [...new Set(submissions.map(s => s.department))].filter(Boolean);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)] animate-pulse">
            <AlertCircle size={12} /> Pending Review
          </span>
        );
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
            <CheckCircle2 size={12} /> Verified
          </span>
        );
      case 'onboarded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/20 shadow-[0_0_12px_rgba(13,130,255,0.1)]">
            <ShieldCheck size={12} /> Fully Onboarded
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.1)]">
            <XCircle size={12} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 mb-4">
              <img src="/logo.png" alt="UNAI TECH Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-xl font-display font-bold text-white text-center">UNAI TECH</h2>
            <p className="text-white/40 text-[10px] tracking-wider uppercase mt-1">HR Administration Console</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Administrator ID</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="admin@unaitech.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-electric-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-electric-500 transition-colors"
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium text-center"
              >
                {loginError}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-display font-bold text-sm transition-all"
              style={{
                background: '#0d82ff',
                boxShadow: '0 4px 20px rgba(13,130,255,0.15)',
              }}
            >
              Sign In to Console
            </motion.button>
          </form>
        </motion.div>

        <button
          onClick={onBack}
          className="mt-6 text-xs text-slate-800 hover:text-black font-semibold transition-colors"
        >
          ← Go back to Portal
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">HR Onboarding Console</h1>
            <p className="text-white/40 text-sm mt-0.5">Manage and verify new employee and intern registrations.</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchSubmissions}
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          Refresh Data
        </motion.button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Enrolled', value: totalCount, icon: Users, color: 'bg-blue-50/50 text-blue-600 border-blue-200/60' },
          { label: 'Pending Review', value: pendingCount, icon: AlertCircle, color: 'bg-amber-50/50 text-amber-600 border-amber-200/60' },
          { label: 'Active / Verified', value: verifiedCount, icon: CheckCircle2, color: 'bg-emerald-50/50 text-emerald-600 border-emerald-200/60' },
          { label: 'Team Breakdown', value: `${employeeCount} E / ${internCount} I`, icon: ShieldCheck, color: 'bg-cyan-50/50 text-cyan-600 border-cyan-200/60' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl border ${stat.color} flex items-center justify-between backdrop-blur-md`}
          >
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black font-display text-slate-900 mt-1">{stat.value}</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200">
              <stat.icon size={20} className={stat.color.split(' ')[1]} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, or code..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-electric-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm focus:outline-none focus:border-electric-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="onboarded">Onboarded</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Department filter */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm focus:outline-none focus:border-electric-500 transition-colors"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions List Container */}
      <div className="w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-white/40">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 rounded-full border-2 border-electric-500 border-t-transparent mb-3"
            />
            <p className="text-sm">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-400 text-sm">
            <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
            {error}
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="py-20 text-center text-white/30 text-sm">
            <Users size={32} className="mx-auto mb-3 text-white/15" />
            No records matched your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold text-white/40 uppercase tracking-wider bg-white/[0.02]">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Department & Designation</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.map((sub, index) => (
                  <motion.tr
                    key={sub.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-electric-500 to-cyan-500 flex items-center justify-center border border-white/10 text-white font-semibold text-sm shrink-0 overflow-hidden">
                          {sub.profile_photo_url ? (
                            <img src={sub.profile_photo_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            sub.full_name?.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white group-hover:text-electric-300 transition-colors">{sub.full_name}</p>
                          <p className="text-xs text-white/35">{sub.personal_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-white/70">{sub.employee_code}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white/80">{sub.department}</p>
                      <p className="text-xs text-white/45">{sub.designation}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {sub.date_of_joining ? new Date(sub.date_of_joining).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-4 py-2 rounded-lg bg-electric-500/10 hover:bg-electric-500 text-electric-300 hover:text-white border border-electric-500/20 hover:border-electric-500 text-xs font-bold transition-all"
                      >
                        View Profile
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Detail Slide-over Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          >
            {/* Modal card */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-3xl bg-[#091122] border-l border-white/10 h-full overflow-y-auto shadow-2xl flex flex-col"
            >
              {/* Modal header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#091122]/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500 to-cyan-500 flex items-center justify-center border border-white/10 text-white font-semibold text-lg overflow-hidden shrink-0">
                    {selectedSubmission.profile_photo_url ? (
                      <img src={selectedSubmission.profile_photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      selectedSubmission.full_name?.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white leading-snug">{selectedSubmission.full_name}</h2>
                    <p className="text-xs text-white/45">{selectedSubmission.employee_code} • {selectedSubmission.employee_type === 'intern' ? 'Intern' : 'Employee'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={updating}
                    onClick={() => triggerDeleteConfirm(selectedSubmission)}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                    title="Delete Candidate"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  <button
                    onClick={() => { setSelectedSubmission(null); setIsEditing(false); }}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Close Panel
                  </button>
                </div>
              </div>

              {/* Modal content body */}
              <div className="p-6 space-y-8 flex-1">
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="text-lg font-bold text-slate-900">Edit Candidate Details & Documents</h3>
                      <div className="flex gap-2">
                        <button
                          disabled={updating}
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={updating}
                          onClick={saveEditedDetails}
                          className="px-4 py-2 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>

                    {/* Edit Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editForm.full_name}
                          onChange={e => handleEditChange('full_name', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                        <input
                          type="text"
                          value={editForm.mobile}
                          onChange={e => handleEditChange('mobile', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Personal Email</label>
                        <input
                          type="email"
                          value={editForm.personal_email}
                          onChange={e => handleEditChange('personal_email', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                        <select
                          value={editForm.department}
                          onChange={e => handleEditChange('department', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        >
                          <option value="">— Select —</option>
                          <option value="UI/UX">UI/UX</option>
                          <option value="Social Media Manager">Social Media Manager</option>
                          <option value="AI Developer">AI Developer</option>
                          <option value="Web Developer">Web Developer</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Mobile App Developer">Mobile App Developer</option>
                          <option value="Content Creator">Content Creator</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                        <input
                          type="text"
                          value={editForm.designation}
                          onChange={e => handleEditChange('designation', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aadhaar Number</label>
                        <input
                          type="text"
                          value={editForm.aadhaar_number}
                          onChange={e => handleEditChange('aadhaar_number', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PAN Number</label>
                        <input
                          type="text"
                          value={editForm.pan_number}
                          onChange={e => handleEditChange('pan_number', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-electric-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Reupload Files Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800">Reupload Documents (Optional)</h4>
                      <p className="text-xs text-slate-500">Only upload files if you want to replace the existing ones.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleEditFileChange('profilePhoto', e.target.files[0])}
                            className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-electric-50 file:text-electric-700 hover:file:bg-electric-100"
                          />
                          {editFiles.profilePhoto && <p className="text-xs text-emerald-600 mt-1">✓ Selected: {editFiles.profilePhoto.name}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resume / CV</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={e => handleEditFileChange('resumeFile', e.target.files[0])}
                            className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-electric-50 file:text-electric-700 hover:file:bg-electric-100"
                          />
                          {editFiles.resumeFile && <p className="text-xs text-emerald-600 mt-1">✓ Selected: {editFiles.resumeFile.name}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aadhaar Card Copy</label>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => handleEditFileChange('aadhaarFile', e.target.files[0])}
                            className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-electric-50 file:text-electric-700 hover:file:bg-electric-100"
                          />
                          {editFiles.aadhaarFile && <p className="text-xs text-emerald-600 mt-1">✓ Selected: {editFiles.aadhaarFile.name}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PAN Card Copy</label>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={e => handleEditFileChange('panFile', e.target.files[0])}
                            className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-electric-50 file:text-electric-700 hover:file:bg-electric-100"
                          />
                          {editFiles.panFile && <p className="text-xs text-emerald-600 mt-1">✓ Selected: {editFiles.panFile.name}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                      <button
                        disabled={updating}
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={updating}
                        onClick={saveEditedDetails}
                        className="px-6 py-2.5 rounded-xl bg-electric-500 hover:bg-electric-600 text-white text-sm font-semibold transition-all shadow-md flex items-center gap-2"
                      >
                        {updating ? 'Saving Changes...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Status indicator widget */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-xs text-white/35">Current Verification Status</p>
                    <div className="mt-1.5">{getStatusBadge(selectedSubmission.status)}</div>
                  </div>

                  {selectedSubmission.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'verified')}
                        className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <UserCheck size={14} /> Verify Candidate
                      </button>
                      <button
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                        className="px-4 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <UserX size={14} /> Reject
                      </button>
                    </div>
                  )}

                  {selectedSubmission.status === 'verified' && (
                    <button
                      disabled={updating}
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'onboarded')}
                      className="px-4 py-2 rounded-lg bg-electric-500/20 hover:bg-electric-500 text-electric-300 hover:text-white border border-electric-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <ShieldCheck size={14} /> Complete Onboarding
                    </button>
                  )}
                </div>

                {/* Profile Photo & Uploaded Documents Overview Card */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Photo & Basic Details */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-electric-500 to-cyan-500 flex items-center justify-center border border-slate-200 text-white font-semibold text-2xl overflow-hidden shrink-0 shadow-sm">
                      {selectedSubmission.profile_photo_url ? (
                        <img src={selectedSubmission.profile_photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        selectedSubmission.full_name?.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug">{selectedSubmission.full_name}</h3>
                      <p className="text-sm text-slate-600 font-semibold">{selectedSubmission.designation} • {selectedSubmission.department}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{selectedSubmission.employee_code}</p>
                      <button
                        onClick={() => startEditing(selectedSubmission)}
                        className="mt-2.5 px-3 py-1.5 rounded-lg bg-electric-500/10 hover:bg-electric-500 text-electric-600 hover:text-white border border-electric-500/20 hover:border-electric-500 text-[11px] font-bold transition-all flex items-center gap-1.5"
                      >
                        <Pencil size={11} /> Edit Info / Files
                      </button>
                    </div>
                  </div>

                  {/* Documents Column */}
                  <div className="flex flex-col gap-2 min-w-[220px] w-full md:w-auto">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Documents</p>
                    <div className="flex flex-col gap-1.5">
                      {[
                        { label: 'Resume / CV', url: selectedSubmission.resume_url },
                        { label: 'Aadhaar Card', url: selectedSubmission.aadhaar_file_url },
                        { label: 'PAN Card', url: selectedSubmission.pan_file_url },
                      ].map((doc) => {
                        if (!doc.url) {
                          return (
                            <div
                              key={doc.label}
                              className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/50 border border-slate-200 text-slate-400 font-medium text-xs shadow-sm"
                            >
                              <span className="flex items-center gap-2">
                                <FileText size={14} className="text-slate-400" />
                                {doc.label}
                              </span>
                              <span className="text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Missing
                              </span>
                            </div>
                          );
                        }
                        return (
                          <a
                            key={doc.label}
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-electric-600 hover:border-electric-500 transition-all font-medium text-xs shadow-sm group"
                          >
                            <span className="flex items-center gap-2">
                              <FileText size={14} className="text-electric-500" />
                              {doc.label}
                            </span>
                            <Download size={14} className="text-slate-400 group-hover:text-electric-500 transition-colors" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Section 1: Personal Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <Mail size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-xs text-white/35">Gender</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 capitalize">{selectedSubmission.gender || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Date of Birth</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">
                        {selectedSubmission.date_of_birth ? new Date(selectedSubmission.date_of_birth).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Mobile</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.mobile}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Personal Email</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 select-all">{selectedSubmission.personal_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">WhatsApp Number</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.alternate_number || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Marital Status</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 capitalize">{selectedSubmission.marital_status || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Nationality</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.nationality || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Blood Group</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 uppercase">{selectedSubmission.blood_group || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Addresses */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <MapPin size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Addresses</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-white/35">Current Address</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 leading-relaxed">
                        {selectedSubmission.current_address}<br />
                        {selectedSubmission.current_city}, {selectedSubmission.current_state} — {selectedSubmission.current_pincode}<br />
                        {selectedSubmission.current_country}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Permanent Address</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 leading-relaxed">
                        {selectedSubmission.permanent_address}<br />
                        {selectedSubmission.permanent_city}, {selectedSubmission.permanent_state} — {selectedSubmission.permanent_pincode}<br />
                        {selectedSubmission.permanent_country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Employment Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <Briefcase size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Employment details</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-xs text-white/35">Role Type</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 capitalize">{selectedSubmission.employee_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Department</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Designation</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.designation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Reporting Manager</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.reporting_manager || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Date of Joining</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">
                        {selectedSubmission.date_of_joining ? new Date(selectedSubmission.date_of_joining).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Work Location</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 capitalize">{selectedSubmission.work_location || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Employment Type</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 capitalize">{selectedSubmission.employment_type?.replace('-', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Education details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <GraduationCap size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Education</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-white/35">Highest Degree</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.highest_qualification}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-xs text-white/35">University/College</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.university}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/35">Passing Year & Score</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.year_of_passing} ({selectedSubmission.percentage})</p>
                      </div>
                    </div>

                    {/* Additional Education records */}
                    {selectedSubmission.additional_education && selectedSubmission.additional_education.length > 0 && (
                      <div className="pl-4 border-l border-white/5 mt-3 space-y-3">
                        <p className="text-xs font-semibold text-white/45 uppercase tracking-wider">Additional Qualifications</p>
                        {selectedSubmission.additional_education.map((edu, idx) => (
                          <div key={idx} className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div>
                              <p className="text-white/35">Degree</p>
                              <p className="text-white/70 mt-0.5 font-medium">{edu.qualification || '—'}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-white/35">Institution</p>
                              <p className="text-white/70 mt-0.5 font-medium">{edu.school || '—'}</p>
                            </div>
                            <div>
                              <p className="text-white/35">Year & Score</p>
                              <p className="text-white/70 mt-0.5 font-medium">{edu.year || '—'} ({edu.score || '—'})</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 5: Professional & Skills */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <Briefcase size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Professional Experience</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-3">
                    <div>
                      <p className="text-xs text-white/35">Years of Experience</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.years_of_experience || 'Fresher'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Previous Company</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.previous_company || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Previous Role</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.previous_designation || '—'}</p>
                    </div>
                  </div>

                  {/* Portfolio & LinkedIn */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    {selectedSubmission.linkedin && (
                      <a
                        href={selectedSubmission.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5]/10 text-[#0077b5] border border-[#0077b5]/20 font-medium hover:bg-[#0077b5]/20 transition-all"
                      >
                        LinkedIn Profile <ExternalLink size={12} />
                      </a>
                    )}
                    {selectedSubmission.portfolio && (
                      <a
                        href={selectedSubmission.portfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-electric-500/10 text-electric-300 border border-electric-500/20 font-medium hover:bg-electric-500/20 transition-all"
                      >
                        Portfolio / GitHub <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Skills tags */}
                  {selectedSubmission.skills && selectedSubmission.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-white/35 mb-1.5">Expertise & Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSubmission.skills.map(skill => (
                          <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 text-[11px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 6: Emergency Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <AlertCircle size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Emergency Contact</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-white/35">Contact Person</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.emergency_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Relationship</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.emergency_relationship}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/35">Mobile</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.emergency_mobile}</p>
                    </div>
                    {selectedSubmission.emergency_alternate && (
                      <div>
                        <p className="text-xs text-white/35">Alt Mobile</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.emergency_alternate}</p>
                      </div>
                    )}
                  </div>
                  {selectedSubmission.emergency_address && (
                    <div>
                      <p className="text-xs text-white/35">Emergency Address</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5 leading-relaxed">{selectedSubmission.emergency_address}</p>
                    </div>
                  )}
                </div>

                {/* Section 7: Banking Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <Landmark size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Bank Details</h3>
                  </div>
                  {selectedSubmission.account_number ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                      <div>
                        <p className="text-xs text-white/35">Account Holder Name</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.account_holder_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/35">Bank Name</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.bank_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/35">Branch Name</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.branch_name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/35">Account Number</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5 font-mono select-all">{selectedSubmission.account_number}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/35">IFSC Code</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5 font-mono select-all uppercase">{selectedSubmission.ifsc_code}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/35">UPI ID</p>
                        <p className="text-sm text-white/85 font-medium mt-0.5 select-all">{selectedSubmission.upi_id || '—'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-white/35 italic">No bank details provided.</p>
                  )}
                </div>

                {/* Section 8: Uploaded Files & Identity info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <FileText size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Uploaded files & Documents</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                    {selectedSubmission.aadhaar_number && (
                      <div>
                        <p className="text-white/35">Aadhaar Number</p>
                        <p className="text-white/85 font-medium mt-0.5 select-all">{selectedSubmission.aadhaar_number}</p>
                      </div>
                    )}
                    {selectedSubmission.pan_number && (
                      <div>
                        <p className="text-white/35">PAN Number</p>
                        <p className="text-white/85 font-medium mt-0.5 select-all uppercase">{selectedSubmission.pan_number}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Resume', url: selectedSubmission.resume_url },
                      { label: 'Aadhaar Card', url: selectedSubmission.aadhaar_file_url },
                      { label: 'PAN Card', url: selectedSubmission.pan_file_url },
                    ].map((doc) => {
                      if (!doc.url) {
                        return (
                          <div
                            key={doc.label}
                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/50 border border-slate-200 text-slate-400 font-medium text-xs shadow-sm"
                          >
                            <span className="flex items-center gap-2">
                              <FileText size={14} className="text-slate-400" />
                              {doc.label}
                            </span>
                            <span className="text-[10px] bg-slate-200/60 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                              Missing
                            </span>
                          </div>
                        );
                      }
                      return (
                        <a
                          key={doc.label}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-electric-600 hover:border-electric-500 hover:bg-slate-100 transition-all font-semibold text-xs group shadow-sm"
                        >
                          <span className="flex items-center gap-2">
                            <FileText size={14} className="text-electric-500" />
                            {doc.label}
                          </span>
                          <Download size={14} className="text-slate-400 group-hover:text-electric-500 transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Audit & Verification controls */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/80">
                    <ShieldCheck size={16} className="text-electric-400" />
                    <h3 className="font-display font-bold text-sm">Review & Admin Notes</h3>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Enter review comments, verify documents checklists, or add internal notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-electric-500 transition-all"
                  />

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    {selectedSubmission.status !== 'verified' && selectedSubmission.status !== 'onboarded' && (
                      <button
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'verified')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-1.5"
                      >
                        <UserCheck size={14} /> Approve & Verify
                      </button>
                    )}

                    {selectedSubmission.status === 'verified' && (
                      <button
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'onboarded')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-electric-600 to-cyan-600 text-white font-semibold text-xs shadow-lg hover:shadow-electric-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center gap-1.5"
                      >
                        <UserCheck size={14} /> Complete Onboarding
                      </button>
                    )}

                    {selectedSubmission.status !== 'rejected' && (
                      <button
                        disabled={updating}
                        onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                      >
                        <UserX size={14} /> Reject Registration
                      </button>
                    )}
                  </div>
                </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && candidateToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-[#020813]/85 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#091122] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6 text-center z-10"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <Trash2 size={24} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Delete Candidate Profile?</h3>
                <p className="text-xs text-white/55 leading-relaxed font-sans">
                  Are you sure you want to delete <span className="font-semibold text-white">{candidateToDelete.full_name}</span>? 
                  All profile details, registration data, and uploaded documents will be permanently erased. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  disabled={updating}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white/70 text-xs font-semibold transition-all flex-1"
                >
                  Cancel
                </button>
                <button
                  disabled={updating}
                  onClick={executeDeleteSubmission}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all flex-1 shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5"
                >
                  {updating ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
