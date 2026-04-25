import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../Icons';
import { useSendMessage, useProfile } from '../../hooks';

const schema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type FormData = z.infer<typeof schema>;

export default function ContactSection() {
  const { data: profile } = useProfile();
  const sendMessage = useSendMessage();
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await sendMessage.mutateAsync({ ...data, subject: data.subject || '' });
      setSent(true);
      reset();
    } catch {
      // handled below
    }
  };

  return (
    <section id="contact" className="section-padding mesh-gradient">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="section-label justify-center">Contact</div>
          <h2 className="section-title mb-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
            Whether it's a role, collaboration, or just a technical discussion — my inbox is open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <CheckCircle size={48} style={{ color: '#34d399' }} />
                  <h3 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>Message sent!</h3>
                  <p style={{ color: '#64748b' }}>I'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-secondary mt-4">Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="admin-label">Name</label>
                      <input {...register('name')} className="admin-input" placeholder="Your name" />
                      {errors.name && <p className="text-xs mt-1" style={{ color: '#fb7185' }}>{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="admin-label">Email</label>
                      <input {...register('email')} type="email" className="admin-input" placeholder="your@email.com" />
                      {errors.email && <p className="text-xs mt-1" style={{ color: '#fb7185' }}>{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="admin-label">Subject (optional)</label>
                    <input {...register('subject')} className="admin-input" placeholder="Opportunity, collaboration, question..." />
                  </div>

                  <div>
                    <label className="admin-label">Message</label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      className="admin-input resize-none"
                      placeholder="Tell me about the role, project, or what's on your mind..."
                    />
                    {errors.message && <p className="text-xs mt-1" style={{ color: '#fb7185' }}>{errors.message.message}</p>}
                  </div>

                  {sendMessage.isError && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#fb7185' }}>
                      <AlertCircle size={14} /> Failed to send — please try email directly.
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
                    <span className="flex items-center gap-2 relative z-10">
                      {isSubmitting ? 'Sending...' : <><Send size={15} /> Send Message</>}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Social links */}
            {[
              { icon: <Mail size={18} />, label: 'Email', value: profile?.email || 'daniel369johnson@gmail.com', href: `mailto:${profile?.email || 'daniel369johnson@gmail.com'}` },
              { icon: <GithubIcon size={18} />, label: 'GitHub', value: '@JohnsonDanie', href: profile?.github_url || '#' },
              { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', value: 'Daniel Johnson', href: profile?.linkedin_url || '#' },
            ].map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="glass-card rounded-xl p-4 flex items-center gap-4 block"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#64748b' }}>{label}</div>
                  <div className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{value}</div>
                </div>
              </a>
            ))}


          </motion.div>
        </div>
      </div>
    </section>
  );
}
