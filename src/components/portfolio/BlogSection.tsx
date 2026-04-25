import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '../../hooks';
import { formatDate } from '../../lib/utils';

export default function BlogSection() {
  const { data: posts = [] } = useBlogPosts();

  return (
    <section id="blog" className="section-padding mesh-gradient">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="section-label">Writing</div>
          <h2 className="section-title mb-4">
            Technical <span className="gradient-text">Perspectives</span>
          </h2>
          <p className="mb-12" style={{ color: '#64748b', maxWidth: '500px' }}>
            Long-form writing on distributed systems, engineering culture, and hard-won lessons from production.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 flex flex-col"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="tech-tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
                ))}
              </div>

              <h3 className="text-base font-bold leading-snug mb-3 flex-1" style={{ color: '#f1f5f9' }}>
                {post.title}
              </h3>

              <p className="text-sm leading-relaxed mb-5" style={{ color: '#64748b' }}>
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {formatDate(post.created_at)}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {post.read_time_minutes}m</span>
                </div>
                <button
                  className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                  style={{ color: '#818cf8' }}
                >
                  Read <ArrowRight size={12} />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
