import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Code2, Coffee } from 'lucide-react';
import { useProfile } from '../../hooks';

const tabs = [
  { id: 'story', label: 'My Story', icon: <User size={15} /> },
  { id: 'philosophy', label: 'Engineering Philosophy', icon: <Code2 size={15} /> },
  { id: 'fun', label: 'Fun Facts', icon: <Coffee size={15} /> },
];

const philosophyPoints = [
  {
    title: 'Simplicity is the ultimate sophistication',
    body: 'The best system is the one that\'s impossible to misuse and trivial to debug at 3AM. I optimise for clarity over cleverness every time.',
  },
  {
    title: 'Measure twice, cut once',
    body: 'Every architectural decision is a trade-off. I write ADRs, challenge assumptions early, and get alignment before writing a single line.',
  },
  {
    title: 'Own the full stack of impact',
    body: 'I tie every PR back to a business metric. Code that ships and doesn\'t move the needle is a liability, not an asset.',
  },
  {
    title: 'Observability is not optional',
    body: 'If you can\'t measure it, you can\'t improve it. I instrument everything before it hits production — logs, traces, metrics.',
  },
];

const funFacts = [
  '🎯 I\'ve reviewed 2,000+ PRs and still learn something new every week',
  '⚡ I automated my entire dotfiles setup – it takes 4 minutes to onboard a new Mac',
  '📚 I read one technical book per month and write a summary for my team',
  '☕ Optimal caffeine timing: coffee at 9:30AM, green tea at 2PM (data-driven)',
  '🏃 I do my best system design thinking on long runs',
  '🎸 Ex-guitar player turned distributed systems architect',
];

export default function AboutSection() {
  const { data: profile } = useProfile();
  const [activeTab, setActiveTab] = useState('story');

  const bio = profile?.bio || '';

  return (
    <section id="about" className="section-padding mesh-gradient">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-label">About</div>
          <h2 className="section-title mb-4">
            More than a <span className="gradient-text">git log</span>
          </h2>
          <p style={{ color: '#64748b', marginBottom: '3rem', maxWidth: '500px' }}>
            The story behind the commits.
          </p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: activeTab === tab.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                color: activeTab === tab.id ? '#818cf8' : '#64748b',
                border: activeTab === tab.id ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left content (3/5) */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5"
          >
            {activeTab === 'story' && (
              <div className="glass-card rounded-2xl p-8">
                {bio.split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="mb-4 last:mb-0 leading-relaxed" style={{ color: '#cbd5e1' }}>
                    {para.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </p>
                ))}
              </div>
            )}

            {activeTab === 'philosophy' && (
              <div className="space-y-4">
                {philosophyPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <h3 className="font-bold mb-2 text-base" style={{ color: '#818cf8' }}>
                      {point.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.7' }}>
                      {point.body}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'fun' && (
              <div className="glass-card rounded-2xl p-8">
                <ul className="space-y-4">
                  {funFacts.map((fact, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                      style={{ color: '#cbd5e1' }}
                    >
                      <span>{fact}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>


        </div>
      </div>
    </section>
  );
}
