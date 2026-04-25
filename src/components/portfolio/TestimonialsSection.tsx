import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTestimonials } from '../../hooks';

export default function TestimonialsSection() {
  const { data: testimonials = [] } = useTestimonials();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (testimonials.length === 0) return;
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000);
    return () => clearInterval(intervalRef.current);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding" style={{ background: '#070d1c' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="section-label justify-center">
            Testimonials
          </div>
          <h2 className="section-title">
            What <span className="gradient-text">colleagues say</span>
          </h2>
        </motion.div>

        {/* Active testimonial */}
        <div className="relative min-h-72">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: i === current ? 1 : 0, y: i === current ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
              style={{ pointerEvents: i === current ? 'auto' : 'none' }}
            >
              <div className="glass-card rounded-2xl p-8 md:p-10 text-center">
                <Quote size={32} className="mx-auto mb-6" style={{ color: '#6366f1', opacity: 0.6 }} />
                <blockquote className="text-lg leading-relaxed mb-8" style={{ color: '#cbd5e1', fontStyle: 'italic', maxWidth: '640px', margin: '0 auto 2rem' }}>
                  "{t.quote}"
                </blockquote>
                <div className="flex flex-col items-center gap-1">
                  {t.author_avatar_url ? (
                    <img src={t.author_avatar_url} alt={t.author_name} className="w-12 h-12 rounded-full mb-3 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center text-lg font-bold"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      {t.author_name.charAt(0)}
                    </div>
                  )}
                  <div className="font-bold" style={{ color: '#f1f5f9' }}>{t.author_name}</div>
                  <div className="text-sm" style={{ color: '#818cf8' }}>{t.author_role}</div>
                  <div className="text-sm" style={{ color: '#64748b' }}>{t.author_company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); clearInterval(intervalRef.current); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                background: i === current ? '#6366f1' : '#374151',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
