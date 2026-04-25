import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ChevronDown, ChevronUp, Zap, AlertTriangle, Target, Cpu } from 'lucide-react';
import { GithubIcon } from '../Icons';
import { useProjects } from '../../hooks';
import type { Project } from '../../types/database';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card rounded-2xl overflow-hidden ${project.featured ? 'gradient-border' : ''}`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        {project.featured && (
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full mb-4"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
            <Zap size={11} /> Featured
          </div>
        )}

        <h3 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
          {project.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
          {project.summary}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech_stack?.slice(0, 6).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {project.tech_stack?.length > 6 && (
            <span className="tech-tag">+{project.tech_stack.length - 6}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                style={{ color: '#64748b' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                <GithubIcon size={14} /> GitHub
              </a>
            )}
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                style={{ color: '#64748b' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#22d3ee')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                <ExternalLink size={14} /> Live Demo
              </a>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 px-3 py-1.5 rounded-lg"
            style={{
              color: expanded ? '#818cf8' : '#64748b',
              background: expanded ? 'rgba(99,102,241,0.1)' : 'transparent',
              border: '1px solid rgba(99,102,241,0.15)',
            }}
          >
            {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> Case Study</>}
          </button>
        </div>
      </div>

      {/* Expandable Case Study */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <AlertTriangle size={15} />, label: 'Problem', content: project.problem, color: '#fb7185' },
                { icon: <Cpu size={15} />, label: 'Solution & Architecture', content: project.solution, color: '#818cf8' },
                { icon: <Target size={15} />, label: 'Trade-offs', content: project.tradeoffs, color: '#fbbf24' },
                { icon: <Zap size={15} />, label: 'Impact & Metrics', content: project.impact, color: '#34d399' },
              ].map(({ icon, label, content, color }) => (
                <div key={label} className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.08)' }}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider" style={{ color }}>
                    {icon} {label}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { data: projects = [] } = useProjects();
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projects" className="section-padding mesh-gradient">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-label">Work</div>
          <h2 className="section-title mb-4">
            Projects as <span className="gradient-text">Case Studies</span>
          </h2>
          <p className="mb-12" style={{ color: '#64748b', maxWidth: '560px' }}>
            Every project tells a story: the problem, the solution, the trade-offs, and the measurable impact. Click "Case Study" to see the full breakdown.
          </p>
        </motion.div>

        <div className="space-y-6">
          {displayed.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {projects.length > 3 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-secondary"
            >
              {showAll ? 'Show Less' : `View All ${projects.length} Projects`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
