-- Augie Central Database Schema
-- This file contains the complete PostgreSQL schema for the Augie Central app

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Create profiles table to store additional user information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STUDENT ORGANIZATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.student_organizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for student_organizations
ALTER TABLE public.student_organizations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ORGANIZATION MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    organization_id UUID REFERENCES public.student_organizations(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

-- Enable RLS for organization_members
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    organization_id UUID REFERENCES public.student_organizations(id) ON DELETE CASCADE NOT NULL,
    requires_rsvp BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT events_end_after_start CHECK (end_time > start_time)
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- EVENT RSVPS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Enable RLS for event_rsvps
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_organization_id ON public.events(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON public.organization_members(organization_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Student organizations policies
DROP POLICY IF EXISTS "Anyone can view organizations" ON public.student_organizations;
CREATE POLICY "Anyone can view organizations" ON public.student_organizations
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage organizations" ON public.student_organizations;
CREATE POLICY "Admins can manage organizations" ON public.student_organizations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Organization members policies
DROP POLICY IF EXISTS "Users can view all memberships" ON public.organization_members;
CREATE POLICY "Users can view all memberships" ON public.organization_members
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can join organizations" ON public.organization_members;
CREATE POLICY "Users can join organizations" ON public.organization_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave organizations" ON public.organization_members;
CREATE POLICY "Users can leave organizations" ON public.organization_members
    FOR DELETE USING (auth.uid() = user_id);

-- Announcements policies
DROP POLICY IF EXISTS "Anyone can view announcements" ON public.announcements;
CREATE POLICY "Anyone can view announcements" ON public.announcements
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Only admins can create announcements" ON public.announcements;
CREATE POLICY "Only admins can create announcements" ON public.announcements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Only admins can update announcements" ON public.announcements;
CREATE POLICY "Only admins can update announcements" ON public.announcements
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Only admins can delete announcements" ON public.announcements;
CREATE POLICY "Only admins can delete announcements" ON public.announcements
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Events policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Organization members can create events" ON public.events;
CREATE POLICY "Organization members can create events" ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.user_id = auth.uid()
            AND organization_members.organization_id = events.organization_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Organization members can update events" ON public.events;
CREATE POLICY "Organization members can update events" ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.user_id = auth.uid()
            AND organization_members.organization_id = events.organization_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Organization members can delete events" ON public.events;
CREATE POLICY "Organization members can delete events" ON public.events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.user_id = auth.uid()
            AND organization_members.organization_id = events.organization_id
        ) OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.is_admin = true
        )
    );

-- Event RSVPs policies
DROP POLICY IF EXISTS "Users can view all RSVPs" ON public.event_rsvps;
CREATE POLICY "Users can view all RSVPs" ON public.event_rsvps
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can RSVP to events" ON public.event_rsvps;
CREATE POLICY "Users can RSVP to events" ON public.event_rsvps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can cancel their RSVP" ON public.event_rsvps;
CREATE POLICY "Users can cancel their RSVP" ON public.event_rsvps
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_student_organizations_updated_at ON public.student_organizations;
CREATE TRIGGER update_student_organizations_updated_at
    BEFORE UPDATE ON public.student_organizations
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON public.announcements;
CREATE TRIGGER update_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column(); 