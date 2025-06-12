// Mock Announcements Data
export const mockAnnouncements = [
  {
    id: "1",
    title: "Welcome Back to Spring Semester!",
    description:
      "The Office of Student Life welcomes all students back for an exciting spring semester filled with opportunities for growth, learning, and community engagement.",
    content:
      "We have many exciting events planned this semester including career fairs, cultural celebrations, academic workshops, and recreational activities. Make sure to check the events calendar regularly and follow us on social media for updates.",
    imageUrl:
      "https://via.placeholder.com/400x200/1B365D/FFFFFF?text=Spring+Welcome",
    date: new Date("2024-01-15T09:00:00"),
    author: "Office of Student Life",
    isOfficial: true,
    tags: ["announcement", "semester", "welcome"],
  },
  {
    id: "2",
    title: "Mental Health Awareness Week",
    description:
      "Join us for Mental Health Awareness Week featuring workshops, support groups, and wellness activities to promote student wellbeing.",
    content:
      "This week-long event includes daily meditation sessions, stress management workshops, counseling resources, and peer support meetings. All events are free and open to all students.",
    imageUrl:
      "https://via.placeholder.com/400x200/34C759/FFFFFF?text=Mental+Health",
    date: new Date("2024-02-05T10:00:00"),
    author: "Student Wellness Center",
    isOfficial: true,
    tags: ["health", "wellness", "mental-health"],
  },
  {
    id: "3",
    title: "International Food Festival",
    description:
      "Experience flavors from around the world at our annual International Food Festival in the Student Center.",
    content:
      "Join us for an evening of cultural exchange through food. Local restaurants and student organizations will showcase authentic dishes from various countries. Live music and cultural performances throughout the evening.",
    imageUrl:
      "https://via.placeholder.com/400x200/F4B942/FFFFFF?text=Food+Festival",
    date: new Date("2024-02-20T17:00:00"),
    author: "International Student Association",
    isOfficial: true,
    tags: ["culture", "food", "international", "festival"],
  },
];

// Mock Student Organizations Data
export const mockOrganizations = [
  {
    id: "1",
    name: "Student Government Association",
    description:
      "Representing student voices and advocating for student interests across campus.",
    category: "governance",
    logoUrl: "https://via.placeholder.com/100x100/1B365D/FFFFFF?text=SGA",
    memberCount: 45,
    meetingSchedule: "Every Tuesday at 7:00 PM",
    contactEmail: "sga@augustana.edu",
    isJoined: false,
    tags: ["leadership", "advocacy", "student-government"],
  },
  {
    id: "2",
    name: "International Student Association",
    description:
      "Promoting cultural diversity and supporting international students on campus.",
    category: "cultural",
    logoUrl: "https://via.placeholder.com/100x100/34C759/FFFFFF?text=ISA",
    memberCount: 78,
    meetingSchedule: "First Friday of each month at 6:00 PM",
    contactEmail: "isa@augustana.edu",
    isJoined: true,
    tags: ["culture", "international", "diversity"],
  },
  {
    id: "3",
    name: "Computer Science Club",
    description:
      "Connecting CS students through coding projects, tech talks, and industry networking.",
    category: "academic",
    logoUrl: "https://via.placeholder.com/100x100/007AFF/FFFFFF?text=CS",
    memberCount: 92,
    meetingSchedule: "Every Wednesday at 5:30 PM",
    contactEmail: "csclub@augustana.edu",
    isJoined: false,
    tags: ["technology", "programming", "academic"],
  },
  {
    id: "4",
    name: "Environmental Action Club",
    description:
      "Working together to promote sustainability and environmental awareness on campus.",
    category: "service",
    logoUrl: "https://via.placeholder.com/100x100/34C759/FFFFFF?text=ECO",
    memberCount: 56,
    meetingSchedule: "Every Thursday at 4:00 PM",
    contactEmail: "eco@augustana.edu",
    isJoined: false,
    tags: ["environment", "sustainability", "service"],
  },
  {
    id: "5",
    name: "Theatre Arts Society",
    description:
      "Bringing together students passionate about theatre, drama, and performing arts.",
    category: "arts",
    logoUrl: "https://via.placeholder.com/100x100/FF9500/FFFFFF?text=TAS",
    memberCount: 34,
    meetingSchedule: "Every Monday at 7:30 PM",
    contactEmail: "theatre@augustana.edu",
    isJoined: true,
    tags: ["arts", "theatre", "performance"],
  },
  {
    id: "6",
    name: "Campus Ministry",
    description:
      "Fostering spiritual growth and community service opportunities for all students.",
    category: "spiritual",
    logoUrl: "https://via.placeholder.com/100x100/8A2BE2/FFFFFF?text=CM",
    memberCount: 67,
    meetingSchedule: "Sunday evenings at 7:00 PM",
    contactEmail: "ministry@augustana.edu",
    isJoined: false,
    tags: ["spiritual", "service", "community"],
  },
];

// Organization categories
export const organizationCategories = [
  { id: "all", name: "All Organizations", icon: "apps" },
  { id: "academic", name: "Academic", icon: "school" },
  { id: "cultural", name: "Cultural", icon: "public" },
  { id: "service", name: "Service", icon: "volunteer-activism" },
  { id: "arts", name: "Arts", icon: "palette" },
  { id: "governance", name: "Governance", icon: "how-to-vote" },
  { id: "spiritual", name: "Spiritual", icon: "church" },
];

