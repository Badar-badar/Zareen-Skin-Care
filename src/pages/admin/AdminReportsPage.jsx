import { useState } from 'react';
import {
  Sparkles,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockAdminReportsData, mockAdminStats } from '../../data/admin';

export const AdminReportsPage = () => {
  const [timeRange, setTimeRange] = useState('year'); // '30days' | '90days' | 'year'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Platform Intelligence</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports & Platform Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cross-specialist utilization metrics, patient acquisition trends, and booking outcomes.
          </p>
        </div>

        {/* Time Period Filter & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs font-semibold">
            {[
              { id: '30days', label: 'Last 30 Days' },
              { id: '90days', label: 'Last 90 Days' },
              { id: 'year', label: 'Year-to-Date (2026)' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  timeRange === t.id
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={() => alert('Analytics export ready for download (CSV/PDF).')}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP PERFORMANCE KPI CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Consultations
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {mockAdminStats.totalAppointments.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +18.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Compared to previous period</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Specialist Network
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {mockAdminStats.totalSpecialists}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12.0%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Certified practitioners</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Active Patients
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              {mockAdminStats.totalPatients.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +24.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Registered care profiles</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Estimated Care Value
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">
              $712,000
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +21.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Facilitated appointment value</p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. APPOINTMENTS OVER TIME BAR CHART */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Appointments & Booking Trajectory Over Time
            </h2>
            <p className="text-xs text-slate-500">
              Monthly consultation numbers and estimated clinic workflow load
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-teal-700">
              <span className="w-3 h-3 rounded-full bg-teal-500"></span>
              Monthly Completed
            </span>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="space-y-4">
          <div className="grid grid-cols-9 gap-3 items-end h-56 border-b border-slate-100 pb-2">
            {mockAdminReportsData.monthlyAppointments.map((m) => {
              const maxVal = 750;
              const heightPct = Math.round((m.appointments / maxVal) * 100);

              return (
                <div key={m.month} className="flex flex-col items-center h-full justify-end group">
                  <div className="text-[11px] font-bold text-teal-800 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {m.appointments}
                  </div>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[48px] rounded-t-2xl bg-gradient-to-t from-teal-600 to-teal-400 group-hover:from-teal-700 group-hover:to-teal-500 transition-all shadow-xs"
                  ></div>
                  <div className="text-center mt-2 w-full">
                    <span className="text-xs font-bold text-slate-700 block truncate">
                      {m.month.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {m.revenueEstimate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Baseline: Jan 2026</span>
            <span>Steady 15-20% MoM Platform Compounding</span>
            <span>Target: 1,000+ / mo</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. USER GROWTH COMPARISON (SPECIALISTS VS PATIENTS) & SPECIALTIES SHARE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Acquisition Growth Table / Bars */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">User Network Growth (Month by Month)</h2>
            <p className="text-xs text-slate-500">Comparison of newly joined skin specialists vs newly registered patients</p>
          </div>

          <div className="space-y-3">
            {mockAdminReportsData.userGrowth.map((ug) => (
              <div
                key={ug.month}
                className="p-3 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-center justify-between gap-4 text-xs"
              >
                <span className="font-bold text-slate-900 w-12">{ug.month}</span>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-teal-700 font-semibold">
                      +{ug.newSpecialists} Specialists
                    </span>
                    <span className="text-blue-700 font-semibold">
                      +{ug.newPatients} Patients
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                    <div
                      style={{ width: `${(ug.newSpecialists / 15) * 100}%` }}
                      className="bg-teal-500 h-full"
                    ></div>
                    <div
                      style={{ width: `${(ug.newPatients / 400) * 100}%` }}
                      className="bg-blue-500 h-full"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Requested Specialties Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Top Service Demands</h2>
            <p className="text-xs text-slate-500">Most requested clinical fields by appointment volume</p>
          </div>

          <div className="space-y-4">
            {mockAdminReportsData.topSpecialties.map((item) => (
              <div key={item.specialty} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.specialty}</span>
                  <span className="font-bold text-teal-700">{item.share} ({item.bookings} visits)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: item.share }}
                    className="h-full rounded-full bg-teal-600"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-900 space-y-1">
            <span className="font-bold block">Specialty Highlight</span>
            <p className="text-teal-800 leading-relaxed">
              Clinical Dermatology & Acne Protocols represent 56% of total patient demand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
