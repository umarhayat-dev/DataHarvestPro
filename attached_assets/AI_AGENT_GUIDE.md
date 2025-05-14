# AI Agent Technical Guide - Alyusr Quran Institute Platform

This guide provides detailed technical information about the Alyusr Quran Institute Platform for AI agents to understand the project structure, authentication flow, database schema, and API endpoints.

## Project Architecture

### Frontend Architecture
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching and caching
- ShadCN UI components with Tailwind CSS
- Zod for form validation

### Backend Architecture
- Express.js API server
- Drizzle ORM with PostgreSQL
- Session-based authentication
- RESTful API design

## Authentication Flow

The application uses a session-based authentication system:

1. User submits credentials to `/api/auth/login`
2. Server validates credentials and creates a session
3. Session ID is stored in a cookie
4. Protected routes check for the session cookie using `isAuthenticated` middleware
5. Admin routes have an additional `isAdmin` middleware check
6. Sessions are stored in the PostgreSQL database for persistence

Authentication-related code is located in:
- `server/auth.ts` - Server-side authentication logic
- `client/src/hooks/use-auth.tsx` - Client-side authentication hook

## Database Schema Details

The database uses Drizzle ORM with PostgreSQL. The schema is defined in `shared/schema.ts`:

### Core Tables

#### Users
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

#### Courses
```typescript
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }),
  duration: varchar("duration", { length: 50 }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  featured: boolean("featured").default(false).notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  instructorName: varchar("instructor_name", { length: 100 }),
  instructorTitle: varchar("instructor_title", { length: 100 }),
  instructorImage: varchar("instructor_image", { length: 255 }),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Relation Tables

The database has multiple relations:
- Courses belong to Categories
- Career/Student Applications have status tracking
- Testimonials and Team Members have visibility flags

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/logout` - Logout current user
- `GET /api/auth/user` - Get current authenticated user

### Course Endpoints
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get a specific course
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/category/:id` - Get courses by category
- `POST /api/courses` - Create a new course (admin only)
- `PATCH /api/courses/:id` - Update a course (admin only)

### Career Endpoints
- `GET /api/jobs` - Get active job listings
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job listing (admin only)
- `PATCH /api/jobs/:id` - Update a job listing (admin only)
- `POST /api/careers/apply` - Submit a career application

### Admin Endpoints
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/applications` - Get all student applications
- `GET /api/admin/career-applications` - Get all career applications
- `PATCH /api/admin/applications/:id` - Update application status
- `GET /api/admin/messages` - Get all contact messages
- `PATCH /api/admin/messages/:id/read` - Mark message as read

### Content Endpoints
- `GET /api/testimonials` - Get active testimonials
- `POST /api/testimonials` - Create a testimonial (admin only)
- `GET /api/team` - Get active team members
- `POST /api/team` - Create a team member (admin only)
- `POST /api/contact` - Submit a contact message

## Frontend Routes

### Public Routes
- `/` - Home page
- `/about` - About page
- `/courses` - All courses
- `/courses/:id` - Course details
- `/career` - Career opportunities
- `/contact` - Contact page

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/courses` - Course management
- `/admin/applications` - Student application management
- `/admin/careers` - Career application management
- `/admin/messages` - Contact message management
- `/admin/team` - Team member management
- `/admin/testimonials` - Testimonial management
- `/admin/settings` - Admin settings

## Component Structure

### Admin Components
- `AdminSidebar` - Navigation sidebar for admin panel
- `StatCard` - Dashboard analytics card
- `AdminLayout` - Layout wrapper for admin pages
- `ApplicationList` - Student application management
- `CareerApplicationList` - Career application management
- `MessageList` - Contact message management

### Form Components
- `CourseForm` - Add/edit course form
- `JobForm` - Add/edit job listing form
- `ContactForm` - Contact form
- `CareerApplicationForm` - Career application form
- `StudentApplicationForm` - Student application form

### Layout Components
- `Navbar` - Main navigation header
- `Footer` - Site footer
- `MobileMenu` - Responsive mobile navigation menu

## Error Handling

The application implements consistent error handling:

1. API endpoints return appropriate HTTP status codes
2. Client-side error handling via React Query's `onError` callbacks
3. Form validation errors using Zod schemas
4. UI error states for failed data fetching
5. Console logging for debugging

## Common Issues and Solutions

### 401 Unauthorized Errors
Check if user is authenticated. Admin routes require admin privileges.

```typescript
// Check if user has admin role
const { user } = useAuth();
if (!user || !user.isAdmin) {
  // Handle unauthorized access
}
```

### Database Connection Issues
Verify the DATABASE_URL environment variable is correctly set.

```
DATABASE_URL=postgresql://username:password@localhost:5432/alyusr_db
```

### API Request Format
All mutations should use the following format:

```typescript
const mutation = useMutation({
  mutationFn: async (values) => {
    const response = await apiRequest("/api/endpoint", {
      method: "POST",
      body: JSON.stringify(values),
    });
    return response;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/relevantEndpoint"] });
    // Show success message
  },
  onError: (error) => {
    // Handle error
  }
});
```

## Working with Authentication

To implement authenticated requests in new features:

1. Use the `useAuth()` hook to access user data
2. Protect server routes with middleware
3. Include credentials in fetch requests
4. Handle authorization errors appropriately

Example:
```typescript
// Client-side authentication check
const { user, isLoading, isAuthenticated } = useAuth();

if (isLoading) {
  return <LoadingSpinner />;
}

if (!isAuthenticated) {
  return <Navigate to="/login" />;
}

// Continue with authenticated content
```

## Styling Guidelines

The project uses a consistent color scheme:

- Primary: `#2563eb` (blue)
- Secondary: `#10b981` (emerald)
- Accent: `#f59e0b` (amber)
- Neutral: Grayscale from 50-900

Use these color variables for consistency throughout the application.