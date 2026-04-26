import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from '../../hooks';
import { DataTable } from '../../components/admin/ui/DataTable';
import { Modal } from '../../components/admin/ui/Modal';
import { FormInput, FormTextarea } from '../../components/admin/ui/FormInput';
import { Plus, Edit2, Trash2, Loader2, Building2 } from 'lucide-react';
import type { Experience } from '../../types/database';

type ExperienceFormData = Omit<Experience, 'id'>;

export default function ExperienceManager() {
  const { data: experiences = [], isLoading } = useExperience();
  const { mutate: createExperience, isPending: isCreating } = useCreateExperience();
  const { mutate: updateExperience, isPending: isUpdating } = useUpdateExperience();
  const { mutate: deleteExperience, isPending: isDeleting } = useDeleteExperience();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ExperienceFormData>();
  
  const isCurrent = watch('is_current');

  const openModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      reset({
        ...exp,
        achievements: Array.isArray(exp.achievements) ? (exp.achievements as any).join('\n') : '',
        tech_stack: Array.isArray(exp.tech_stack) ? (exp.tech_stack as any).join(', ') : '',
      });
    } else {
      setEditingExp(null);
      reset({
        company: '', role: '', start_date: '', end_date: '', is_current: false,
        location: '', description: '', achievements: [] as any, tech_stack: [] as any,
        company_logo_url: '', order_index: experiences.length
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const onSubmit = (data: any) => {
    const achievements = typeof data.achievements === 'string'
      ? data.achievements.split('\n').map((s: string) => s.trim()).filter(Boolean)
      : data.achievements;
      
    const tech_stack = typeof data.tech_stack === 'string'
      ? data.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
      : data.tech_stack;

    const payload = {
      ...data,
      achievements,
      tech_stack,
      end_date: data.is_current ? null : data.end_date,
    };

    if (editingExp) {
      updateExperience({ id: editingExp.id, experience: payload }, { onSuccess: closeModal });
    } else {
      createExperience(payload, { onSuccess: closeModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience record?')) {
      deleteExperience(id);
    }
  };

  const columns = [
    {
      key: 'company',
      header: 'Company & Role',
      render: (e: Experience) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            {e.company_logo_url ? (
              <img src={e.company_logo_url} alt={e.company} className="w-6 h-6 object-contain rounded" />
            ) : (
              <Building2 size={18} />
            )}
          </div>
          <div>
            <div className="font-medium text-white">{e.role}</div>
            <div className="text-xs text-slate-500">{e.company} • {e.location}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (e: Experience) => (
        <div className="text-sm">
          <span className="text-slate-300">{new Date(e.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          <span className="text-slate-500 mx-2">→</span>
          <span className={e.is_current ? "text-emerald-400 font-medium" : "text-slate-300"}>
            {e.is_current || !e.end_date ? 'Present' : new Date(e.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (e: Experience) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openModal(e)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(e.id)} disabled={isDeleting} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Experience</h1>
          <p className="text-slate-400">Manage your work history and career timeline.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Add Experience
        </button>
      </div>

      <DataTable data={experiences} columns={columns} isLoading={isLoading} emptyMessage="No experience records found." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingExp ? 'Edit Experience' : 'Add New Experience'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Company Name" {...register('company', { required: 'Company is required' })} error={errors.company?.message} />
            <FormInput label="Role / Title" {...register('role', { required: 'Role is required' })} error={errors.role?.message} />
          </div>

          <FormInput label="Location" {...register('location', { required: 'Location is required' })} error={errors.location?.message} placeholder="e.g. Remote, or New York, NY" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <FormInput label="Start Date" type="date" {...register('start_date', { required: 'Start date is required' })} error={errors.start_date?.message} />
            
            <div className="space-y-2">
              <FormInput label="End Date" type="date" {...register('end_date')} disabled={isCurrent} className={isCurrent ? 'opacity-50' : ''} />
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" {...register('is_current')} className="rounded border-indigo-500/20 bg-[#050c1a] text-indigo-500 focus:ring-indigo-500/50" />
                <span className="text-sm text-slate-300">I currently work here</span>
              </label>
            </div>
          </div>

          <FormTextarea label="Short Description" {...register('description', { required: 'Description is required' })} error={errors.description?.message} rows={2} />
          
          <FormTextarea label="Key Achievements (One per line)" {...register('achievements' as any)} placeholder="- Led migration of legacy system...&#10;- Improved page load time by 40%..." rows={4} />

          <FormInput label="Tech Stack (comma separated)" {...register('tech_stack' as any)} placeholder="React, Node.js, AWS" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Company Logo URL" {...register('company_logo_url')} placeholder="https://..." />
            <FormInput label="Order Index" type="number" {...register('order_index', { valueAsNumber: true })} />
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-indigo-500/10">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors">
              {(isCreating || isUpdating) ? <Loader2 size={18} className="animate-spin" /> : null}
              {editingExp ? 'Save Changes' : 'Create Experience'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
