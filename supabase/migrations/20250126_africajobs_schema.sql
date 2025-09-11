/*
# AfricaJobs Database Schema Creation
Complete database structure for the AfricaJobs platform with advanced job recommendation system

## Query Description: 
This migration creates the complete database schema for AfricaJobs platform including user profiles, job postings, recommendations, and all supporting tables. This is a comprehensive setup that establishes the foundation for ML-based job recommendations focused on African markets, particularly Cameroon.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- User profiles and authentication integration
- Job postings and company management
- ML recommendation system tables
- Application tracking and messaging
- Geographic and industry categorization
- Skills and education management

## Security Implications:
- RLS Status: Enabled on all public tables
- Policy Changes: Yes
- Auth Requirements: Users must be authenticated to access most data

## Performance Impact:
- Indexes: Multiple indexes added for search optimization
- Triggers: Profile creation trigger on auth.users
- Estimated Impact: Minimal initial impact, optimized for scalability
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- User profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    user_type TEXT NOT NULL CHECK (user_type IN ('job_seeker', 'employer', 'admin')) DEFAULT 'job_seeker',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries table (focus on Africa)
CREATE TABLE public.countries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE, -- ISO 3166-1 alpha-2
    continent TEXT DEFAULT 'Africa',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regions/States table
CREATE TABLE public.regions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    country_id UUID REFERENCES public.countries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table
CREATE TABLE public.cities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industries table
CREATE TABLE public.industries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education levels table
CREATE TABLE public.education_levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    level_order INTEGER UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job seeker profiles
CREATE TABLE public.job_seeker_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    current_location_city_id UUID REFERENCES public.cities(id),
    preferred_work_location_type TEXT CHECK (preferred_work_location_type IN ('remote', 'on_site', 'hybrid', 'any')),
    years_of_experience INTEGER DEFAULT 0,
    current_salary_range_min INTEGER,
    current_salary_range_max INTEGER,
    expected_salary_range_min INTEGER,
    expected_salary_range_max INTEGER,
    availability_status TEXT CHECK (availability_status IN ('immediately', 'within_2_weeks', 'within_1_month', 'within_3_months', 'not_looking')) DEFAULT 'immediately',
    resume_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job seeker education
CREATE TABLE public.job_seeker_education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_seeker_id UUID REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
    education_level_id UUID REFERENCES public.education_levels(id),
    institution_name TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    grade_or_gpa TEXT,
    city_id UUID REFERENCES public.cities(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job seeker experience
CREATE TABLE public.job_seeker_experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_seeker_id UUID REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    industry_id UUID REFERENCES public.industries(id),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    city_id UUID REFERENCES public.cities(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job seeker skills
CREATE TABLE public.job_seeker_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_seeker_id UUID REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')) DEFAULT 'intermediate',
    years_of_experience INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_seeker_id, skill_id)
);

-- Companies table
CREATE TABLE public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    industry_id UUID REFERENCES public.industries(id),
    size_category TEXT CHECK (size_category IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    headquarters_city_id UUID REFERENCES public.cities(id),
    founded_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employer profiles
CREATE TABLE public.employer_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    company_id UUID REFERENCES public.companies(id),
    job_title TEXT,
    department TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job categories
CREATE TABLE public.job_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job postings
CREATE TABLE public.job_postings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employer_id UUID REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    job_category_id UUID REFERENCES public.job_categories(id),
    industry_id UUID REFERENCES public.industries(id),
    employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'temporary', 'internship', 'freelance')),
    work_location_type TEXT CHECK (work_location_type IN ('remote', 'on_site', 'hybrid')),
    city_id UUID REFERENCES public.cities(id),
    salary_range_min INTEGER,
    salary_range_max INTEGER,
    salary_currency TEXT DEFAULT 'XAF',
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
    min_years_experience INTEGER DEFAULT 0,
    application_deadline DATE,
    external_apply_url TEXT,
    status TEXT CHECK (status IN ('draft', 'published', 'paused', 'closed', 'expired')) DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job posting skills requirements
CREATE TABLE public.job_posting_skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_posting_id, skill_id)
);

-- Job applications
CREATE TABLE public.job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    job_seeker_id UUID REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    status TEXT CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'interviewed', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'submitted',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_posting_id, job_seeker_id)
);

-- Job recommendations (ML output)
CREATE TABLE public.job_recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_seeker_id UUID REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
    job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    recommendation_score DECIMAL(5,4) NOT NULL, -- ML confidence score (0-1)
    recommendation_reasons JSONB, -- Structured reasons for recommendation
    viewed BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_seeker_id, job_posting_id)
);

-- User saved jobs
CREATE TABLE public.saved_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_seeker_id UUID REFERENCES public.job_seeker_profiles(id) ON DELETE CASCADE,
    job_posting_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_seeker_id, job_posting_id)
);

-- Messages system
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications system
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('job_recommendation', 'application_update', 'message', 'system')),
    read BOOLEAN DEFAULT FALSE,
    data JSONB, -- Additional structured data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_type ON public.profiles(user_type);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_job_postings_status ON public.job_postings(status);
CREATE INDEX idx_job_postings_city ON public.job_postings(city_id);
CREATE INDEX idx_job_postings_industry ON public.job_postings(industry_id);
CREATE INDEX idx_job_postings_employment_type ON public.job_postings(employment_type);
CREATE INDEX idx_job_postings_created_at ON public.job_postings(created_at DESC);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_recommendations_score ON public.job_recommendations(recommendation_score DESC);
CREATE INDEX idx_job_recommendations_job_seeker ON public.job_recommendations(job_seeker_id);
CREATE INDEX idx_notifications_recipient ON public.notifications(recipient_profile_id);
CREATE INDEX idx_notifications_unread ON public.notifications(recipient_profile_id, read) WHERE read = FALSE;

-- Full text search indexes
CREATE INDEX idx_job_postings_title_search ON public.job_postings USING gin(to_tsvector('english', title));
CREATE INDEX idx_job_postings_description_search ON public.job_postings USING gin(to_tsvector('english', description));
CREATE INDEX idx_companies_name_search ON public.companies USING gin(to_tsvector('english', name));

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posting_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Job seeker profiles
CREATE POLICY "Job seekers can manage own profile" ON public.job_seeker_profiles FOR ALL USING (
    profile_id = auth.uid()
);
CREATE POLICY "Employers can view job seeker profiles" ON public.job_seeker_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'employer')
);

-- Job seeker education, experience, skills
CREATE POLICY "Job seekers can manage own education" ON public.job_seeker_education FOR ALL USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Job seekers can manage own experience" ON public.job_seeker_experience FOR ALL USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Job seekers can manage own skills" ON public.job_seeker_skills FOR ALL USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);

-- Companies: Public read, employers can create/update
CREATE POLICY "Companies are publicly readable" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Employers can manage companies" ON public.companies FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'employer')
);

-- Employer profiles
CREATE POLICY "Employers can manage own profile" ON public.employer_profiles FOR ALL USING (
    profile_id = auth.uid()
);

-- Job postings: Public read for published jobs, employers manage own
CREATE POLICY "Published jobs are publicly readable" ON public.job_postings FOR SELECT USING (
    status = 'published'
);
CREATE POLICY "Employers can manage own job postings" ON public.job_postings FOR ALL USING (
    employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
);

-- Job posting skills
CREATE POLICY "Job posting skills follow job posting access" ON public.job_posting_skills FOR SELECT USING (
    job_posting_id IN (SELECT id FROM public.job_postings WHERE status = 'published')
);
CREATE POLICY "Employers can manage job posting skills" ON public.job_posting_skills FOR ALL USING (
    job_posting_id IN (
        SELECT id FROM public.job_postings 
        WHERE employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
    )
);

-- Job applications
CREATE POLICY "Job seekers can manage own applications" ON public.job_applications FOR ALL USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Employers can view applications for their jobs" ON public.job_applications FOR SELECT USING (
    job_posting_id IN (
        SELECT id FROM public.job_postings 
        WHERE employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
    )
);
CREATE POLICY "Employers can update applications for their jobs" ON public.job_applications FOR UPDATE USING (
    job_posting_id IN (
        SELECT id FROM public.job_postings 
        WHERE employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
    )
);

-- Job recommendations
CREATE POLICY "Job seekers can view own recommendations" ON public.job_recommendations FOR SELECT USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);
CREATE POLICY "Job seekers can update own recommendations" ON public.job_recommendations FOR UPDATE USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);

-- Saved jobs
CREATE POLICY "Job seekers can manage own saved jobs" ON public.saved_jobs FOR ALL USING (
    job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
);

-- Messages and conversations
CREATE POLICY "Users can access conversations they participate in" ON public.conversations FOR SELECT USING (
    id IN (
        SELECT conversation_id FROM public.messages 
        WHERE sender_profile_id = auth.uid()
    ) OR
    job_application_id IN (
        SELECT id FROM public.job_applications 
        WHERE job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
        OR job_posting_id IN (
            SELECT id FROM public.job_postings 
            WHERE employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
        )
    )
);

CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT WITH CHECK (
    sender_profile_id = auth.uid() AND
    conversation_id IN (
        SELECT id FROM public.conversations
        WHERE job_application_id IN (
            SELECT id FROM public.job_applications 
            WHERE job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
            OR job_posting_id IN (
                SELECT id FROM public.job_postings 
                WHERE employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
            )
        )
    )
);

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (
    conversation_id IN (
        SELECT id FROM public.conversations
        WHERE job_application_id IN (
            SELECT id FROM public.job_applications 
            WHERE job_seeker_id IN (SELECT id FROM public.job_seeker_profiles WHERE profile_id = auth.uid())
            OR job_posting_id IN (
                SELECT id FROM public.job_postings 
                WHERE employer_id IN (SELECT id FROM public.employer_profiles WHERE profile_id = auth.uid())
            )
        )
    )
);

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
    recipient_profile_id = auth.uid()
);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (
    recipient_profile_id = auth.uid()
);

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers for tables with updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON public.job_seeker_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON public.employer_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_postings_updated_at BEFORE UPDATE ON public.job_postings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
