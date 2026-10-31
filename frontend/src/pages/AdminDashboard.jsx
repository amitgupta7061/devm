import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart3, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  UserCheck, 
  Layers, 
  Wrench, 
  Calendar, 
  Trash2, 
  Edit3, 
  TrendingUp,
  Shield,
  Loader2,
  PieChart,
  Activity,
  Flame
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CategoryBadge from '../components/CategoryBadge';
import ComplaintModal from '../components/ComplaintModal';
import { DonutChart, ProgressBarGroup, VelocityAreaChart, RadialGauge } from '../components/Charts';

export default function AdminDashboard({ user }) {
  const [activeSubTab, setActiveSubTab] = useState('stats'); // default to 'stats' or 'complaints'
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [compRes, statsRes, staffRes] = await Promise.all([
        api.complaints.getAll({
          status: statusFilter,
          category: categoryFilter,
          priority: priorityFilter,
          search
        }),
        api.stats.getDashboard(),
        api.users.getStaff()
      ]);

      if (compRes.success) setComplaints(compRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (staffRes.success) setStaffList(staffRes.data);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.users.getAll();
      if (res.success) setUsersList(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, categoryFilter, priorityFilter]);

  useEffect(() => {
    if (activeSubTab === 'users') {
      fetchUsers();
    }
  }, [activeSubTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDashboardData();
  };

  const handleUpdateComplaint = async (id, data) => {
    await api.complaints.update(id, data);
    await fetchDashboardData();
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this complaint ticket?')) {
      try {
        await api.complaints.delete(id);
        await fetchDashboardData();
      } catch (err) {
        alert(err.message || 'Error deleting ticket');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.users.updateRole(userId, { role: newRole });
      await fetchUsers();
      await fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Error updating user role');
    }
  };

  // Color mapping helper for charts
  const categoryColors = {
    'Wi-Fi / Internet': '#3b82f6',
    'Laboratory Equipment': '#a855f7',
    'Classroom & Projector': '#6366f1',
    'Electricity & Power': '#f59e0b',
    'Hostel & Maintenance': '#10b981',
    'Sanitation & Water': '#06b6d4',
    'Other': '#64748b'
  };

  const categoryChartData = stats?.categoryBreakdown?.map(item => ({
    label: item.category,
    value: item.count,
    color: categoryColors[item.category] || '#94a3b8'
  })) || [];

  const priorityColors = {
    'Urgent': '#ef4444',
    'High': '#f97316',
    'Medium': '#eab308',
    'Low': '#64748b'
  };

  const priorityChartData = stats?.priorityBreakdown?.map(item => ({
    label: item.priority,
    value: item.count,
    color: priorityColors[item.priority] || '#94a3b8'
  })) || [];

  const resolutionRate = stats?.summary?.total > 0
    ? Math.round((stats.summary.resolved / stats.summary.total) * 100)
    : 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header with Gradient Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
              Campus Operations & Administration
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-bold">
              Full Administrator Privileges
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
            Campus Service Analytics & Management Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Logged in as {user?.name} ({user?.department})
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'stats'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Analytics</span>
          </button>
          <button
            onClick={() => setActiveSubTab('complaints')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'complaints'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Tickets ({complaints.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeSubTab === 'users'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Directory</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Tickets</div>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.summary.total}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Across all campus blocks</div>
            <div className="absolute right-3 bottom-3 text-slate-100 -z-0">
              <Layers className="w-10 h-10" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
            <div className="text-[11px] font-bold text-amber-700 uppercase flex items-center gap-1 tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Action</span>
            </div>
            <div className="text-3xl font-black text-amber-900 mt-1">{stats.summary.pending}</div>
            <div className="text-[11px] text-amber-600 mt-0.5">Awaiting staff dispatch</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm">
            <div className="text-[11px] font-bold text-blue-700 uppercase flex items-center gap-1 tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>In Progress</span>
            </div>
            <div className="text-3xl font-black text-blue-900 mt-1">{stats.summary.inProgress}</div>
            <div className="text-[11px] text-blue-600 mt-0.5">Field work underway</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
            <div className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1 tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </div>
            <div className="text-3xl font-black text-emerald-900 mt-1">{stats.summary.resolved}</div>
            <div className="text-[11px] text-emerald-600 mt-0.5">Successfully closed</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/30 shadow-sm col-span-2 lg:col-span-1">
            <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Avg Turnaround</div>
            <div className="text-3xl font-black text-purple-900 mt-1">
              {stats.summary.avgResolutionHours} <span className="text-base font-semibold">hrs</span>
            </div>
            <div className="text-[11px] text-purple-600 mt-0.5">Mean time to resolve</div>
          </div>
        </div>
      )}

      {/* ===================== TAB 1: VISUAL ANALYTICS & CHARTS ===================== */}
      {activeSubTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Row 1: Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Donut Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-sky-600" />
                  <span>Category Distribution Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Proportion of grievances across campus systems</p>
              </div>

              <div className="py-2 flex items-center justify-center">
                <DonutChart data={categoryChartData} totalLabel="Tickets" size={190} strokeWidth={24} />
              </div>
            </div>

            {/* Priority Progress Groups */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Priority Escalation Matrix</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Urgency tier distribution of reported issues</p>
              </div>

              <ProgressBarGroup items={priorityChartData.map(p => ({
                label: p.label,
                value: p.value,
                color: p.color
              }))} />

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Critical Priority Queue:</span>
                <span className="font-bold text-red-600">
                  {stats.priorityBreakdown.find(p => p.priority === 'Urgent')?.count || 0} Urgent Tickets
                </span>
              </div>
            </div>

            {/* Resolution Velocity & SLA Gauge */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>7-Day Resolution Velocity & SLA</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Weekly ticket turnaround trend</p>
              </div>

              <VelocityAreaChart data={[8, 14, 11, 22, 19, 28, 24]} height={110} />

              <div className="pt-3 border-t border-slate-100 flex items-center justify-around">
                <RadialGauge value={resolutionRate} label="Resolution Rate" color="#10b981" size={100} />
                <RadialGauge value={96} label="SLA Compliance" color="#3b82f6" size={100} />
              </div>
            </div>
          </div>

          {/* Row 2: Staff Workload Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-600" />
              <span>Maintenance Field Engineers Active Workload & Dispatch Distribution</span>
            </h3>

            {stats.staffWorkload.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No tickets currently assigned to staff.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.staffWorkload.map((staff) => (
                  <div key={staff.staffId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition">
                    <div className="font-bold text-sm text-slate-900">{staff.staffName}</div>
                    <div className="text-xs text-slate-500 mb-3">{staff.department}</div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${Math.min(staff.activeTasks * 25, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-amber-700">Active Tasks: {staff.activeTasks}</span>
                      <span className="text-slate-600">Total Lifetime: {staff.totalAssigned}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: ALL COMPLAINTS TABLE ===================== */}
      {activeSubTab === 'complaints' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket, building, reporter..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                <option value="Laboratory Equipment">Laboratory Equipment</option>
                <option value="Classroom & Projector">Classroom & Projector</option>
                <option value="Electricity & Power">Electricity & Power</option>
                <option value="Hostel & Maintenance">Hostel & Maintenance</option>
                <option value="Sanitation & Water">Sanitation & Water</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Loading complaints registry...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
              No complaint tickets match your query criteria.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Ticket ID</th>
                      <th className="px-4 py-3">Title & Location</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Priority</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Assigned Staff</th>
                      <th className="px-4 py-3">Student Reporter</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complaints.map((comp) => (
                      <tr key={comp._id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3 font-mono font-bold text-sky-700">
                          {comp.ticketId}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-semibold text-slate-900 truncate">{comp.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {comp.location?.building} • {comp.location?.roomOrArea}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <CategoryBadge category={comp.category} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={comp.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={comp.status} />
                        </td>
                        <td className="px-4 py-3">
                          {comp.assignedTo ? (
                            <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {comp.assignedTo.name}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{comp.submittedBy?.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {comp.submittedBy?.registrationNumber || comp.submittedBy?.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedComplaint(comp);
                              setModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition"
                            title="Manage Ticket & Assign Staff"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteComplaint(comp._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: USER & STAFF DIRECTORY ===================== */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Registered Students, Staff & Administrators</span>
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Total Users: {usersList.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">ID / Reg Number</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Role Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-600">{u.department}</td>
                    <td className="px-4 py-3 text-slate-500">{u.registrationNumber || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'staff' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Details & Assignment Modal */}
      <ComplaintModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode="update"
        complaint={selectedComplaint}
        currentUser={user}
        staffList={staffList}
        onUpdate={handleUpdateComplaint}
      />
    </div>
  );
}
