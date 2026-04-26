import { useQuery } from '@tanstack/react-query';
import { useProfile, useProjects, useSkills, useBlogPosts } from '../../hooks';
import { messagesService } from '../../services/messagesService';
import { Link } from 'react-router-dom';
import { FolderGit2, Code2, PenTool, Mail, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { data: profile } = useProfile();
  const { data: projects = [] } = useProjects();
  const { data: skills = [] } = useSkills();
  const { data: posts = [] } = useBlogPosts();
  
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: messagesService.getAll,
  });

  const unreadMessages = messages.filter(m => !m.read).length;

  const statCards = [
    {
      title: 'Projects',
      value: projects.length,
      icon: FolderGit2,
      link: '/admin/projects',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Skills',
      value: skills.length,
      icon: Code2,
      link: '/admin/skills',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Blog Posts',
      value: posts.length,
      icon: PenTool,
      link: '/admin/blog',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: Mail,
      link: '/admin/messages',
      color: unreadMessages > 0 ? 'text-amber-400' : 'text-slate-400',
      bg: unreadMessages > 0 ? 'bg-amber-500/10' : 'bg-slate-500/10'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {profile?.name?.split(' ')[0] || 'Admin'}
        </h1>
        <p className="text-slate-400">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400 font-medium">{stat.title}</div>
            
            <Link 
              to={stat.link}
              className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 bg-white/[0.02] flex items-end justify-end p-6 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-8 border border-indigo-500/10 bg-indigo-500/[0.02]">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link to="/admin/profile" className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/5">
            Update Profile Info
          </Link>
          <Link to="/admin/projects" className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/5">
            Add New Project
          </Link>
          <Link to="/" target="_blank" className="px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-sm font-medium transition-colors border border-indigo-500/20 flex items-center justify-between">
            View Live Site <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
