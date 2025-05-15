import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.firestore";
import { setupAuth, isAuthenticated, isAdmin, createAdminUser } from "./auth";
import { 
  insertCategorySchema, 
  insertCourseSchema, 
  insertTestimonialSchema, 
  insertTeamMemberSchema, 
  insertJobSchema, 
  insertCareerApplicationSchema, 
  insertStudentApplicationSchema, 
  insertContactMessageSchema
  // ValidationError import removed as it was unused
} from "@shared/schema";

// Error types
interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Application status type
type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

/**
 * Registers all routes and middleware for the application
 * @param app Express application
 * @returns HTTP server instance
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // Create admin user
  await initializeAdminUser();
  
  // Register route groups
  registerPublicRoutes(app);
  registerAuthenticatedRoutes(app);
  registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}

/**
 * Initialize admin user for the application
 */
async function initializeAdminUser(): Promise<void> {
  try {
    // Get admin credentials from environment variables with fallbacks for development
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Ensure password is set in production
    if (!adminPassword && process.env.NODE_ENV === 'production') {
      console.error('ADMIN_PASSWORD environment variable must be set in production!');
      // In production, we should fail fast if the password isn't set
      process.exit(1);
    }

    // Use the environment variable password or a development fallback
    const password = adminPassword || 'dev_password_replace_in_production';
    
    await createAdminUser(adminUsername, password);
    console.log('Admin user setup completed');
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

/**
 * Register public routes that don't require authentication
 */
function registerPublicRoutes(app: Express): void {
  // Categories
  app.get("/api/categories", asyncHandler(async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  }));

  // Courses
  app.get("/api/courses", asyncHandler(async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  }));

  app.get("/api/courses/featured", asyncHandler(async (req, res) => {
    const featuredCourses = await storage.getFeaturedCourses();
    res.json(featuredCourses);
  }));

  app.get("/api/courses/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;
    const course = await storage.getCourseById(id);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(course);
  }));

  app.get("/api/courses/category/:id", asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const courses = await storage.getCoursesByCategory(categoryId);
    res.json(courses);
  }));

  // Testimonials
  app.get("/api/testimonials", asyncHandler(async (req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  }));

  // Team members
  app.get("/api/team", asyncHandler(async (req, res) => {
    const teamMembers = await storage.getTeamMembers();
    res.json(teamMembers);
  }));

  // Jobs
  app.get("/api/jobs", asyncHandler(async (req, res) => {
    const jobs = await storage.getActiveJobs();
    res.json(jobs);
  }));

  app.get("/api/jobs/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;
    const job = await storage.getJobById(id);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json(job);
  }));

  // Contact form submission
  app.post("/api/contact", asyncHandler(async (req, res) => {
    const messageData = insertContactMessageSchema.parse(req.body);
    const message = await storage.createContactMessage({
      ...messageData,
      subject: messageData.subject || undefined,
      isRead: false
    });
    res.status(201).json(message);
  }));

  // Student application
  app.post("/api/apply", asyncHandler(async (req, res) => {
    const applicationData = insertStudentApplicationSchema.parse(req.body);
    const application = await storage.createStudentApplication({
      ...applicationData,
      message: applicationData.message || undefined,
      phone: applicationData.phone || undefined,
      courseId: String(applicationData.courseId), // Required field
      status: 'pending'
    });
    res.status(201).json(application);
  }));

  // Career application
  app.post("/api/careers/apply", asyncHandler(async (req, res) => {
    const applicationData = insertCareerApplicationSchema.parse(req.body);
    const application = await storage.createCareerApplication({
      ...applicationData,
      phone: applicationData.phone || undefined,
      jobId: String(applicationData.jobId), // Required field
      coverLetter: applicationData.coverLetter || undefined,
      resumeUrl: applicationData.resumeUrl || undefined,
      status: 'pending'
    });
    res.status(201).json(application);
  }));
}

/**
 * Register routes that require authentication
 */
function registerAuthenticatedRoutes(app: Express): void {
  // Courses
  app.post("/api/courses", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const courseData = insertCourseSchema.parse(req.body);
    // Add default values for required fields and convert price to number
    const courseWithDefaults = {
      ...courseData,
      price: Number(courseData.price),
      rating: 0,
      reviewCount: 0,
      active: courseData.active ?? true,
      featured: courseData.featured ?? false,
      image: courseData.image || undefined,
      duration: courseData.duration || undefined,
      categoryId: String(courseData.categoryId), // Required field
      instructorName: courseData.instructorName || undefined,
      instructorTitle: courseData.instructorTitle || undefined,
      instructorImage: courseData.instructorImage || undefined
    };
    const course = await storage.createCourse(courseWithDefaults);
    res.status(201).json(course);
  }));

  app.patch("/api/courses/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const courseData = req.body;
    const updatedCourse = await storage.updateCourse(id, courseData);
    
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json(updatedCourse);
  }));

  // Jobs
  app.post("/api/jobs", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const jobData = insertJobSchema.parse(req.body);
    const job = await storage.createJob({
      ...jobData,
      type: jobData.type || undefined,
      location: jobData.location || undefined,
      active: jobData.active ?? true
    });
    res.status(201).json(job);
  }));

  app.patch("/api/jobs/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const jobData = req.body;
    const updatedJob = await storage.updateJob(id, jobData);
    
    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json(updatedJob);
  }));
}

/**
 * Register admin-only routes
 */
