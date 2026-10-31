import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  FileText,
  ChevronRight,
  Inbox,
  Loader2
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import ComplaintModal from '../components/ComplaintModal';

export default function StaffDashboard({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchAssignedComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.complaints.getAll({
        status: statusFilter,
        search
      });
      if (res.success) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Error fetching assigned complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedComplaints();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAssignedComplaints();
  };

  const handleUpdateComplaint = async (id, data) => {
    await api.complaints.update(id, data);
    await fetchAssignedComplaints();
  };

  // Quick 1-click status change
  const handleQuickStatusChange = async (comp, newStatus) => {
    let resolutionRemarks = comp.resolutionRemarks;
    if (newStatus === 'Resolved') {
      const promptRemarks = window.prompt('Please enter resolution remarks for this complaint:', 'Work completed and verified.');
      if (!promptRemarks) return;
      resolutionRemarks = promptRemarks;
    }

    try {
      await api.complaints.update(comp._id, {
        status: newStatus,
        resolutionRemarks,
        newRemark: `Status updated to ${newStatus} by ${user?.name}`
      });
      await fetchAssignedComplaints();
    } catch (err) {
      alert(err.message || 'Error updating status');
    }
  };

  // Metrics
  const totalAssigned = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Staff Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-300">
              Campus Field Maintenance & Engineering
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Assigned Work Orders
          </h1>
          <p className="text-sm text-emerald-100/90 mt-1">
            Officer: {user?.name} • Division: {user?.department}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2 rounded-xl">
          <Wrench className="w-5 h-5 text-emerald-300" />
          <div className="text-xs">
            <div className="font-semibold text-white">Active Dispatch Queue</div>
            <div className="text-emerald-200">{inProgressCount + pendingCount} tasks awaiting resolution</div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Assigned</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalAssigned}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <div className="text-xs text-amber-700 font-semibold uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Dispatch</span>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <div className="text-xs text-blue-700 font-semibold uppercase flex items-center gap-1">
            <Loader2 className="w-3.5 h-3.5" />
            <span>Under Repair (In Progress)</span>
          </div>
          <div className="text-2xl font-black text-blue-900 mt-1">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <div className="text-xs text-emerald-700 font-semibold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed & Closed</span>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket, building, keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Task Cards */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your assigned maintenance tickets...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No tasks currently assigned</h3>
          <p className="text-xs text-slate-500 mt-1">
            You're all caught up! New complaints assigned by the campus administrator will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {complaints.map((comp) => (
            <div
              key={comp._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    {comp.ticketId}
                  </span>
                  <StatusBadge status={comp.status} />
                  <PriorityBadge priority={comp.priority} />
                  <CategoryBadge category={comp.category} />
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reported: {new Date(comp.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{comp.title}</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {comp.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Target Location: </span>
                    <span className="text-slate-600">{comp.location?.building} • {comp.location?.roomOrArea}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800">Reported by: </span>
                    <span className="text-slate-600">{comp.submittedBy?.name} ({comp.submittedBy?.department || 'Student'})</span>
                  </div>
                </div>
              </div>

              {/* Resolution Remarks Display */}
              {comp.resolutionRemarks && (
                <div className="text-xs bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-emerald-800">
                  <span className="font-bold">Resolution Remarks: </span>
                  {comp.resolutionRemarks}
                </div>
              )}

              {/* Action Buttons for Staff */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  {comp.status === 'Pending' && (
                    <button
                      onClick={() => handleQuickStatusChange(comp, 'In Progress')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                    >
                      Start Work (Mark In Progress)
                    </button>
                  )}

                  {comp.status === 'In Progress' && (
                    <button
                      onClick={() => handleQuickStatusChange(comp, 'Resolved')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved
                    </button>
                  )}

                  {comp.status === 'Resolved' && (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Ticket Closed
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedComplaint(comp);
                    setModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Update Details & Notes
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding remarks & detailed status update */}
      <ComplaintModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="update"
        complaint={selectedComplaint}
        currentUser={user}
        onUpdate={handleUpdateComplaint}
      />
    </div>
  );
}

