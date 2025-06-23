# Augie Central - Supabase Setup Guide

This directory contains all the Supabase configuration and API functions for the Augie Central app.

## 🚀 Quick Setup

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Supabase Service Role Key (for admin operations)
# NEVER expose this in client-side code!
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Install Dependencies

```bash
npm install @supabase/supabase-js react-native-url-polyfill
```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Run the SQL to create all tables, policies, and triggers

### 4. Authentication Setup

In your Supabase dashboard:

1. Go to Authentication → Settings
2. Enable email authentication
3. Configure any additional providers if needed
4. Set up email templates for password reset, etc.

## 📁 File Structure

```
src/supabase/
├── README.md           # This setup guide
├── schema.sql          # Complete PostgreSQL schema
├── client.js          # Supabase client configuration
└── api.js             # API functions for all features
```

## 🔑 Key Features

### Authentication

- Email/password signup and signin
- Automatic profile creation on signup
- Secure token storage using Expo SecureStore
- Password reset functionality

### Row Level Security (RLS)

- **Profiles**: Users can view all profiles, update only their own
- **Organizations**: Anyone can view, only admins can manage
- **Announcements**: Anyone can view, only admins can create/edit/delete
- **Events**: Anyone can view, organization members can create/edit/delete
- **RSVPs**: Users can RSVP to events and cancel their own RSVPs

### API Functions

All API functions return a consistent response format:

```javascript
// Response format:
{
  data: dataObject || null,  // The requested data or null if error
  error: "error message" || null  // Error message or null if successful
}
```

#### Available APIs:

- `authApi` - Authentication functions
- `profileApi` - User profile management
- `announcementApi` - Announcements with pagination
- `organizationApi` - Student organizations and memberships
- `eventApi` - Events with RSVP functionality
- `realtimeApi` - Real-time subscriptions

## 🎯 Usage Examples

### Authentication

```javascript
import { authApi } from "./src/supabase/api";

// Sign up
const { data, error } = await authApi.signUp(
  "user@augustana.edu",
  "password123",
  "John Doe"
);

// Sign in
const { data, error } = await authApi.signIn(
  "user@augustana.edu",
  "password123"
);

// Sign out
await authApi.signOut();
```

### Organizations

```javascript
import { organizationApi } from "./src/supabase/api";

// Get all organizations
const { data: organizations } = await organizationApi.getOrganizations();

// Join an organization
await organizationApi.joinOrganization(organizationId);

// Get user's organizations
const { data: userOrgs } = await organizationApi.getUserOrganizations();
```

### Events

```javascript
import { eventApi } from "./src/supabase/api";

// Get events with pagination
const events = await eventApi.getEvents(1, 10);

// RSVP to an event
await eventApi.rsvpToEvent(eventId);

// Create an event
await eventApi.createEvent({
  title: "Study Session",
  description: "Group study for finals",
  location: "Library Room 201",
  start_time: "2024-02-15T14:00:00Z",
  end_time: "2024-02-15T16:00:00Z",
  organization_id: orgId,
  requires_rsvp: true,
});
```

### Real-time Updates

```javascript
import { realtimeApi } from "./src/supabase/api";

// Subscribe to announcements
const channel = realtimeApi.subscribeToAnnouncements((payload) => {
  console.log("Announcement updated:", payload);
  // Update your UI here
});

// Don't forget to unsubscribe when component unmounts
realtimeApi.unsubscribe(channel);
```

## 🔒 Security Best Practices

1. **Never expose service role keys** in client-side code
2. **Always validate user permissions** before performing actions
3. **Use RLS policies** to enforce data access rules
4. **Sanitize user inputs** before database operations
5. **Test your API calls** thoroughly for error handling

## 📊 Database Schema Overview

### Core Tables

- `profiles` - Extended user information
- `student_organizations` - Campus organizations
- `organization_members` - User-organization relationships
- `announcements` - Campus-wide announcements
- `events` - Organization events
- `event_rsvps` - Event attendance tracking

### Key Relationships

- Users ↔ Organizations (many-to-many via `organization_members`)
- Organizations → Events (one-to-many)
- Users → Events (many-to-many via `event_rsvps`)
- Users → Announcements (one-to-many, admin only)

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**

   - Make sure your `.env` file is in the project root
   - Check that variable names start with `EXPO_PUBLIC_`

2. **Authentication errors**

   - Verify your Supabase URL and anon key
   - Check that email authentication is enabled in Supabase dashboard

3. **RLS policy errors**

   - Ensure you're authenticated before making API calls
   - Check that the user has the required permissions

4. **Import errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that all imports are correct and files exist

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Expo documentation](https://docs.expo.dev/)
- Look at the console logs for detailed error messages

## 🚀 Next Steps

1. Set up your Supabase project and configure environment variables
2. Run the database schema to create all tables
3. Test authentication in your React Native app
4. Start building your UI components using the provided API functions
5. Add real-time subscriptions where needed

Good luck building Augie Central! 🎓
