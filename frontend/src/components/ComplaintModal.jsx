import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Building,
  ShieldCheck,
  Wrench
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

export default function ComplaintModal({ 
  isOpen, 
  onClose, 
  mode = 'view', // 'view', 'create', 'update'
  complaint = null,
  currentUser,
  staffList = [],
  onSubmit,
  onUpdate 
}) {
  if (!isOpen) return null;

  // New Complaint Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wi-Fi / Internet',
    priority: 'Medium',
    building: '',
    roomOrArea: '',
    description: ''
  });

  // Update State (for Admin & Staff)
  const [updateStatus, setUpdateStatus] = useState(complaint?.status || 'Pending');
  const [updatePriority, setUpdatePriority] = useState(complaint?.priority || 'Medium');
  const [updateAssignedTo, setUpdateAssignedTo] = useState(complaint?.assignedTo?._id || '');
  const [resolutionRemarks, setResolutionRemarks] = useState(complaint?.resolutionRemarks || '');
  const [newRemarkText, setNewRemarkText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.building || !formData.roomOrArea || !formData.description) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await onSubmit({
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        location: {
          building: formData.building,
          roomOrArea: formData.roomOrArea
        },
        description: formData.description
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error submitting complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        status: updateStatus,
        priority: updatePriority,
        assignedTo: updateAssignedTo || null,
        resolutionRemarks,
        newRemark: newRemarkText.trim() ? newRemarkText.trim() : undefined
      };
      await onUpdate(complaint._id, payload);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Error updating complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-lg">
              {mode === 'create' ? 'Submit New Campus Complaint' : `Ticket ${complaint?.ticketId || 'Details'}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ===================== CREATE MODE ===================== */}
        {mode === 'create' && (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Projector bulb blown in Lecture Hall 402"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                >
                  <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                  <option value="Laboratory Equipment">Laboratory Equipment</option>
                  <option value="Classroom & Projector">Classroom & Projector</option>
                  <option value="Electricity & Power">Electricity & Power</option>
                  <option value="Hostel & Maintenance">Hostel & Maintenance</option>
                  <option value="Sanitation & Water">Sanitation & Water</option>
                  <option value="Security & Access">Security & Access</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Priority Level *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                >
                  <option value="Low">Low (General suggestion/routine)</option>
                  <option value="Medium">Medium (Affects normal task)</option>
                  <option value="High">High (Impacting ongoing classes)</option>
                  <option value="Urgent">Urgent (Safety / Critical lab failure)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Campus Block / Building *
                </label>
                <input
                  type="text"
                  required
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  placeholder="e.g. Block 34 (Academic) or Hostel 6"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Room / Area identifier *
                </label>
                <input
                  type="text"
                  required
                  value={formData.roomOrArea}
                  onChange={(e) => setFormData({ ...formData, roomOrArea: e.target.value })}
                  placeholder="e.g. Room 402, Lab 601, Washroom 2F"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide accurate details so the maintenance team can troubleshoot quickly..."
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Register Complaint'}
              </button>
            </div>
          </form>
        )}

        {/* ===================== VIEW & UPDATE MODE ===================== */}
        {mode !== 'create' && complaint && (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
                <CategoryBadge category={complaint.category} />
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(complaint.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">{complaint.title}</h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-100 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Location & Requester Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-sky-50/60 p-3.5 rounded-lg border border-sky-100">
              <div className="space-y-1">
                <div className="font-semibold text-sky-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Location</span>
                </div>
                <div className="text-slate-700">{complaint.location?.building}</div>
                <div className="text-slate-500 font-medium">Room / Area: {complaint.location?.roomOrArea}</div>
              </div>

              <div className="space-y-1">
                <div className="font-semibold text-sky-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Submitted By</span>
                </div>
                <div className="text-slate-700 font-medium">{complaint.submittedBy?.name}</div>
                <div className="text-slate-500">
                  {complaint.submittedBy?.registrationNumber || complaint.submittedBy?.email}
                </div>
              </div>
            </div>

            {/* Assigned Staff Card */}
            <div className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Assigned Maintenance Staff</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {complaint.assignedTo?.name || 'Unassigned (Awaiting Admin Dispatch)'}
                  </div>
                  {complaint.assignedTo?.department && (
                    <div className="text-xs text-slate-500">{complaint.assignedTo.department}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Note if resolved */}
            {complaint.resolutionRemarks && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resolution Details</span>
                </div>
                <p className="text-emerald-800">{complaint.resolutionRemarks}</p>
                {complaint.resolvedAt && (
                  <p className="text-emerald-600 text-[11px]">
                    Resolved on: {new Date(complaint.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Activity History / Remarks Timeline */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                <span>Remarks & Updates ({complaint.remarks?.length || 0})</span>
              </h5>
              
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {complaint.remarks && complaint.remarks.length > 0 ? (
                  complaint.remarks.map((rem, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                        <span className="font-semibold text-slate-700">
                          {rem.userName} ({rem.userRole})
                        </span>
                        <span>{new Date(rem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-700">{rem.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes recorded yet.</p>
                )}
              </div>
            </div>

            {/* ===================== ADMIN / STAFF CONTROLS ===================== */}
            {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
              <form onSubmit={handleUpdateSubmit} className="pt-4 border-t border-slate-200 space-y-3 bg-slate-50 -mx-6 -mb-6 p-6">
                <h5 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Update Status & Management Actions</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                      Status
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      {currentUser.role === 'admin' && <option value="Rejected">Rejected</option>}
                    </select>
                  </div>

                  {currentUser.role === 'admin' && (
                    <>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Priority
                        </label>
                        <select
                          value={updatePriority}
                          onChange={(e) => setUpdatePriority(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Urgent">Urgent</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                          Assign Staff
                        </label>
                        <select
                          value={updateAssignedTo}
                          onChange={(e) => setUpdateAssignedTo(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="">-- Unassigned --</option>
                          {staffList.map((st) => (
                            <option key={st._id} value={st._id}>
                              {st.name} ({st.department})
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* If marking as Resolved, show resolution remarks */}
                {updateStatus === 'Resolved' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 uppercase mb-1">
                      Resolution Remarks (Required for closing ticket)
                    </label>
                    <input
                      type="text"
                      value={resolutionRemarks}
                      onChange={(e) => setResolutionRemarks(e.target.value)}
                      placeholder="e.g. Replaced faulty cable, tested connectivity 100Mbps OK"
                      className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-md focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {/* Add new comment */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Add Work Log Remark / Note
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRemarkText}
                      onChange={(e) => setNewRemarkText(e.target.value)}
                      placeholder="Add an update note for this complaint..."
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Updates'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

