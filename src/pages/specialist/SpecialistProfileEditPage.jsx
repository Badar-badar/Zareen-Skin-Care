import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockSpecialists, specialtiesList } from '../../data/specialists';

export const SpecialistProfileEditPage = () => {
  const current = mockSpecialists[0];
  const [name, setName] = useState(current.name);
  const [title, setTitle] = useState(current.title);
  const [specialty, setSpecialty] = useState(current.specialty);
  const [clinicName, setClinicName] = useState(current.clinicName);
  const [address, setAddress] = useState(current.address || current.location);
  const [bio, setBio] = useState(current.bio);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Doctor Profile & Bio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage how your professional practice appears to prospective patients.
          </p>
        </div>

        <Button
          to={`/specialist/${current.id}`}
          target="_blank"
          variant="outline"
          size="sm"
        >
          View Live Profile
        </Button>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={current.image}
            alt={name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
          />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Profile Photo</h3>
            <p className="text-xs text-slate-400">Recommended size: 600x600px</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="spec-name" className="block text-xs font-semibold text-slate-700">
              Full Name
            </label>
            <input
              id="spec-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="spec-title" className="block text-xs font-semibold text-slate-700">
              Professional Title
            </label>
            <input
              id="spec-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="spec-specialty" className="block text-xs font-semibold text-slate-700">
              Specialization
            </label>
            <select
              id="spec-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            >
              {specialtiesList.filter((s) => s !== 'All Specialties').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="clinic-name" className="block text-xs font-semibold text-slate-700">
              Clinic / Hospital Name
            </label>
            <input
              id="clinic-name"
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="clinic-address" className="block text-xs font-semibold text-slate-700">
            Physical Clinic Address
          </label>
          <input
            id="clinic-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="spec-bio" className="block text-xs font-semibold text-slate-700">
            About & Clinical Biography
          </label>
          <textarea
            id="spec-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="lg">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SpecialistProfileEditPage;
