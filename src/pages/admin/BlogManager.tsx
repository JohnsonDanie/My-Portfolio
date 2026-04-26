import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '../../hooks';
import { DataTable } from '../../components/admin/ui/DataTable';
import { Modal } from '../../components/admin/ui/Modal';
import { FormInput, FormTextarea } from '../../components/admin/ui/FormInput';
import { Plus, Edit2, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import type { BlogPost } from '../../types/database';

type BlogPostFormData = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;

export default function BlogManager() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const { mutate: createPost, isPending: isCreating } = useCreateBlogPost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdateBlogPost();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteBlogPost();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BlogPostFormData>();

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      reset({
        ...post,
        tags: Array.isArray(post.tags) ? (post.tags as any).join(', ') : '',
      });
    } else {
      setEditingPost(null);
      reset({
        title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
        tags: [] as any, published: false, read_time_minutes: 5
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const onSubmit = (data: any) => {
    const tags = typeof data.tags === 'string'
      ? data.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
      : data.tags;

    const payload = { ...data, tags };

    if (editingPost) {
      updatePost({ id: editingPost.id, updates: payload }, { onSuccess: closeModal });
    } else {
      createPost(payload, { onSuccess: closeModal });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deletePost(id);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Post Title',
      render: (p: BlogPost) => (
        <div>
          <div className="font-medium text-white">{p.title}</div>
          <div className="text-xs text-slate-500 mt-1">{p.slug}</div>
        </div>
      ),
    },
    {
      key: 'published',
      header: 'Status',
      render: (p: BlogPost) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          p.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
        }`}>
          {p.published ? <Eye size={12} /> : <EyeOff size={12} />}
          {p.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (p: BlogPost) => (
        <span className="text-sm text-slate-400">
          {new Date(p.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (p: BlogPost) => (
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
          <h1 className="text-2xl font-bold text-white mb-2">Blog Posts</h1>
          <p className="text-slate-400">Write and manage your articles.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          New Post
        </button>
      </div>

      <DataTable data={posts} columns={columns} isLoading={isLoading} emptyMessage="No blog posts found." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPost ? 'Edit Post' : 'New Post'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-6">
            <FormInput label="Title" {...register('title', { required: 'Title is required' })} error={errors.title?.message} placeholder="e.g. The Future of React" />
            <FormInput label="Slug" {...register('slug', { required: 'Slug is required' })} error={errors.slug?.message} placeholder="e.g. future-of-react" />
          </div>

          <FormTextarea label="Excerpt" {...register('excerpt', { required: 'Excerpt is required' })} error={errors.excerpt?.message} rows={2} placeholder="A short summary of the post..." />
          
          <FormTextarea label="Content (Markdown)" {...register('content', { required: 'Content is required' })} error={errors.content?.message} rows={12} className="font-mono text-sm" placeholder="# Heading&#10;&#10;Write your post content here using Markdown formatting..." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Tags (comma separated)" {...register('tags' as any)} placeholder="React, TypeScript, Web" />
            <FormInput label="Read Time (minutes)" type="number" {...register('read_time_minutes', { valueAsNumber: true })} />
          </div>

          <FormInput label="Cover Image URL" {...register('cover_image_url')} placeholder="https://..." />

          <div className="pt-4">
            <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
              <input type="checkbox" {...register('published')} className="w-5 h-5 rounded border-indigo-500/20 bg-[#050c1a] checked:bg-indigo-500 text-indigo-500 focus:ring-indigo-500/50" />
              <div>
                <span className="block text-sm font-medium text-white mb-0.5">Publish Post</span>
                <span className="block text-xs text-slate-400">If unchecked, this post will only be visible to you as a draft.</span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-indigo-500/10">
            <button type="button" onClick={closeModal} className="px-5 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isCreating || isUpdating} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors">
              {(isCreating || isUpdating) ? <Loader2 size={18} className="animate-spin" /> : null}
              {editingPost ? 'Save Changes' : 'Create Post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
