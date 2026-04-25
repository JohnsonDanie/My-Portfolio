import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Category tabs ────────────────────────────────────────────────────────────
const categories = [
  { id: 'languages', label: 'Languages' },
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'tools', label: 'Tools' },
  { id: 'design', label: 'Design' },
];

// ─── Stack items — icon src from CDN, color used for hover glow ───────────────
const stack: Record<string, { name: string; color: string; icon: string }[]> = {
  languages: [
    { name: 'Python',     color: '#3b82f6', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'SQL',        color: '#f59e0b', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  ],
  frameworks: [
    { name: 'React',      color: '#61dafb', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  ],
  tools: [
    { name: 'Git',        color: '#f05032', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub',     color: '#e2e8f0', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'VS Code',    color: '#007acc', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  ],
  design: [
    { name: 'Figma',      color: '#f24e1e', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  ],
};

export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState('languages');
  const items = stack[activeTab] || [];

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
          {categories.map(cat => (
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
            </button>
          ))}
        </div>

        {/* Icon grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
          >
            {items.map((tech, i) => (
              <TechCard key={tech.name} tech={tech} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Individual tech card ─────────────────────────────────────────────────────
function TechCard({
  tech,
  index,
}: {
  tech: { name: string; color: string; icon: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="tech-icon-card"
      style={
        {
          '--glow': tech.color,
        } as React.CSSProperties
      }
    >
      <img
        src={tech.icon}
        alt={tech.name}
        width={48}
        height={48}
        loading="lazy"
        style={{ width: 48, height: 48, objectFit: 'contain' }}
      />
      <span className="tech-icon-label">{tech.name}</span>
    </motion.div>
  );
}
