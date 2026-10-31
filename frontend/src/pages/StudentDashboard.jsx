import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Calendar, 
  ChevronRight,
  Inbox
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import ComplaintModal from '../components/ComplaintModal';

export default function StudentDashboard({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.complaints.getAll({
        status: statusFilter,
        category: categoryFilter,
        search
      });
      if (res.success) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Error fetching student complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const handleCreateComplaint = async (data) => {
    await api.complaints.create(data);
    await fetchComplaints();
  };

  // Metrics calculations
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sky-300">
            Student Service Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-sky-100/90 mt-1">
            Registration: {user?.registrationNumber || 'N/A'} • {user?.department}
          </p>
        </div>

        <button
          onClick={() => {
            setModalMode('create');
            setSelectedComplaint(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-sky-800 hover:bg-sky-50 font-bold text-sm shadow-lg hover:shadow-xl transition transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5 text-sky-600" />
          <span>Submit New Complaint</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Complaints</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <div className="text-xs text-amber-700 font-semibold uppercase flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm">
          <div className="text-xs text-blue-700 font-semibold uppercase flex items-center gap-1">
            <Loader2 className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </div>
          <div className="text-2xl font-black text-blue-900 mt-1">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <div className="text-xs text-emerald-700 font-semibold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{resolvedCount}</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket, building, title..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="All">All Categories</option>
            <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
            <option value="Laboratory Equipment">Laboratory Equipment</option>
            <option value="Classroom & Projector">Classroom & Projector</option>
            <option value="Electricity & Power">Electricity & Power</option>
            <option value="Hostel & Maintenance">Hostel & Maintenance</option>
            <option value="Sanitation & Water">Sanitation & Water</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Complaints List / Table */}
      {loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your complaint tickets...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No complaints found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't submitted any complaints matching the selected filters. Use the "Submit New Complaint" button above to lodge an issue.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {complaints.map((comp) => (
            <div
              key={comp._id}
              onClick={() => {
                setSelectedComplaint(comp);
                setModalMode('view');
                setModalOpen(true);
              }}
              className="p-4 sm:p-5 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {comp.ticketId}
                  </span>
                  <StatusBadge status={comp.status} />
                  <PriorityBadge priority={comp.priority} />
                  <CategoryBadge category={comp.category} />
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {comp.title}
                </h4>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {comp.location?.building} • {comp.location?.roomOrArea}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(comp.createdAt).toLocaleDateString()}
                  </span>
                  {comp.assignedTo && (
                    <span className="font-medium text-emerald-700">
                      Assigned: {comp.assignedTo.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1">
                  Track Details
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <ComplaintModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        complaint={selectedComplaint}
        currentUser={user}
        onSubmit={handleCreateComplaint}
      />
    </div>
  );
}

