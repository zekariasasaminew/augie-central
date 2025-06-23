import { supabase } from "./client";

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================

export const authApi = {
  // Sign up with email and password
  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred during sign up",
      };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred during sign in",
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred during sign out",
      };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      return { data: session, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting session",
      };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred during password reset",
      };
    }
  },
};

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

export const profileApi = {
  // Get current user profile
  getCurrentProfile: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting profile",
      };
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred updating profile",
      };
    }
  },

  // Get profile by ID
  getProfileById: async (id) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting profile",
      };
    }
  },
};

// ============================================================================
// ANNOUNCEMENTS FUNCTIONS
// ============================================================================

export const announcementApi = {
  // Get all announcements with pagination
  getAnnouncements: async (page = 1, pageSize = 10) => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("announcements")
        .select(
          `
          *,
          profiles:created_by (
            name,
            email
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasMore: false,
        };
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > to + 1,
      };
    } catch (err) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
      };
    }
  },

  // Create announcement (admin only)
  createAnnouncement: async (announcement) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { data, error } = await supabase
        .from("announcements")
        .insert({
          ...announcement,
          created_by: user.id,
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred creating announcement",
      };
    }
  },

  // Update announcement (admin only)
  updateAnnouncement: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred updating announcement",
      };
    }
  },

  // Delete announcement (admin only)
  deleteAnnouncement: async (id) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred deleting announcement",
      };
    }
  },
};

// ============================================================================
// STUDENT ORGANIZATIONS FUNCTIONS
// ============================================================================

export const organizationApi = {
  // Get all organizations with member count
  getOrganizations: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      const { data, error } = await supabase
        .from("student_organizations")
        .select(
          `
          *,
          organization_members (
            user_id
          )
        `
        )
        .order("name");

      if (error) return { data: null, error: error.message };

      const organizations =
        data?.map((org) => ({
          ...org,
          member_count: org.organization_members.length,
          user_is_member: userId
            ? org.organization_members.some(
                (member) => member.user_id === userId
              )
            : false,
          organization_members: undefined, // Remove from response
        })) || [];

      return { data: organizations, error: null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting organizations",
      };
    }
  },

  // Get organization by ID
  getOrganizationById: async (id) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      const { data, error } = await supabase
        .from("student_organizations")
        .select(
          `
          *,
          organization_members (
            user_id
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) return { data: null, error: error.message };

      const organization = {
        ...data,
        member_count: data.organization_members.length,
        user_is_member: userId
          ? data.organization_members.some(
              (member) => member.user_id === userId
            )
          : false,
        organization_members: undefined, // Remove from response
      };

      return { data: organization, error: null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting organization",
      };
    }
  },

  // Create organization (admin only)
  createOrganization: async (organization) => {
    try {
      const { data, error } = await supabase
        .from("student_organizations")
        .insert(organization)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred creating organization",
      };
    }
  },

  // Join organization
  joinOrganization: async (organizationId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { data, error } = await supabase
        .from("organization_members")
        .insert({
          user_id: user.id,
          organization_id: organizationId,
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred joining organization",
      };
    }
  },

  // Leave organization
  leaveOrganization: async (organizationId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { error } = await supabase
        .from("organization_members")
        .delete()
        .eq("user_id", user.id)
        .eq("organization_id", organizationId);

      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred leaving organization",
      };
    }
  },

  // Get user's organizations
  getUserOrganizations: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { data, error } = await supabase
        .from("organization_members")
        .select(
          `
          student_organizations (*)
        `
        )
        .eq("user_id", user.id);

      if (error) return { data: null, error: error.message };

      const organizations =
        data?.map((item) => item.student_organizations).filter(Boolean) || [];
      return { data: organizations, error: null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting user organizations",
      };
    }
  },
};

// ============================================================================
// EVENTS FUNCTIONS
// ============================================================================

export const eventApi = {
  // Get all events with organization info and RSVP count
  getEvents: async (page = 1, pageSize = 10, organizationId) => {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;

      let query = supabase
        .from("events")
        .select(
          `
          *,
          student_organizations (
            name,
            logo_url
          ),
          event_rsvps (
            user_id
          )
        `,
          { count: "exact" }
        )
        .order("start_time", { ascending: true });

      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }

      const { data, error, count } = await query.range(from, to);

      if (error) {
        return {
          data: [],
          total: 0,
          page,
          pageSize,
          hasMore: false,
        };
      }

      const events =
        data?.map((event) => ({
          ...event,
          rsvp_count: event.event_rsvps.length,
          user_has_rsvped: userId
            ? event.event_rsvps.some((rsvp) => rsvp.user_id === userId)
            : false,
          event_rsvps: undefined, // Remove from response
        })) || [];

      return {
        data: events,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > to + 1,
      };
    } catch (err) {
      return {
        data: [],
        total: 0,
        page,
        pageSize,
        hasMore: false,
      };
    }
  },

  // Create event
  createEvent: async (event) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert(event)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred creating event",
      };
    }
  },

  // Update event
  updateEvent: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred updating event",
      };
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred deleting event",
      };
    }
  },

  // RSVP to event
  rsvpToEvent: async (eventId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { data, error } = await supabase
        .from("event_rsvps")
        .insert({
          user_id: user.id,
          event_id: eventId,
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred RSVPing to event",
      };
    }
  },

  // Cancel RSVP
  cancelRsvp: async (eventId) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { data: null, error: "No authenticated user" };

      const { error } = await supabase
        .from("event_rsvps")
        .delete()
        .eq("user_id", user.id)
        .eq("event_id", eventId);

      return { data: null, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred canceling RSVP",
      };
    }
  },

  // Get event RSVPs
  getEventRsvps: async (eventId) => {
    try {
      const { data, error } = await supabase
        .from("event_rsvps")
        .select(
          `
          *,
          profiles (
            name,
            email
          )
        `
        )
        .eq("event_id", eventId)
        .order("responded_at", { ascending: false });

      return { data, error: error?.message || null };
    } catch (err) {
      return {
        data: null,
        error: "An unexpected error occurred getting event RSVPs",
      };
    }
  },
};

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export const realtimeApi = {
  // Subscribe to announcements changes
  subscribeToAnnouncements: (callback) => {
    return supabase
      .channel("announcements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        callback
      )
      .subscribe();
  },

  // Subscribe to events changes
  subscribeToEvents: (callback) => {
    return supabase
      .channel("events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        callback
      )
      .subscribe();
  },

  // Subscribe to organization changes
  subscribeToOrganizations: (callback) => {
    return supabase
      .channel("organizations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_organizations" },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (channel) => {
    return supabase.removeChannel(channel);
  },
};
