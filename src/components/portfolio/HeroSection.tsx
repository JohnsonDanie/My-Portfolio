import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Download, ArrowDown, Zap, MapPin, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../Icons';
import { useProfile } from '../../hooks';



function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HeroSection() {
  const { data: profile } = useProfile();
  const [visibleLines, setVisibleLines] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useScrollReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(v => v < dynamicCodeLines.length ? v + 1 : v);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let rafId: number;
    let lastX = 0;
    let lastY = 0;
    const handleMouse = (e: MouseEvent) => {
      lastX = e.clientX / window.innerWidth;
      lastY = e.clientY / window.innerHeight;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMousePos({ x: lastX, y: lastY });
      });
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const name = profile?.name || 'Daniel Johnson';
  const title = profile?.title || 'Junior Software Engineer';
  const tagline = profile?.tagline || 'I architect scalable systems and build products that move metrics.';
  const location = profile?.location || 'San Francisco, CA';
  const status = profile?.availability_status || 'open';
  const github = profile?.github_url || '#';
  const linkedin = profile?.linkedin_url || '#';
  const resume = profile?.resume_url || '#';
  const email = profile?.email || '';

  const dynamicCodeLines = [
    { text: 'const engineer = {', color: '#e2e8f0' },
    { text: `  name: "${name}",`, color: '#a78bfa' },
    { text: `  role: "${title}",`, color: '#34d399' },
    { text: '  focus: ["Distributed Systems",', color: '#22d3ee' },
    { text: '          "Cloud Architecture",', color: '#22d3ee' },
    { text: '          "Engineering Leadership"],', color: '#22d3ee' },
    { text: `  impact: "${profile?.impact_metrics?.[0]?.value || '50M+'} events/day →", `, color: '#fbbf24' },
    { text: `  yoe: ${profile?.yoe || 3},`, color: '#818cf8' },
    { text: `  open_to_work: ${status === 'open'} ✓`, color: '#34d399' },
    { text: '};', color: '#e2e8f0' },
  ];

  const statusConfig = {
    open: { label: 'Open to Work', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
    busy: { label: 'Not Available', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' },
    closed: { label: 'Not Looking', color: '#fb7185', bg: 'rgba(251, 113, 133, 0.1)' },
  };
  const sc = statusConfig[status];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top-left, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at bottom-right, rgba(139,92,246,0.1) 0%, transparent 60%), #050c1a',
      }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* Static ambient background glow — GPU-composited, no filter cost */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${20 + mousePos.x * 8}% ${15 + mousePos.y * 8}%, rgba(99,102,241,0.13) 0%, transparent 55%),
                       radial-gradient(ellipse at ${80 - mousePos.x * 6}% ${70 - mousePos.y * 6}%, rgba(6,182,212,0.08) 0%, transparent 50%)`,
          transition: 'background 0.3s ease',
          willChange: 'background',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left — Text Content */}
        <div>
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8"
            style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}30` }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: sc.color }} />
            {sc.label}
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="section-title mb-2" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              Hey, I'm{' '}
              <span className="gradient-text text-glow">{name}</span>
            </h1>
            <p className="text-xl font-semibold mb-6" style={{ color: '#94a3b8' }}>
              {title}
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg leading-relaxed mb-8"
            style={{ color: '#cbd5e1', maxWidth: '500px' }}
          >
            {tagline}
          </motion.p>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-4 mb-10 flex-wrap"
            style={{ color: '#64748b', fontSize: '0.85rem' }}
          >
            <span className="flex items-center gap-1.5"><MapPin size={14} />{location}</span>
            {email && <span className="flex items-center gap-1.5"><Mail size={14} />{email}</span>}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 flex-wrap"
          >
            <a href="#projects" className="btn-primary">
              <span className="flex items-center gap-2 relative z-10">
                <Zap size={16} /> View Projects
              </span>
            </a>
            <a href={resume} target="_blank" rel="noreferrer" className="btn-secondary">
              <Download size={16} /> Download CV
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex gap-4 mt-8"
          >
            {[
              { href: github, icon: <GithubIcon size={20} />, label: 'GitHub' },
              { href: linkedin, icon: <LinkedinIcon size={20} />, label: 'LinkedIn' },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ color: '#64748b' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right — Animated Code Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
          className="hidden lg:block"
        >
          <div className="glass rounded-2xl overflow-hidden shadow-2xl glow-indigo" style={{ maxWidth: '480px' }}>
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-5 py-4" style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#fb7185' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#fbbf24' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#34d399' }} />
              <div className="flex items-center gap-2 ml-4" style={{ color: '#64748b', fontSize: '0.8rem' }}>
                <Terminal size={13} />
                <span>portfolio.ts</span>
              </div>
            </div>

            {/* Code Lines */}
            <div className="p-6" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: '1.9' }}>
              <AnimatePresence>
                {dynamicCodeLines.slice(0, visibleLines).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <span style={{ color: '#374151', marginRight: '1.5rem', minWidth: '1.5rem', textAlign: 'right', fontSize: '0.75rem' }}>
                      {i + 1}
                    </span>
                    <span style={{ color: line.color }}>{line.text}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {visibleLines < dynamicCodeLines.length && (
                <div className="flex">
                  <span style={{ color: '#374151', marginRight: '1.5rem', minWidth: '1.5rem', textAlign: 'right', fontSize: '0.75rem' }}>
                    {visibleLines + 1}
                  </span>
                  <span className="inline-block w-2 h-4 ml-0.5" style={{ background: '#6366f1', animation: 'blink 0.75s step-end infinite' }} />
                </div>
              )}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 divide-x" style={{ borderTop: '1px solid rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.1)' }}>
              {(profile?.impact_metrics || [
                { label: 'Years Exp', value: '3' },
                { label: 'Projects', value: '30+' },
                { label: 'Impact', value: '$2M+' },
              ]).slice(0, 3).map(({ label, value }) => (
                <div key={label} className="p-4 text-center" style={{ borderRight: '1px solid rgba(99,102,241,0.1)' }}>
                  <div className="gradient-text font-bold text-lg">{value}</div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: '#374151' }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>scroll</span>
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
}
