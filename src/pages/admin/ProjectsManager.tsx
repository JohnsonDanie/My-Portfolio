import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks';
import { DataTable } from '../../components/admin/ui/DataTable';
import { Modal } from '../../components/admin/ui/Modal';
import { FormInput, FormTextarea, FormSelect } from '../../components/admin/ui/FormInput';
import { Plus, Edit2, Trash2, Loader2, Link as LinkIcon, ExternalLink, Star } from 'lucide-react';
import type { Project } from '../../types/database';

type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;

export default function ProjectsManager() {
  const { data: projects = [], isLoading } = useProjects();
  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>();

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      reset(project);
    } else {
      setEditingProject(null);
      reset({
        title: '', slug: '', summary: '', problem: '', solution: '', tradeoffs: '', impact: '',
        tech_stack: [], image_url: '', github_url: '', live_url: '', featured: false, order_index: projects.length
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const onSubmit = (data: any) => {
    // Convert comma-separated string back to array if needed
    const tech_stack = typeof data.tech_stack === 'string' 
      ? (data.tech_stack as string).split(',').map(s => s.trim()).filter(Boolean)
      : data.tech_stack;
      
    const payload = { ...data, tech_stack };

    if (editingProject) {
      updateProject({ id: editingProject.id, project: payload }, { onSuccess: closeModal });
    } else {
      createProject(payload, { onSuccess: closeModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Project Title',
      render: (p: Project) => (
        <div>
          <div className="font-medium text-white flex items-center gap-2">
            {p.title}
            {p.featured && <Star size={14} className="text-amber-400 fill-amber-400" />}
          </div>
          <div className="text-xs text-slate-500 mt-1">{p.slug}</div>
        </div>
      ),
    },
    {
      key: 'tech',
      header: 'Tech Stack',
      render: (p: Project) => (
        <div className="flex flex-wrap gap-1">
          {p.tech_stack.slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-0.5 rounded text-xs bg-indigo-500/10 text-indigo-400">
              {tech}
            </span>
          ))}
          {p.tech_stack.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400">
              +{p.tech_stack.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'links',
      header: 'Links',
      render: (p: Project) => (
        <div className="flex items-center gap-3">
          {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white"><LinkIcon size={16} /></a>}
          {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white"><ExternalLink size={16} /></a>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p: Project) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => openModal(p)} className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(p.id)} disabled={isDeleting} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors">
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
          <h1 className="text-2xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Manage your portfolio case studies and side projects.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <DataTable data={projects} columns={columns} isLoading={isLoading} emptyMessage="No projects found. Add one to get started." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingProject ? 'Edit Project' : 'Add New Project'}>
        <form id="project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Project Title" {...register('title', { required: 'Title is required' })} error={errors.title?.message} placeholder="e.g. Acme Dashboard" />
            <FormInput label="Slug (URL friendly)" {...register('slug', { required: 'Slug is required' })} error={errors.slug?.message} placeholder="e.g. acme-dashboard" />
          </div>

          <FormTextarea label="Short Summary" {...register('summary', { required: 'Summary is required' })} error={errors.summary?.message} rows={2} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Tech Stack (comma separated)" {...register('tech_stack', { required: 'Tech stack is required' })} placeholder="React, TypeScript, Node.js" />
            <FormInput label="Order Index" type="number" {...register('order_index', { valueAsNumber: true })} />
          </div>

          <div className="space-y-4 pt-4 border-t border-indigo-500/10">
            <h3 className="text-sm font-semibold text-white">Case Study Details</h3>
            <FormTextarea label="The Problem" {...register('problem')} rows={3} />
            <FormTextarea label="The Solution" {...register('solution')} rows={3} />
            <FormTextarea label="Tradeoffs & Architecture" {...register('tradeoffs')} rows={3} />
            <FormTextarea label="Impact & Results" {...register('impact')} rows={3} />
          </div>

          <div className="space-y-4 pt-4 border-t border-indigo-500/10">
            <h3 className="text-sm font-semibold text-white">Links & Media</h3>
            <FormInput label="Cover Image URL" {...register('image_url')} placeholder="https://..." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput label="GitHub URL" {...register('github_url')} placeholder="https://github.com/..." />
              <FormInput label="Live Demo URL" {...register('live_url')} placeholder="https://..." />
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input type="checkbox" {...register('featured')} className="w-5 h-5 rounded border-indigo-500/20 bg-[#050c1a] checked:bg-indigo-500 text-indigo-500 focus:ring-indigo-500/50" />
              <span className="text-sm text-slate-300 font-medium">Feature this project on the homepage</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-indigo-500/10">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors">
              {(isCreating || isUpdating) ? <Loader2 size={18} className="animate-spin" /> : null}
              {editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
