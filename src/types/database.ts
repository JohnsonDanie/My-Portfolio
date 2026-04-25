// ─── Database Types (matching Firebase Firestore schema) ─────────────────────────────

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  availability_status: 'open' | 'busy' | 'closed';
  location: string;
  email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  resume_url: string;
  avatar_url: string;
  calendar_url: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  solution: string;
  tradeoffs: string;
  impact: string;
  tech_stack: string[];
  image_url: string;
  github_url: string;
  live_url: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'cloud' | 'devops' | 'pattern' | 'database' | 'tool';
  proficiency: 'expert' | 'proficient' | 'familiar';
  icon_slug: string;
  order_index: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string;
  description: string;
  achievements: string[];
  tech_stack: string[];
  company_logo_url: string;
  order_index: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  published: boolean;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_company: string;
  author_avatar_url: string;
  order_index: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
}
