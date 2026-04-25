import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useExperience } from '../../hooks';
import { formatDate } from '../../lib/utils';

export default function ExperienceSection() {
  const { data: experience = [] } = useExperience();

  return (
    <section id="experience" className="section-padding" style={{ background: '#070d1c' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-label">Experience</div>
          <h2 className="section-title mb-4">
            Where I've <span className="gradient-text">Built Things</span>
          </h2>
          <p className="mb-12" style={{ color: '#64748b' }}>
            A track record of ownership, impact, and growth.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #6366f1, rgba(99,102,241,0.1))' }} />

          <div className="space-y-8">
            {experience.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-[18px] top-6 w-4 h-4 rounded-full"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#1f2937',
                    border: '2px solid #6366f1',
                    boxShadow: i === 0 ? '0 0 12px rgba(99,102,241,0.5)' : 'none',
                  }}
                />

                <div className="glass-card rounded-2xl p-6">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#f1f5f9' }}>{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold" style={{ color: '#818cf8' }}>{exp.company}</span>
                        {exp.is_current && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }}>
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: '#64748b' }}>
                        {formatDate(exp.start_date)} → {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : ''}
                      </div>
                      <div className="flex items-center gap-1 justify-end mt-1" style={{ color: '#475569', fontSize: '0.8rem' }}>
                        <MapPin size={12} />{exp.location}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{exp.description}</p>

                  {/* Achievements */}
                  {exp.achievements?.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((ach, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm" style={{ color: '#cbd5e1' }}>
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#6366f1' }} />
                          {ach}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech Stack */}
                  {exp.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                      {exp.tech_stack.map(tech => (
                        <span key={tech} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
