-- Enable pgcrypto for UUIDs if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── TABLE DEFINITIONS ───────────────────────────────────────────────────────

-- 1. Profile (singleton row for the user)
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  bio TEXT NOT NULL,
  availability_status TEXT DEFAULT 'open',
  location TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  calendar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  problem TEXT,
  solution TEXT,
  tradeoffs TEXT,
  impact TEXT,
  tech_stack TEXT[],
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency TEXT NOT NULL,
  icon_slug TEXT,
  order_index INT DEFAULT 0
);

-- 4. Experience
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  location TEXT,
  description TEXT,
  achievements TEXT[],
  tech_stack TEXT[],
  company_logo_url TEXT,
  order_index INT DEFAULT 0
);

-- 5. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  read_time_minutes INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_company TEXT NOT NULL,
  author_avatar_url TEXT,
  order_index INT DEFAULT 0
);

-- 7. Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ROW LEVEL SECURITY (RLS) POLICIES ──────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Access (Anyone can see portfolio data)
CREATE POLICY "Public read access on profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access on skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access on experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access on blog_posts for published posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read access on testimonials" ON testimonials FOR SELECT USING (true);

-- 2. Public Insert Access (Anyone can send a contact message)
CREATE POLICY "Public insert access on contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- 3. Authenticated Admin Access (Only you can modify portfolio data)
-- Profile
CREATE POLICY "Admin full access on profile" ON profile FOR ALL USING (auth.role() = 'authenticated');
-- Projects
CREATE POLICY "Admin full access on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
-- Skills
CREATE POLICY "Admin full access on skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
-- Experience
CREATE POLICY "Admin full access on experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
-- Blog
CREATE POLICY "Admin full access on blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
-- Testimonials
CREATE POLICY "Admin full access on testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
-- Messages (Admin can read, update/mark read, delete)
CREATE POLICY "Admin full access on contact_messages" ON contact_messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on contact_messages modifications" ON contact_messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access on contact_messages deletions" ON contact_messages FOR DELETE USING (auth.role() = 'authenticated');

-- ─── SEED INITIAL PROFILE ────────────────────────────────────────────────────
-- Insert a blank empty profile so it exists for the first update
INSERT INTO profile (name, title, tagline, bio, email)
VALUES ('Your Name', 'Senior SWE', 'Your Tagline', 'Your bio here.', 'admin@example.com')
ON CONFLICT DO NOTHING;
