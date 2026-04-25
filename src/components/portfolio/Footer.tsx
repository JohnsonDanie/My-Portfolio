import { Code2, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../Icons';
import { useProfile } from '../../hooks';

export default function Footer() {
  const { data: profile } = useProfile();
  const year = new Date().getFullYear();

  return (
    <footer className="section-padding py-12" style={{ background: '#030810', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Code2 size={14} style={{ color: 'white' }} />
            </div>
            <span className="gradient-text font-bold">danieljohnson.dev</span>
          </div>

          <p className="text-sm flex items-center gap-2" style={{ color: '#374151' }}>
            Built with <Heart size={13} style={{ color: '#fb7185' }} fill="#fb7185" /> using React, TypeScript & Firebase
          </p>

          <div className="flex items-center gap-4">
            {[
              { href: profile?.github_url || '#', icon: <GithubIcon size={17} /> },
              { href: profile?.linkedin_url || '#', icon: <LinkedinIcon size={17} /> },
              { href: profile?.twitter_url || '#', icon: <TwitterIcon size={17} /> },
            ].map(({ href, icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer"
                className="transition-colors duration-200"
                style={{ color: '#374151' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 text-xs" style={{ color: '#1e293b' }}>
          © {year} {profile?.name || 'Daniel Johnson'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
