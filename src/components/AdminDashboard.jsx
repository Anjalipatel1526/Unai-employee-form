import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle2, AlertCircle, XCircle, Search, 
  ArrowLeft, Download, ShieldCheck, Mail, Phone, Calendar, 
  MapPin, Briefcase, GraduationCap, FileText, Landmark,
  ExternalLink, UserCheck, UserX, UserMinus, Plus
} from 'lucide-react';
import { getAllSubmissions, updateSubmissionStatus } from '../lib/formService';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
};

export default function AdminDashboard({ onBack }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

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
    fetchSubmissions();
  }, []);

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
          { label: 'Total Enrolled', value: totalCount, icon: Users, color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20' },
          { label: 'Pending Review', value: pendingCount, icon: AlertCircle, color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/20' },
          { label: 'Active / Verified', value: verifiedCount, icon: CheckCircle2, color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/20' },
          { label: 'Team Breakdown', value: `${employeeCount} E / ${internCount} I`, icon: ShieldCheck, color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-5 rounded-2xl border bg-gradient-to-br ${stat.color} flex items-center justify-between backdrop-blur-md`}
          >
            <div>
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black font-display text-white mt-1">{stat.value}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <stat.icon size={20} className={stat.color.split(' ')[2]} />
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
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-all"
                >
                  Close Panel
                </button>
              </div>

              {/* Modal content body */}
              <div className="p-6 space-y-8 flex-1">
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

                {/* Section 1: Personal Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-electric-400 border-b border-white/5 pb-2">
                    <Mail size={16} />
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-white/80">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-xs text-white/35">Preferred Name</p>
                      <p className="text-sm text-white/85 font-medium mt-0.5">{selectedSubmission.preferred_name || '—'}</p>
                    </div>
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
                      <p className="text-xs text-white/35">Alternate Contact</p>
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
                      if (!doc.url) return null;
                      return (
                        <a
                          key={doc.label}
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium text-xs group"
                        >
                          <span className="flex items-center gap-2">
                            <FileText size={14} className="text-electric-400" />
                            {doc.label}
                          </span>
                          <Download size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
