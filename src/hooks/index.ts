import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { projectsService } from '../services/projectsService';
import { skillsService } from '../services/skillsService';
import { experienceService } from '../services/experienceService';
import { blogService } from '../services/blogService';
import { testimonialsService } from '../services/testimonialsService';
import { messagesService } from '../services/messagesService';
import type { Project, Skill, Experience, BlogPost, Testimonial, ContactMessage } from '../types/database';

// ─── Profile ─────────────────────────────────────────────────────────────────
export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: profileService.get, staleTime: 5 * 60 * 1000 });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof profileService.update>[1] }) =>
      profileService.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
};

// ─── Projects ────────────────────────────────────────────────────────────────
export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: projectsService.getAll });

export const useFeaturedProjects = () =>
  useQuery({ queryKey: ['projects', 'featured'], queryFn: projectsService.getFeatured });

export const useProject = (slug: string) =>
  useQuery({ queryKey: ['projects', slug], queryFn: () => projectsService.getBySlug(slug), enabled: !!slug });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => projectsService.create(project),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Project> }) => projectsService.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
};

// ─── Skills ──────────────────────────────────────────────────────────────────
export const useSkills = () =>
  useQuery({ queryKey: ['skills'], queryFn: skillsService.getAll });

export const useCreateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (skill: Omit<Skill, 'id'>) => skillsService.create(skill),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
};

export const useUpdateSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Skill> }) => skillsService.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => skillsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  });
};

// ─── Experience ──────────────────────────────────────────────────────────────
export const useExperience = () =>
  useQuery({ queryKey: ['experience'], queryFn: experienceService.getAll });

export const useCreateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (exp: Omit<Experience, 'id'>) => experienceService.create(exp),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experience'] }),
  });
};

export const useUpdateExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Experience> }) => experienceService.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experience'] }),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => experienceService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experience'] }),
  });
};

// ─── Blog ────────────────────────────────────────────────────────────────────
export const useBlogPosts = (adminMode = false) =>
  useQuery({ queryKey: ['blog', adminMode], queryFn: adminMode ? blogService.getAll : blogService.getPublished });

export const useBlogPost = (slug: string) =>
  useQuery({ queryKey: ['blog', slug], queryFn: () => blogService.getBySlug(slug), enabled: !!slug });

export const useCreateBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => blogService.create(post),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  });
};

export const useUpdateBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => blogService.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  });
};

export const useDeleteBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  });
};

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const useTestimonials = () =>
  useQuery({ queryKey: ['testimonials'], queryFn: testimonialsService.getAll });

export const useCreateTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (t: Omit<Testimonial, 'id'>) => testimonialsService.create(t),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });
};

export const useDeleteTestimonial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialsService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const useMessages = () =>
  useQuery({ queryKey: ['messages'], queryFn: messagesService.getAll });

export const useSendMessage = () =>
  useMutation({
    mutationFn: (msg: Omit<ContactMessage, 'id' | 'read' | 'created_at'>) => messagesService.send(msg),
  });

export const useMarkMessageRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });
};

export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });
};
