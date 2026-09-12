import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  FileText,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockSpecialistAppointments } from '../../data/appointments';

export const SpecialistCalendarPage = () => {
  const [calendarView, setCalendarView] = useState('week'); // 'month' | 'week' | 'day'
  const [selectedDateStr, setSelectedDateStr] = useState('2026-09-09'); // Selected date in YYYY-MM-DD
  const [selectedAppointment, setSelectedAppointment] = useState(null); // For Details Modal

  // Month days for September 2026 (Starts on Tuesday Sep 1)
  const monthDays = useMemo(() => {
    // Generate 30 days for September 2026
    const days = [];
    for (let i = 1; i <= 30; i++) {
      const dayFormatted = i < 10 ? `0${i}` : `${i}`;
      const dateStr = `2026-09-${dayFormatted}`;
      const dayOfWeek = new Date(`2026-09-${dayFormatted}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
      });
      const apts = mockSpecialistAppointments.filter((a) => a.dateStr === dateStr);
      days.push({
        dayNum: i,
        dateStr,
        dayOfWeek,
        appointments: apts,
        isToday: dateStr === '2026-09-09',
      });
    }
    return days;
  }, []);

  // Week days for Sep 7 - Sep 13
  const weekDays = useMemo(() => {
    return [
      { day: 'Mon', date: '7', dateStr: '2026-09-07' },
      { day: 'Tue', date: '8', dateStr: '2026-09-08' },
      { day: 'Wed', date: '9', dateStr: '2026-09-09', isToday: true },
      { day: 'Thu', date: '10', dateStr: '2026-09-10' },
      { day: 'Fri', date: '11', dateStr: '2026-09-11' },
      { day: 'Sat', date: '12', dateStr: '2026-09-12' },
      { day: 'Sun', date: '13', dateStr: '2026-09-13', isClosed: true },
    ];
  }, []);

  // Time hours from 08:00 to 18:00
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  const selectedDayAppointments = useMemo(() => {
    return mockSpecialistAppointments.filter((a) => a.dateStr === selectedDateStr);
  }, [selectedDateStr]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Clinic Schedule Master</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Appointment Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive schedule viewer with live patient consultation slots.
          </p>
        </div>

        {/* View Switcher & Date Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Month / Week / Day Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
            {['month', 'week', 'day'].map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setCalendarView(view)}
                className={`px-3.5 py-1.5 rounded-xl capitalize transition-all ${
                  calendarView === view
                    ? 'bg-white text-teal-800 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
            <button
              type="button"
              onClick={() => setSelectedDateStr('2026-09-09')}
              className="px-2.5 py-1 text-slate-600 hover:text-teal-700 font-semibold"
            >
              Today
            </button>
            <div className="h-4 w-px bg-slate-200 mx-1"></div>
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-800">September 2026</span>
            <button
              type="button"
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. WEEK VIEW (DEFAULT) */}
      {/* ========================================================================= */}
      {calendarView === 'week' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
          {/* Week Header Row */}
          <div className="grid grid-cols-7 gap-2 border-b border-slate-100 pb-3 text-center">
            {weekDays.map((wd) => {
              const isSelected = selectedDateStr === wd.dateStr;
              return (
                <button
                  key={wd.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(wd.dateStr)}
                  className={`p-2 sm:p-3 rounded-2xl text-center transition-all ${
                    isSelected
                      ? 'bg-teal-600 text-white shadow-xs'
                      : wd.isToday
                      ? 'bg-teal-50 text-teal-900 border border-teal-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className={`text-[11px] font-semibold block ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                    {wd.day}
                  </span>
                  <span className="text-sm sm:text-base font-bold block mt-0.5">
                    {wd.date}
                  </span>
                  {wd.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mx-auto mt-1 block"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Week Columns / Schedule Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2.5 min-h-[420px]">
            {weekDays.map((wd) => {
              const dayAppointments = mockSpecialistAppointments.filter((a) => a.dateStr === wd.dateStr);

              return (
                <div
                  key={wd.dateStr}
                  className={`p-2.5 rounded-2xl border flex flex-col space-y-2 min-h-[160px] ${
                    selectedDateStr === wd.dateStr
                      ? 'bg-teal-50/30 border-teal-200'
                      : 'bg-slate-50/50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200/60">
                    <span>{wd.day} {wd.date}</span>
                    <span className="text-teal-700">{dayAppointments.length} slots</span>
                  </div>

                  {dayAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {dayAppointments.map((apt) => (
                        <button
                          key={apt.id}
                          type="button"
                          onClick={() => setSelectedAppointment(apt)}
                          className="w-full text-left p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all space-y-1 group"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-bold text-teal-700">{apt.time}</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                apt.status === 'completed'
                                  ? 'bg-slate-400'
                                  : apt.status === 'cancelled'
                                  ? 'bg-red-400'
                                  : 'bg-emerald-500'
                              }`}
                            ></span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-teal-700">
                            {apt.patientName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {apt.serviceName}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[11px] text-slate-400 italic">
                      {wd.isClosed ? 'Closed' : 'No bookings'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MONTH VIEW */}
      {/* ========================================================================= */}
      {calendarView === 'month' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-6">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 pb-2 border-b border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Month 30-Day Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* September 1, 2026 starts on Tuesday (empty Sunday, Monday offset) */}
            <div className="h-16 sm:h-20 bg-slate-50/40 rounded-xl opacity-40"></div>
            <div className="h-16 sm:h-20 bg-slate-50/40 rounded-xl opacity-40"></div>

            {monthDays.map((day) => {
              const isSelected = selectedDateStr === day.dateStr;
              const hasApts = day.appointments.length > 0;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(day.dateStr)}
                  className={`h-16 sm:h-20 p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : day.isToday
                      ? 'bg-teal-50/80 border-teal-200 text-slate-900 font-bold'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isSelected ? 'text-white' : ''}`}>
                      {day.dayNum}
                    </span>
                    {day.isToday && (
                      <span className={`text-[9px] uppercase font-bold px-1 rounded ${isSelected ? 'bg-teal-700 text-white' : 'bg-teal-200 text-teal-900'}`}>
                        Today
                      </span>
                    )}
                  </div>

                  {hasApts && (
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate ${
                          isSelected
                            ? 'bg-teal-700 text-white'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {day.appointments.length} {day.appointments.length === 1 ? 'patient' : 'patients'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Consultations for {selectedDateStr}
              </h3>
              <span className="text-xs text-slate-500">
                {selectedDayAppointments.length} scheduled
              </span>
            </div>

            {selectedDayAppointments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedDayAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    type="button"
                    onClick={() => setSelectedAppointment(apt)}
                    className="text-left p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-700">{apt.time}</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white border">
                        {apt.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                    <p className="text-xs text-slate-500 truncate">{apt.serviceName}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                No patient consultations scheduled for this date.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DAY VIEW */}
      {/* ========================================================================= */}
      {calendarView === 'day' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-slate-900">
                Daily Timeline: {selectedDateStr}
              </h3>
            </div>
            <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md">
              {selectedDayAppointments.length} Consultations Booked
            </span>
          </div>

          {/* Timeline Hours */}
          <div className="space-y-3">
            {hours.map((hour) => {
              const formattedHour = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
              const aptsInHour = selectedDayAppointments.filter((a) => a.hour === hour);

              return (
                <div
                  key={hour}
                  className="flex items-start gap-4 p-3 rounded-2xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="w-20 shrink-0 text-xs font-bold text-slate-400 pt-1">
                    {formattedHour}
                  </div>

                  <div className="flex-1 space-y-2">
                    {aptsInHour.length > 0 ? (
                      aptsInHour.map((apt) => (
                        <div
                          key={apt.id}
                          onClick={() => setSelectedAppointment(apt)}
                          className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-between gap-4 cursor-pointer hover:shadow-xs transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={apt.patientAvatar}
                              alt={apt.patientName}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-white"
                            />
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                              <p className="text-xs text-teal-800">{apt.serviceName} ({apt.serviceDuration})</p>
                            </div>
                          </div>

                          <div className="text-right text-xs">
                            <span className="font-bold text-slate-800 block">{apt.time}</span>
                            <span className="text-[10px] uppercase font-bold text-emerald-700">
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-slate-300 italic py-1">
                        Open booking slot
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPOINTMENT DETAILS MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppointment(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Appointment Overview</h3>
                    <p className="text-[11px] text-slate-400">ID: {selectedAppointment.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  aria-label="Close details"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Patient Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAppointment.patientAvatar}
                    alt={selectedAppointment.patientName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedAppointment.patientName}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedAppointment.patientEmail}</p>
                    <p className="text-xs text-teal-700 font-medium">{selectedAppointment.patientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${selectedAppointment.patientPhone}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${selectedAppointment.patientEmail}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-700"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Scheduled Slot</span>
                    <span className="font-bold text-slate-800">
                      {selectedAppointment.dateLabel} • {selectedAppointment.time}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Consultation Type</span>
                    <span className="font-bold text-slate-800">{selectedAppointment.type}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 block">Service & Fee</span>
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>{selectedAppointment.serviceName} ({selectedAppointment.serviceDuration})</span>
                    <span className="text-teal-700 text-sm">{selectedAppointment.servicePrice}</span>
                  </div>
                </div>

                {/* Patient Notes */}
                <div className="p-3.5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-1">
                  <span className="text-teal-800 font-bold block">Patient Intake Notes:</span>
                  <p className="text-slate-700 leading-relaxed italic">
                    &ldquo;{selectedAppointment.notes}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Status: {selectedAppointment.status}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialistCalendarPage;
