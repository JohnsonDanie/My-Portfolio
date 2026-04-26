import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkills } from '../../hooks';

// ─── Map icon_slug → devicons CDN URL + glow colour ──────────────────────────
const iconMeta: Record<string, { url: string; color: string }> = {
  python:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',         color: '#3b82f6' },
  javascript:  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#fbbf24' },
  typescript:  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: '#3b82f6' },
  sql:         { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',           color: '#f59e0b' },
  go:          { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg',                 color: '#06b6d4' },
  rust:        { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg',             color: '#fb923c' },
  react:       { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',          color: '#61dafb' },
  nextjs:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',        color: '#e2e8f0' },
  nodejs:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',        color: '#34d399' },
  fastapi:     { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',      color: '#34d399' },
  django:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg',           color: '#059669' },
  flask:       { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',          color: '#e2e8f0' },
  git:         { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',              color: '#f05032' },
  github:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',       color: '#e2e8f0' },
  docker:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',       color: '#0ea5e9' },
  kubernetes:  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',  color: '#60a5fa' },
  vscode:      { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',       color: '#007acc' },
  figma:       { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',         color: '#f24e1e' },
  postgresql:  { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: '#60a5fa' },
  mongodb:     { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',     color: '#34d399' },
  redis:       { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',         color: '#fb7185' },
  aws:         { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg', color: '#fbbf24' },
  gcp:         { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg', color: '#60a5fa' },
  linux:       { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',         color: '#fbbf24' },
  terraform:   { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', color: '#818cf8' },
  kafka:       { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg', color: '#e2e8f0' },
};

// Fallback for unknown slugs
const fallbackIcon = { url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg', color: '#6366f1' };

// ─── Category display config ──────────────────────────────────────────────────
const categoryTabs = [
  { id: 'language',  label: 'Languages' },
  { id: 'framework', label: 'Frameworks' },
  { id: 'tool',      label: 'Tools' },
  { id: 'design',    label: 'Design' },
];

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function SkillSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 p-4 rounded-2xl"
          style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.08)' }}
        >
          <div className="w-12 h-12 rounded-xl animate-pulse" style={{ background: 'rgba(99,102,241,0.1)' }} />
          <div className="w-14 h-3 rounded animate-pulse" style={{ background: 'rgba(99,102,241,0.1)' }} />
        </div>
      ))}
    </div>
  );
}

export default function SkillsSection() {
  const { data: skills = [], isLoading } = useSkills();
  const [activeTab, setActiveTab] = useState('language');

  // Group Firestore skills by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || 'tool';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const activeSkills = grouped[activeTab] || [];

  return (
    <section id="skills" className="section-padding" style={{ background: '#070d1c' }}>
      <div className="max-w-4xl mx-auto">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-label">Expertise</div>
          <h2 className="section-title mb-4">
            My <span className="gradient-text">Stack</span>
          </h2>
          <p className="mb-10" style={{ color: '#64748b', maxWidth: '480px' }}>
            The tools I reach for every day to build clean, production-ready software.
          </p>
        </motion.div>

        {/* Category tabs */}
        <div
          className="flex gap-1 mb-10 p-1 rounded-xl w-fit flex-wrap"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.12)' }}
        >
          {categoryTabs.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === cat.id ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: activeTab === cat.id ? '#a5b4fc' : '#475569',
                border: activeTab === cat.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
              }}
            >
              {cat.label}
              {grouped[cat.id]?.length > 0 && (
                <span className="ml-2 text-xs opacity-60">({grouped[cat.id].length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Icon grid */}
        {isLoading ? (
          <SkillSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
            >
              {activeSkills.length === 0 ? (
                <p className="col-span-6 text-sm" style={{ color: '#475569' }}>
                  No {categoryTabs.find(c => c.id === activeTab)?.label.toLowerCase()} added yet.
                </p>
              ) : (
                activeSkills.map((skill, i) => {
                  const meta = iconMeta[skill.icon_slug] || fallbackIcon;
                  return (
                    <TechCard
                      key={skill.id}
                      name={skill.name}
                      color={meta.color}
                      icon={meta.url}
                      index={i}
                    />
                  );
                })
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

// ─── Individual tech card ─────────────────────────────────────────────────────
function TechCard({ name, color, icon, index }: { name: string; color: string; icon: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="tech-icon-card"
      style={{ '--glow': color } as React.CSSProperties}
    >
      <img
        src={icon}
        alt={name}
        width={48}
        height={48}
        loading="lazy"
        style={{ width: 48, height: 48, objectFit: 'contain' }}
      />
      <span className="tech-icon-label">{name}</span>
    </motion.div>
  );
}