function registerAdminRoutes(app: Express): void {
  // Dashboard stats
  app.get("/api/admin/stats", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  }));

  // Student applications
  app.get("/api/admin/applications", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const applications = await storage.getStudentApplications();
    res.json(applications);
  }));
  app.patch("/api/admin/applications/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body as { status: string };
    
    if (!isValidStatus(status)) {
      return res.status(400).json({ 
        message: "Invalid status value",
        allowedValues: ["pending", "reviewed", "accepted", "rejected"]
      });
    }
    
    const updatedApplication = await storage.updateStudentApplicationStatus(id, status);
    
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.json(updatedApplication);
  }));

  // Career applications
  app.get("/api/admin/career-applications", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const applications = await storage.getCareerApplications();
    res.json(applications);
  }));
  app.patch("/api/admin/career-applications/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body as { status: string };
    
    if (!isValidStatus(status)) {
      return res.status(400).json({ 
        message: "Invalid status value",
        allowedValues: ["pending", "reviewed", "accepted", "rejected"]
      });
    }
    
    const updatedApplication = await storage.updateCareerApplicationStatus(id, status);
    
    if (!updatedApplication) {
      return res.status(404).json({ message: "Career application not found" });
    }
    
    res.json(updatedApplication);
  }));

  // Contact messages
  app.get("/api/admin/messages", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const messages = await storage.getContactMessages();
    res.json(messages);
  }));

  app.patch("/api/admin/messages/:id/read", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedMessage = await storage.markContactMessageAsRead(id);
    
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.json(updatedMessage);
  }));

  // Team members
  app.post("/api/team", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const teamMemberData = insertTeamMemberSchema.parse(req.body);
    const teamMember = await storage.createTeamMember({
      ...teamMemberData,
      imageUrl: teamMemberData.imageUrl || undefined,
      bio: teamMemberData.bio || undefined,
      visible: teamMemberData.visible ?? true
    });
    res.status(201).json(teamMember);
  }));

  app.patch("/api/team/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const teamMemberData = req.body;
    const updatedTeamMember = await storage.updateTeamMember(id, teamMemberData);
    
    if (!updatedTeamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    
    res.json(updatedTeamMember);
  }));

  // Testimonials
  app.post("/api/testimonials", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const testimonialData = insertTestimonialSchema.parse(req.body);
    const testimonial = await storage.createTestimonial({
      ...testimonialData,
      imageUrl: testimonialData.imageUrl || undefined,
      role: testimonialData.role || undefined,
      visible: testimonialData.visible ?? true
    });
    res.status(201).json(testimonial);
  }));

  app.patch("/api/testimonials/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const testimonialData = req.body;
    const updatedTestimonial = await storage.updateTestimonial(id, testimonialData);
    
    if (!updatedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.json(updatedTestimonial);
  }));

  // Categories
  app.post("/api/categories", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const categoryData = insertCategorySchema.parse(req.body);
    // Ensure description is properly typed
    const categoryWithDefaults = {
      ...categoryData,
      description: categoryData.description || undefined,
      imageUrl: categoryData.imageUrl || undefined,
      active: categoryData.active ?? true
    };
    const category = await storage.createCategory(categoryWithDefaults);
    res.status(201).json(category);
  }));

  app.patch("/api/categories/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const categoryData = req.body;
    const updatedCategory = await storage.updateCategory(id, categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(updatedCategory);
  }));

  // DELETE routes for all resources
  // Categories - DELETE
  app.delete("/api/categories/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteCategory(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  }));

  // Courses - DELETE
  app.delete("/api/courses/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteCourse(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    res.json({ message: "Course deleted successfully" });
  }));

  // Team members - DELETE
  app.delete("/api/team/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteTeamMember(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Team member not found" });
    }
    
    res.json({ message: "Team member deleted successfully" });
  }));

  // Testimonials - DELETE
  app.delete("/api/testimonials/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteTestimonial(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.json({ message: "Testimonial deleted successfully" });
  }));

  // Jobs - DELETE
  app.delete("/api/jobs/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteJob(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json({ message: "Job deleted successfully" });
  }));

  // Student applications - DELETE
  app.delete("/api/admin/applications/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteStudentApplication(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    res.json({ message: "Application deleted successfully" });
  }));

  // Career applications - DELETE
  app.delete("/api/admin/career-applications/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteCareerApplication(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Career application not found" });
    }
    
    res.json({ message: "Career application deleted successfully" });
  }));

  // Contact messages - DELETE
  app.delete("/api/admin/messages/:id", isAuthenticated, isAdmin, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const deleted = await storage.deleteContactMessage(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    
    res.json({ message: "Message deleted successfully" });
  }));
}

/**
 * Helper function to handle async route callbacks
 * @param fn Async route handler function
 */
function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error: unknown) => {
      console.error('Route error:', error);
      
      // Type guard for validation errors
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const apiError = error as ApiError;
        return res.status(apiError.status || 400).json({ 
          message: apiError.message,
          code: apiError.code
        });
      }
      
      // Handle standard errors
      if (error instanceof Error) {
        return res.status(500).json({ 
          message: error.message || "An unexpected error occurred",
          error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
      
      // Handle unknown error types
      res.status(500).json({ 
        message: "An unexpected error occurred",
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    });
  };
}

/**
 * Validates if the provided status is valid for application statuses
 * @param status Status to validate
 */
function isValidStatus(status: string): status is ApplicationStatus {
  return Boolean(status) && ["pending", "reviewed", "accepted", "rejected"].includes(status);
}