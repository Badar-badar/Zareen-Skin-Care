import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Sliders,
  Coffee,
  CalendarOff,
  AlertTriangle,
  Sparkles,
  Save,
} from 'lucide-react';
import Button from '../../components/ui/Button';

let blockedIdCounter = 100;
const generateBlockedDateId = () => {
  blockedIdCounter += 1;
  return `blk-${blockedIdCounter}`;
};

export const SpecialistAvailabilityPage = () => {
  // Weekly Schedule State (Monday - Sunday) with breaks
  const [schedule, setSchedule] = useState({
    Monday: { enabled: true, start: '08:30', end: '17:30', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
    Tuesday: { enabled: true, start: '08:30', end: '17:30', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
    Wednesday: { enabled: true, start: '09:00', end: '18:00', hasBreak: true, breakStart: '13:30', breakEnd: '14:30' },
    Thursday: { enabled: true, start: '08:30', end: '17:30', hasBreak: true, breakStart: '13:00', breakEnd: '14:00' },
    Friday: { enabled: true, start: '09:00', end: '16:00', hasBreak: false, breakStart: '12:30', breakEnd: '13:00' },
    Saturday: { enabled: true, start: '09:30', end: '13:30', hasBreak: false, breakStart: '12:00', breakEnd: '12:30' },
    Sunday: { enabled: false, start: '09:00', end: '17:00', hasBreak: false, breakStart: '13:00', breakEnd: '14:00' },
  });

  // Buffer Time
  const [bufferTime, setBufferTime] = useState('15 mins');
  const [advanceWindow, setAdvanceWindow] = useState('60 Days');

  // Blocked Dates / Time Off State
  const [blockedDates, setBlockedDates] = useState([
    {
      id: 'blk-1',
      title: 'Annual Dermatology Summit (FAAD)',
      startDate: '2026-10-14',
      endDate: '2026-10-17',
      reason: 'Medical Conference Attendance',
    },
    {
      id: 'blk-2',
      title: 'Thanksgiving Clinic Holiday',
      startDate: '2026-11-26',
      endDate: '2026-11-27',
      reason: 'National Holiday Closure',
    },
  ]);

  // Blocked Date Modal State
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [newBlockedTitle, setNewBlockedTitle] = useState('');
  const [newBlockedStart, setNewBlockedStart] = useState('');
  const [newBlockedEnd, setNewBlockedEnd] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Delete confirmation for blocked date
  const [blockedDateToDelete, setBlockedDateToDelete] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Day toggle
  const toggleDay = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  // Day time handler
  const handleTimeChange = (day, field, val) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: val },
    }));
  };

  // Toggle break for a day
  const toggleBreak = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], hasBreak: !prev[day].hasBreak },
    }));
  };

  // Add Blocked Date
  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockedTitle || !newBlockedStart) return;

    const newEntry = {
      id: generateBlockedDateId(),
      title: newBlockedTitle,
      startDate: newBlockedStart,
      endDate: newBlockedEnd || newBlockedStart,
      reason: newBlockedReason || 'Scheduled Time Off',
    };

    setBlockedDates((prev) => [newEntry, ...prev]);
    setIsBlockedModalOpen(false);
    setNewBlockedTitle('');
    setNewBlockedStart('');
    setNewBlockedEnd('');
    setNewBlockedReason('');
    showToast(`Blocked date "${newEntry.title}" added to calendar.`);
  };

  // Delete Blocked Date
  const handleConfirmDeleteBlockedDate = () => {
    if (!blockedDateToDelete) return;
    setBlockedDates((prev) => prev.filter((d) => d.id !== blockedDateToDelete.id));
    showToast(`Blocked date "${blockedDateToDelete.title}" removed.`);
    setBlockedDateToDelete(null);
  };

  // Save Schedule
  const handleSaveSchedule = () => {
    showToast('Weekly schedule and availability preferences saved successfully!');
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex items-center gap-3 text-xs border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Real-Time Calendar Synchronizer</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Availability & Working Hours
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Configure your standard weekly opening hours, lunch breaks, slot buffer intervals, and blackout dates.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Save}
          onClick={handleSaveSchedule}
          className="shadow-md shadow-teal-600/20"
        >
          Save Availability
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 1. APPOINTMENT BUFFER & BOOKING SETTINGS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Buffer Time Selector */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Buffer Between Appointments</h3>
          </div>
          <p className="text-xs text-slate-500">
            Automatic preparation time added after each consultation to prevent schedule overruns.
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {['None (0m)', '10 mins', '15 mins', '20 mins', '30 mins'].map((buf) => (
              <button
                key={buf}
                type="button"
                onClick={() => setBufferTime(buf)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  bufferTime === buf
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {buf}
              </button>
            ))}
          </div>
        </div>

        {/* Max Advance Booking Window */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Advance Booking Window</h3>
          </div>
          <p className="text-xs text-slate-500">
            How far into the future patients can view and book open consultation slots.
          </p>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {['14 Days', '30 Days', '60 Days', '90 Days'].map((win) => (
              <button
                key={win}
                type="button"
                onClick={() => setAdvanceWindow(win)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  advanceWindow === win
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {win}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. WEEKLY WORKING HOURS TABLE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Weekly Consultation Hours
            </h2>
            <p className="text-xs text-slate-500">
              Set standard working hours and optional mid-day breaks for each day of the week.
            </p>
          </div>

          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            Auto-Sync Enabled
          </span>
        </div>

        <div className="space-y-3">
          {Object.entries(schedule).map(([day, config]) => (
            <div
              key={day}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                config.enabled
                  ? 'bg-white border-slate-200/80 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-200/40 opacity-55'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Day Toggle */}
                <div className="flex items-center gap-3 min-w-[130px]">
                  <input
                    type="checkbox"
                    id={`day-${day}`}
                    checked={config.enabled}
                    onChange={() => toggleDay(day)}
                    className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-600 cursor-pointer"
                  />
                  <label htmlFor={`day-${day}`} className="text-sm font-bold text-slate-900 cursor-pointer">
                    {day}
                  </label>
                </div>

                {config.enabled ? (
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    {/* Working Hours */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Start:</span>
                        <input
                          type="time"
                          value={config.start}
                          onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
                        />
                      </div>
                      <span className="text-slate-400">—</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">End:</span>
                        <input
                          type="time"
                          value={config.end}
                          onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
                        />
                      </div>
                    </div>

                    {/* Break Switch & Inputs */}
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                      <Coffee className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <button
                        type="button"
                        onClick={() => toggleBreak(day)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                          config.hasBreak
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {config.hasBreak ? 'Break Active' : '+ Add Break'}
                      </button>

                      {config.hasBreak && (
                        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                          <input
                            type="time"
                            value={config.breakStart}
                            onChange={(e) => handleTimeChange(day, 'breakStart', e.target.value)}
                            className="px-1.5 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
                          />
                          <span className="text-slate-400">-</span>
                          <input
                            type="time"
                            value={config.breakEnd}
                            onChange={(e) => handleTimeChange(day, 'breakEnd', e.target.value)}
                            className="px-1.5 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic font-medium py-1">
                    Closed / Day Off (No online booking slots generated)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BLOCKED DATES & BLACKOUT TIME OFF */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Blocked Dates & Clinic Time Off
            </h2>
            <p className="text-xs text-slate-500">
              Black out specific holiday dates, vacation periods, or medical conference leaves.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={() => setIsBlockedModalOpen(true)}
          >
            Block New Dates
          </Button>
        </div>

        {blockedDates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blockedDates.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition-all flex items-start justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CalendarOff className="w-4 h-4 text-amber-600 shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  </div>

                  <p className="text-xs font-semibold text-teal-800">
                    {item.startDate} {item.endDate && item.endDate !== item.startDate ? `to ${item.endDate}` : ''}
                  </p>

                  <p className="text-[11px] text-slate-500">Reason: {item.reason}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setBlockedDateToDelete(item)}
                  aria-label={`Remove blackout date ${item.title}`}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <CalendarOff className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-800">No Blocked Dates Scheduled</p>
            <p className="text-[11px] text-slate-500">
              All dates follow your standard weekly consultation hours.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD BLOCKED DATE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBlockedModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBlockedModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CalendarOff className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-bold text-slate-900">Block Dates on Calendar</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBlockedModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleAddBlockedDate} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="blocked-title" className="block text-xs font-semibold text-slate-700">
                    Event / Time-Off Title
                  </label>
                  <input
                    id="blocked-title"
                    type="text"
                    required
                    value={newBlockedTitle}
                    onChange={(e) => setNewBlockedTitle(e.target.value)}
                    placeholder="e.g. Winter Holiday Leave"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="blocked-start" className="block text-xs font-semibold text-slate-700">
                      Start Date
                    </label>
                    <input
                      id="blocked-start"
                      type="date"
                      required
                      value={newBlockedStart}
                      onChange={(e) => setNewBlockedStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="blocked-end" className="block text-xs font-semibold text-slate-700">
                      End Date
                    </label>
                    <input
                      id="blocked-end"
                      type="date"
                      value={newBlockedEnd}
                      onChange={(e) => setNewBlockedEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="blocked-reason" className="block text-xs font-semibold text-slate-700">
                    Reason / Notes
                  </label>
                  <input
                    id="blocked-reason"
                    type="text"
                    value={newBlockedReason}
                    onChange={(e) => setNewBlockedReason(e.target.value)}
                    placeholder="e.g. Personal leave, Annual checkup, Clinic closure"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsBlockedModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    Block Dates
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DELETE BLOCKED DATE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {blockedDateToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBlockedDateToDelete(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Unblock These Dates?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Removing <strong>&ldquo;{blockedDateToDelete.title}&rdquo;</strong> will reopen these dates for patient online bookings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setBlockedDateToDelete(null)}
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteBlockedDate}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
                >
                  Yes, Unblock
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialistAvailabilityPage;
