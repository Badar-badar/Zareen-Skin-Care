import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Plus,
  Clock,
  DollarSign,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  AlertTriangle,
  Sparkles,
  Filter,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { mockSpecialists } from '../../data/specialists';

// Zod validation schema for service creation & editing
const serviceSchema = z.object({
  name: z
    .string()
    .min(3, 'Service name must be at least 3 characters')
    .max(80, 'Service name is too long'),
  category: z.string().min(1, 'Category is required'),
  duration: z.string().min(1, 'Duration is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\$?\d+(\.\d{1,2})?$/, 'Please enter a valid price (e.g. 180 or $180)'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(300, 'Description is too long'),
  isActive: z.boolean().default(true),
});

const serviceCategories = [
  'All Categories',
  'Clinical Dermatology',
  'Laser & Aesthetics',
  'Skin Rejuvenation',
  'Injectables & Anti-Aging',
  'Diagnostic & Consultation',
];

let serviceIdCounter = 500;
const generateServiceId = () => {
  serviceIdCounter += 1;
  return `srv-${serviceIdCounter}`;
};

export const SpecialistServicesPage = () => {
  // Local state initialized from mock specialist detailedServices
  const [services, setServices] = useState(
    (mockSpecialists[0].detailedServices || []).map((s, index) => ({
      ...s,
      isActive: true,
      category:
        index === 0
          ? 'Diagnostic & Consultation'
          : index === 1
          ? 'Laser & Aesthetics'
          : index === 2
          ? 'Clinical Dermatology'
          : 'Skin Rejuvenation',
    }))
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null if adding new

  // Delete confirmation modal state
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      category: 'Clinical Dermatology',
      duration: '45 mins',
      price: '$180',
      description: '',
      isActive: true,
    },
  });

  // Open modal for new service
  const handleOpenAddModal = () => {
    setEditingService(null);
    reset({
      name: '',
      category: 'Clinical Dermatology',
      duration: '45 mins',
      price: '$180',
      description: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing service
  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setValue('name', service.name);
    setValue('category', service.category || 'Clinical Dermatology');
    setValue('duration', service.duration);
    setValue('price', service.price);
    setValue('description', service.description);
    setValue('isActive', service.isActive !== false);
    setIsModalOpen(true);
  };

  // Toggle active status directly
  const handleToggleStatus = (id) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, isActive: !s.isActive };
          showToast(`Service "${s.name}" is now ${updated.isActive ? 'Active' : 'Inactive'}.`);
          return updated;
        }
        return s;
      })
    );
  };

  // Form Submission (Add or Update)
  const onSubmit = (data) => {
    const formattedPrice = data.price.startsWith('$') ? data.price : `$${data.price}`;

    if (editingService) {
      // Edit mode
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...data, price: formattedPrice }
            : s
        )
      );
      showToast(`Service "${data.name}" updated successfully.`);
    } else {
      // Add mode
      const newService = {
        id: generateServiceId(),
        ...data,
        price: formattedPrice,
      };
      setServices((prev) => [newService, ...prev]);
      showToast(`New service "${data.name}" added to menu.`);
    }

    setIsModalOpen(false);
    setEditingService(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!serviceToDelete) return;
    setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
    showToast(`Service "${serviceToDelete.name}" deleted.`);
    setServiceToDelete(null);
  };

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Search keyword
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(q);
        const matchDesc = s.description.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'All Categories' && s.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && s.isActive === false) return false;
      if (statusFilter === 'inactive' && s.isActive !== false) return false;

      return true;
    });
  }, [services, searchQuery, selectedCategory, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Toast feedback */}
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-100 mb-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            <span>Menu & Pricing Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Services Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Define consultation types, session durations, treatment fees, and booking visibility.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenAddModal}
          className="shadow-md shadow-teal-600/20"
        >
          Add New Service
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by name or keywords..."
              className="w-full pl-9.5 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
            >
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2 flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => {
              const isActive = service.isActive !== false;

              return (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-4 ${
                    isActive
                      ? 'border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-teal-200'
                      : 'border-slate-200/50 bg-slate-50/50 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Header: Category Tag & Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100/70">
                          {service.category || 'General Consultation'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5">
                          {service.name}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-extrabold text-slate-900">{service.price}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Clinic Fee</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>

                  {/* Card Footer: Duration, Active Toggle & Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>{service.duration}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Active/Inactive Switch button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(service.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={isActive ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {isActive ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            <span>Inactive</span>
                          </>
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(service)}
                        aria-label={`Edit ${service.name}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setServiceToDelete(service)}
                        aria-label={`Delete ${service.name}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No medical services matched your search criteria. Try modifying your search or add a new service.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenAddModal} icon={Plus}>
            Add First Service
          </Button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT SERVICE MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingService ? 'Edit Medical Service' : 'Add New Service to Menu'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="service-name-input" className="block text-xs font-semibold text-slate-700">
                    Service / Consultation Title
                  </label>
                  <input
                    id="service-name-input"
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Clinical Acne & Scar Protocol"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label htmlFor="service-cat-input" className="block text-xs font-semibold text-slate-700">
                    Service Category
                  </label>
                  <select
                    id="service-cat-input"
                    {...register('category')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
                  >
                    {serviceCategories
                      .filter((c) => c !== 'All Categories')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Duration & Price Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="service-dur-input" className="block text-xs font-semibold text-slate-700">
                      Duration
                    </label>
                    <select
                      id="service-dur-input"
                      {...register('duration')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 cursor-pointer"
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="40 mins">40 mins</option>
                      <option value="45 mins">45 mins</option>
                      <option value="50 mins">50 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="service-price-input" className="block text-xs font-semibold text-slate-700">
                      Clinic Fee ($)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="service-price-input"
                        type="text"
                        {...register('price')}
                        placeholder="180"
                        className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                          errors.price
                            ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                            : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                        }`}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-[11px] text-red-600 font-medium">{errors.price.message}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="service-desc-input" className="block text-xs font-semibold text-slate-700">
                    Clinical Description & Preparation
                  </label>
                  <textarea
                    id="service-desc-input"
                    rows={3}
                    {...register('description')}
                    placeholder="Provide overview of treatment procedure, diagnostic assessment, or what patients should prepare..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.description
                        ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-200 focus:ring-teal-600/30 focus:border-teal-600'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-[11px] text-red-600 font-medium">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="isActive"
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-600 cursor-pointer"
                  />
                  <label htmlFor="isActive" className="text-xs text-slate-700 font-medium cursor-pointer">
                    Enable for instant patient booking on your public profile
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                  >
                    {editingService ? 'Update Service' : 'Save Service'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {serviceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setServiceToDelete(null)}
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
                <h3 className="text-base font-bold text-slate-900">Delete Service?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove <strong>&ldquo;{serviceToDelete.name}&rdquo;</strong>? Patients will no longer be able to book this service.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setServiceToDelete(null)}
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-2xs"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialistServicesPage;