// Mock Events Data
export const mockEvents = [
  {
    id: "1",
    title: "Career Fair 2024",
    description:
      "Connect with top employers and explore career opportunities across various industries.",
    date: "2024-02-28",
    time: "10:00 AM - 4:00 PM",
    location: "Student Center Ballroom",
    category: "career",
    organizer: "Career Services",
    isRSVPed: false,
    attendeeCount: 234,
    maxAttendees: 500,
    tags: ["career", "networking", "employment"],
    details:
      "Bring copies of your resume and dress professionally. Representatives from over 50 companies will be present.",
  },
  {
    id: "2",
    title: "Study Abroad Information Session",
    description:
      "Learn about exciting study abroad opportunities for the upcoming academic year.",
    date: "2024-02-15",
    time: "7:00 PM - 8:30 PM",
    location: "Library Conference Room A",
    category: "academic",
    organizer: "International Programs",
    isRSVPed: true,
    attendeeCount: 45,
    maxAttendees: 60,
    tags: ["study-abroad", "international", "academic"],
    details:
      "Representatives from partner universities will present program options and answer questions.",
  },
  {
    id: "3",
    title: "Campus Cleanup Day",
    description:
      "Join us in beautifying our campus while earning community service hours.",
    date: "2024-02-22",
    time: "9:00 AM - 12:00 PM",
    location: "Meet at Student Center",
    category: "service",
    organizer: "Environmental Action Club",
    isRSVPed: false,
    attendeeCount: 67,
    maxAttendees: 100,
    tags: ["service", "environment", "community"],
    details:
      "Gloves and supplies provided. Lunch will be served after the cleanup.",
  },
  {
    id: "4",
    title: "Winter Formal Dance",
    description: "An elegant evening of dancing, dinner, and entertainment.",
    date: "2024-02-29",
    time: "7:00 PM - 11:00 PM",
    location: "Grand Ballroom",
    category: "social",
    organizer: "Student Activities Board",
    isRSVPed: true,
    attendeeCount: 156,
    maxAttendees: 200,
    tags: ["social", "dance", "formal"],
    details:
      "Semi-formal attire required. Tickets include dinner and refreshments.",
  },
  {
    id: "5",
    title: "Mental Health Workshop",
    description: "Learn stress management techniques and self-care strategies.",
    date: "2024-02-14",
    time: "2:00 PM - 3:30 PM",
    location: "Wellness Center",
    category: "wellness",
    organizer: "Student Wellness Center",
    isRSVPed: false,
    attendeeCount: 23,
    maxAttendees: 30,
    tags: ["wellness", "mental-health", "workshop"],
    details: "Free workshop includes materials and light refreshments.",
  },
];

// Event categories
export const eventCategories = [
  { id: "all", name: "All Events", icon: "event" },
  { id: "academic", name: "Academic", icon: "school" },
  { id: "career", name: "Career", icon: "work" },
  { id: "social", name: "Social", icon: "people" },
  { id: "service", name: "Service", icon: "volunteer-activism" },
  { id: "wellness", name: "Wellness", icon: "favorite" },
];

// Mock Users Data
export const mockUsers = [
  {
    id: "1",
    email: "john.doe@augustana.edu",
    password: "password123",
    name: "John Doe",
    profilePicture: "https://via.placeholder.com/150x150/1B365D/FFFFFF?text=JD",
    year: "Junior",
    major: "Computer Science",
    isAdmin: false,
  },
  {
    id: "2",
    email: "admin@augustana.edu",
    password: "admin123",
    name: "Student Life Admin",
    profilePicture: "https://via.placeholder.com/150x150/F4B942/FFFFFF?text=SL",
    year: "Staff",
    major: "Administration",
    isAdmin: true,
  },
  {
    id: "3",
    email: "jane.smith@augustana.edu",
    password: "password123",
    name: "Jane Smith",
    profilePicture: "https://via.placeholder.com/150x150/34C759/FFFFFF?text=JS",
    year: "Senior",
    major: "Psychology",
    isAdmin: false,
  },
];

// Calendar Events (for calendar view)
export const calendarEvents = {
  "2024-02-14": [{ id: "5", title: "Mental Health Workshop", time: "2:00 PM" }],
  "2024-02-15": [
    { id: "2", title: "Study Abroad Info Session", time: "7:00 PM" },
  ],
  "2024-02-22": [{ id: "3", title: "Campus Cleanup Day", time: "9:00 AM" }],
  "2024-02-28": [{ id: "1", title: "Career Fair 2024", time: "10:00 AM" }],
  "2024-02-29": [{ id: "4", title: "Winter Formal Dance", time: "7:00 PM" }],
};

// Helper functions
export const getEventsByDate = (date) => {
  return calendarEvents[date] || [];
};

export const getTodaysEvents = () => {
  const today = new Date().toISOString().split("T")[0];
  return getEventsByDate(today);
};

export const getOrganizationsByCategory = (category) => {
  if (category === "all") return mockOrganizations;
  return mockOrganizations.filter((org) => org.category === category);
};

export const getEventsByCategory = (category) => {
  if (category === "all") return mockEvents;
  return mockEvents.filter((event) => event.category === category);
};

export const validateUserCredentials = (email, password) => {
  return mockUsers.find(
    (user) => user.email === email && user.password === password
  );
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isAugustanaEmail = (email) => {
  return email.toLowerCase().includes("@augustana.edu");
};
