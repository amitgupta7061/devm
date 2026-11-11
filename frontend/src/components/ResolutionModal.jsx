import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function ResolutionModal({
  isOpen,
  complaintTitle = '',
  onResolve,
  onClose
}) {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setRemarks('');
      setError('');
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setError('Please provide resolution details before closing the ticket.');
      return;
    }
    onResolve(remarks.trim());
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resolution-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 transform transition-all animate-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 id="resolution-modal-title" className="text-sm font-bold text-slate-900">
                  Mark Complaint Resolved
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                  {complaintTitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="resolution-remarks-input" className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Resolution Remarks *
              </label>
              <textarea
                id="resolution-remarks-input"
                ref={inputRef}
                rows={3}
                required
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Replaced damaged fiber patch cord and tested connection speed (100Mbps OK)."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {error && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{error}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
              >
                Submit & Close Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

