import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks';
import { DataTable } from '../../components/admin/ui/DataTable';
import { Modal } from '../../components/admin/ui/Modal';
import { FormInput, FormSelect } from '../../components/admin/ui/FormInput';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import type { Skill } from '../../types/database';

type SkillFormData = Omit<Skill, 'id'>;

export default function SkillsManager() {
  const { data: skills = [], isLoading } = useSkills();
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: updateSkill, isPending: isUpdating } = useUpdateSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SkillFormData>();

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      reset(skill);
    } else {
      setEditingSkill(null);
      reset({
        name: '',
        category: 'language',
        proficiency: 'proficient',
        icon_slug: '',
        order_index: skills.length
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const onSubmit = (data: any) => {
    if (editingSkill) {
      updateSkill({ id: editingSkill.id, updates: data }, { onSuccess: closeModal });
    } else {
      createSkill(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(id);
    }
  };

  const columns = [
    {
      key: 'icon',
      header: 'Icon',
      render: (s: Skill) => (
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center p-2">
          {s.icon_slug ? (
            <img 
              src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.icon_slug}/${s.icon_slug}-original.svg`}
              onError={(e) => {
                // Fallback for icons that might use -plain instead of -original
                const img = e.currentTarget;
                if (img.src.includes('-original.svg')) {
                  img.src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.icon_slug}/${s.icon_slug}-plain.svg`;
                } else {
                  // Final fallback
                  img.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
                }
              }}
              alt={s.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-xs text-slate-500">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Skill Name',
      render: (s: Skill) => <span className="font-medium text-white">{s.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (s: Skill) => (
        <span className="capitalize px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400">
          {s.category}
        </span>
      ),
    },
    {
      key: 'proficiency',
      header: 'Proficiency',
      render: (s: Skill) => (
        <span className="capitalize text-slate-400 text-sm">
          {s.proficiency}
        </span>
      ),
    },
    {
      key: 'order_index',
      header: 'Order',
    },
    {
      key: 'actions',
      header: '',
      render: (s: Skill) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openModal(s)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(s.id)} disabled={isDeleting} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors">
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
          <h1 className="text-2xl font-bold text-white mb-2">Skills</h1>
          <p className="text-slate-400">Manage your technical stack and proficiencies.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      <DataTable data={skills} columns={columns} isLoading={isLoading} emptyMessage="No skills found. Add one to get started." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSkill ? 'Edit Skill' : 'Add New Skill'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput 
              label="Skill Name" 
              {...register('name', { required: 'Name is required' })} 
              error={errors.name?.message} 
              placeholder="e.g. React" 
            />
            
            <FormInput 
              label="Devicon Slug" 
              {...register('icon_slug', { required: 'Icon slug is required' })} 
              error={errors.icon_slug?.message} 
              placeholder="e.g. react" 
            />
          </div>
          
          <p className="text-xs text-slate-500 -mt-4 mb-6">
            Find the correct slug at <a href="https://devicon.dev/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">devicon.dev</a> (e.g. for Python, the slug is `python`).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect 
              label="Category" 
              {...register('category')} 
              options={[
                { label: 'Language', value: 'language' },
                { label: 'Framework', value: 'framework' },
                { label: 'Cloud', value: 'cloud' },
                { label: 'DevOps', value: 'devops' },
                { label: 'Database', value: 'database' },
                { label: 'Tool', value: 'tool' },
                { label: 'Design', value: 'design' },
              ]}
            />
            
            <FormSelect 
              label="Proficiency" 
              {...register('proficiency')} 
              options={[
                { label: 'Familiar', value: 'familiar' },
                { label: 'Proficient', value: 'proficient' },
                { label: 'Expert', value: 'expert' },
              ]}
            />
          </div>

          <FormInput 
            label="Order Index (lower appears first)" 
            type="number" 
            {...register('order_index', { valueAsNumber: true })} 
          />

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-indigo-500/10">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors">
              {(isCreating || isUpdating) ? <Loader2 size={18} className="animate-spin" /> : null}
              {editingSkill ? 'Save Changes' : 'Create Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
