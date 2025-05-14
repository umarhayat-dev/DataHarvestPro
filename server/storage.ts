import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  courses, type Course, type InsertCourse,
  testimonials, type Testimonial, type InsertTestimonial,
  teamMembers, type TeamMember, type InsertTeamMember,
  jobs, type Job, type InsertJob,
  careerApplications, type CareerApplication, type InsertCareerApplication,
  studentApplications, type StudentApplication, type InsertStudentApplication,
  contactMessages, type ContactMessage, type InsertContactMessage,
  sessions
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { eq, desc, count, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getFeaturedCourses(): Promise<Course[]>;
  getCourseById(id: number): Promise<Course | undefined>;
  getCoursesByCategory(categoryId: number): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  
  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  
  // Team member operations
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  
  // Job operations
  getJobs(): Promise<Job[]>;
  getActiveJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  
  // Career application operations
  getCareerApplications(): Promise<CareerApplication[]>;
  getCareerApplicationById(id: number): Promise<CareerApplication | undefined>;
  createCareerApplication(application: InsertCareerApplication): Promise<CareerApplication>;
  updateCareerApplicationStatus(id: number, status: string): Promise<CareerApplication | undefined>;
  
  // Student application operations
  getStudentApplications(): Promise<StudentApplication[]>;
  getStudentApplicationById(id: number): Promise<StudentApplication | undefined>;
  createStudentApplication(application: InsertStudentApplication): Promise<StudentApplication>;
  updateStudentApplicationStatus(id: number, status: string): Promise<StudentApplication | undefined>;
  
  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessageById(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageAsRead(id: number): Promise<ContactMessage | undefined>;
  
  // Admin dashboard operations
  getDashboardStats(): Promise<{
    studentCount: number;
    courseCount: number;
    applicationCount: number;
    unreadMessageCount: number;
  }>;
  
  // Session store for authentication
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private courses: Map<number, Course>;
  private testimonials: Map<number, Testimonial>;
  private teamMembers: Map<number, TeamMember>;
  private jobs: Map<number, Job>;
  private careerApplications: Map<number, CareerApplication>;
  private studentApplications: Map<number, StudentApplication>;
  private contactMessages: Map<number, ContactMessage>;
  
  private userCurrentId: number;
  private categoryCurrentId: number;
  private courseCurrentId: number;
  private testimonialCurrentId: number;
  private teamMemberCurrentId: number;
  private jobCurrentId: number;
  private careerApplicationCurrentId: number;
  private studentApplicationCurrentId: number;
  private contactMessageCurrentId: number;
  
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.courses = new Map();
    this.testimonials = new Map();
    this.teamMembers = new Map();
    this.jobs = new Map();
    this.careerApplications = new Map();
    this.studentApplications = new Map();
    this.contactMessages = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.courseCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.jobCurrentId = 1;
    this.careerApplicationCurrentId = 1;
    this.studentApplicationCurrentId = 1;
    this.contactMessageCurrentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "admin123", // This would be hashed in actual implementation
      email: "admin@alyusr.com",
      firstName: "Admin",
      lastName: "User",
      isAdmin: true,
    });
    
    // Initialize some categories
    this.createCategory({
      name: "Quran Recitation",
      description: "Learn proper Quran recitation with Tajweed rules",
      active: true,
    });
    
    this.createCategory({
      name: "Arabic Language",
      description: "Learn Arabic to understand the Quran better",
      active: true,
    });
    
    this.createCategory({
      name: "Islamic Studies",
      description: "Deepen your understanding of Islamic principles",
      active: true,
    });
    
    // Initialize some courses
    this.createCourse({
      title: "Quran Recitation with Tajweed",
      description: "This comprehensive Quran recitation course is designed to help students master the art of reciting the Quran with proper Tajweed rules.",
      image: "https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      duration: "12 weeks",
      price: "199.00",
      featured: true,
      categoryId: 1,
      instructorName: "Dr. Aminah Khan",
      instructorTitle: "Tajweed Specialist",
      instructorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      rating: "4.8",
      reviewCount: 45,
      active: true,
    });
    
    this.createCourse({
      title: "Quran for Children",
      description: "A fun and engaging program designed specifically for young learners to build a strong foundation.",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      duration: "8 weeks",
      price: "149.00",
      featured: true,
      categoryId: 1,
      instructorName: "Ustadh Ahmed Hassan",
      instructorTitle: "Children's Educator",
      instructorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      rating: "4.9",
      reviewCount: 32,
      active: true,
    });
    
    this.createCourse({
      title: "Arabic for Quran Understanding",
      description: "Learn Quranic Arabic to understand the meanings and nuances of the holy text directly.",
      image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      duration: "16 weeks",
      price: "249.00",
      featured: true,
      categoryId: 2,
      instructorName: "Dr. Layla Mahmoud",
      instructorTitle: "Arabic Language Professor",
      instructorImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      rating: "4.7",
      reviewCount: 28,
      active: true,
    });
    
    // Initialize testimonials
    this.createTestimonial({
      name: "Ibrahim Ahmad",
      role: "Quran Recitation Student",
      content: "The Tajweed course completely transformed my Quran recitation. The instructors are patient and knowledgeable, and the feedback is detailed and helpful.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      visible: true,
    });
    
    this.createTestimonial({
      name: "Sarah Johnson",
      role: "Parent of Two Students",
      content: "As a parent, I'm amazed at how quickly my children have learned with Alyusr's kids program. The interactive approach keeps them engaged and excited about learning the Quran.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      visible: true,
    });
    
    this.createTestimonial({
      name: "Aisha Rahman",
      role: "Arabic Language Student",
      content: "The Arabic for Quran Understanding course opened up a whole new dimension of my relationship with the Quran. I can now appreciate the nuances and beauty of the original text.",
      rating: 4,
      imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      visible: true,
    });
    
    // Initialize some jobs
    this.createJob({
      title: "Quran Instructor (Tajweed)",
      description: "We are looking for an experienced Quran instructor with strong Tajweed skills to join our team.",
      requirements: "Ijazah in Hafs from Asim, 3+ years teaching experience, fluent in English and Arabic",
      location: "New York / Remote",
      type: "Full-time",
      active: true,
    });
    
    this.createJob({
      title: "Arabic Language Teacher",
      description: "Seeking a qualified Arabic language teacher for our Arabic for Quran Understanding program.",
      requirements: "Bachelor's degree in Arabic Language, 2+ years teaching experience, excellent communication skills",
      location: "Remote",
      type: "Part-time",
      active: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const now = new Date();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.categories.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory: Category = {
      ...category,
      ...categoryUpdate,
      updatedAt: new Date()
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  // Course operations
  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getFeaturedCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.featured && course.active);
  }
  
  async getCourseById(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.categoryId === categoryId && course.active);
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseCurrentId++;
    const now = new Date();
    const course: Course = {
      ...insertCourse,
      id,
      rating: insertCourse.rating || "0",
      reviewCount: insertCourse.reviewCount || 0,
      createdAt: now,
      updatedAt: now
    };
    this.courses.set(id, course);
    return course;
  }
  
  async updateCourse(id: number, courseUpdate: Partial<InsertCourse>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse: Course = {
      ...course,
      ...courseUpdate,
      updatedAt: new Date()
    };
    
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }
  
  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.visible);
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const now = new Date();
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      createdAt: now
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial: Testimonial = {
      ...testimonial,
      ...testimonialUpdate
    };
    
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  // Team member operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(member => member.visible);
  }
  
  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }
  
  async createTeamMember(insertMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberCurrentId++;
    const now = new Date();
    const member: TeamMember = {
      ...insertMember,
      id,
      createdAt: now
    };
    this.teamMembers.set(id, member);
    return member;
  }
  
  async updateTeamMember(id: number, memberUpdate: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const member = this.teamMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember: TeamMember = {
      ...member,
      ...memberUpdate
    };
    
    this.teamMembers.set(id, updatedMember);
    return updatedMember;
  }
  
  // Job operations
  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }
  
  async getActiveJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(job => job.active);
  }
  
  async getJobById(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }
  
  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobCurrentId++;
    const now = new Date();
    const job: Job = {
      ...insertJob,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.jobs.set(id, job);
    return job;
  }
  
  async updateJob(id: number, jobUpdate: Partial<InsertJob>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;
    
    const updatedJob: Job = {
      ...job,
      ...jobUpdate,
      updatedAt: new Date()
    };
    
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }
  
  // Career application operations
  async getCareerApplications(): Promise<CareerApplication[]> {
    return Array.from(this.careerApplications.values());
  }
  
  async getCareerApplicationById(id: number): Promise<CareerApplication | undefined> {
    return this.careerApplications.get(id);
  }
  
  async createCareerApplication(insertApplication: InsertCareerApplication): Promise<CareerApplication> {
    const id = this.careerApplicationCurrentId++;
    const now = new Date();
    const application: CareerApplication = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    this.careerApplications.set(id, application);
    return application;
  }
  
  async updateCareerApplicationStatus(id: number, status: string): Promise<CareerApplication | undefined> {
    const application = this.careerApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication: CareerApplication = {
      ...application,
      status,
      updatedAt: new Date()
    };
    
    this.careerApplications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // Student application operations
  async getStudentApplications(): Promise<StudentApplication[]> {
    return Array.from(this.studentApplications.values());
  }
  
  async getStudentApplicationById(id: number): Promise<StudentApplication | undefined> {
    return this.studentApplications.get(id);
  }
  
  async createStudentApplication(insertApplication: InsertStudentApplication): Promise<StudentApplication> {
    const id = this.studentApplicationCurrentId++;
    const now = new Date();
    const application: StudentApplication = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now
    };
    this.studentApplications.set(id, application);
    return application;
  }
  
  async updateStudentApplicationStatus(id: number, status: string): Promise<StudentApplication | undefined> {
    const application = this.studentApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication: StudentApplication = {
      ...application,
      status,
      updatedAt: new Date()
    };
    
    this.studentApplications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
  
  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }
  
  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const now = new Date();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      isRead: false,
      createdAt: now
    };
    this.contactMessages.set(id, message);
    return message;
  }
  
  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) return undefined;
    
    const updatedMessage: ContactMessage = {
      ...message,
      isRead: true
    };
    
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
  
  // Admin dashboard operations
  async getDashboardStats(): Promise<{
    studentCount: number;
    courseCount: number;
    applicationCount: number;
    unreadMessageCount: number;
  }> {
    return {
      studentCount: this.studentApplications.size,
      courseCount: Array.from(this.courses.values()).filter(course => course.active).length,
      applicationCount: this.studentApplications.size,
      unreadMessageCount: Array.from(this.contactMessages.values()).filter(message => !message.isRead).length
    };
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const [user] = await db.insert(users).values(insertUser).returning();
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    try {
      return await db.select().from(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    try {
      const [category] = await db.select().from(categories).where(eq(categories.id, id));
      return category;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      return undefined;
    }
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const [category] = await db.insert(categories).values(insertCategory).returning();
      return category;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    try {
      const [updatedCategory] = await db
        .update(categories)
        .set({ ...categoryUpdate, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();
      return updatedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      return undefined;
    }
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    try {
      return await db.select().from(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  }

  async getFeaturedCourses(): Promise<Course[]> {
    try {
      return await db
        .select()
        .from(courses)
        .where(sql`${courses.featured} = true AND ${courses.active} = true`);
    } catch (error) {
      console.error("Error fetching featured courses:", error);
      return [];
    }
  }

  async getCourseById(id: number): Promise<Course | undefined> {
    try {
      const [course] = await db.select().from(courses).where(eq(courses.id, id));
      return course;
    } catch (error) {
      console.error("Error fetching course by ID:", error);
      return undefined;
    }
  }

  async getCoursesByCategory(categoryId: number): Promise<Course[]> {
    try {
      return await db
        .select()
        .from(courses)
        .where(sql`${courses.categoryId} = ${categoryId} AND ${courses.active} = true`);
    } catch (error) {
      console.error("Error fetching courses by category:", error);
      return [];
    }
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    try {
      const [course] = await db.insert(courses).values(insertCourse).returning();
      return course;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  async updateCourse(id: number, courseUpdate: Partial<InsertCourse>): Promise<Course | undefined> {
    try {
      const [updatedCourse] = await db
        .update(courses)
        .set({ ...courseUpdate, updatedAt: new Date() })
        .where(eq(courses.id, id))
        .returning();
      return updatedCourse;
    } catch (error) {
      console.error("Error updating course:", error);
      return undefined;
    }
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      return await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.visible, true));
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }
  }

  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    try {
      const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
      return testimonial;
    } catch (error) {
      console.error("Error fetching testimonial by ID:", error);
      return undefined;
    }
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    try {
      const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
      return testimonial;
    } catch (error) {
      console.error("Error creating testimonial:", error);
      throw error;
    }
  }

  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    try {
      const [updatedTestimonial] = await db
        .update(testimonials)
        .set(testimonialUpdate)
        .where(eq(testimonials.id, id))
        .returning();
      return updatedTestimonial;
    } catch (error) {
      console.error("Error updating testimonial:", error);
      return undefined;
    }
  }

  // Team member operations
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      return await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.visible, true));
    } catch (error) {
      console.error("Error fetching team members:", error);
      return [];
    }
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    try {
      const [teamMember] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
      return teamMember;
    } catch (error) {
      console.error("Error fetching team member by ID:", error);
      return undefined;
    }
  }

  async createTeamMember(insertTeamMember: InsertTeamMember): Promise<TeamMember> {
    try {
      const [teamMember] = await db.insert(teamMembers).values(insertTeamMember).returning();
      return teamMember;
    } catch (error) {
      console.error("Error creating team member:", error);
      throw error;
    }
  }

  async updateTeamMember(id: number, teamMemberUpdate: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    try {
      const [updatedTeamMember] = await db
        .update(teamMembers)
        .set(teamMemberUpdate)
        .where(eq(teamMembers.id, id))
        .returning();
      return updatedTeamMember;
    } catch (error) {
      console.error("Error updating team member:", error);
      return undefined;
    }
  }

  // Job operations
  async getJobs(): Promise<Job[]> {
    try {
      return await db.select().from(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return [];
    }
  }

  async getActiveJobs(): Promise<Job[]> {
    try {
      return await db
        .select()
        .from(jobs)
        .where(eq(jobs.active, true));
    } catch (error) {
      console.error("Error fetching active jobs:", error);
      return [];
    }
  }

  async getJobById(id: number): Promise<Job | undefined> {
    try {
      const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
      return job;
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      return undefined;
    }
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    try {
      const [job] = await db.insert(jobs).values(insertJob).returning();
      return job;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  }

  async updateJob(id: number, jobUpdate: Partial<InsertJob>): Promise<Job | undefined> {
    try {
      const [updatedJob] = await db
        .update(jobs)
        .set({ ...jobUpdate, updatedAt: new Date() })
        .where(eq(jobs.id, id))
        .returning();
      return updatedJob;
    } catch (error) {
      console.error("Error updating job:", error);
      return undefined;
    }
  }

  // Career application operations
  async getCareerApplications(): Promise<CareerApplication[]> {
    try {
      return await db
        .select()
        .from(careerApplications)
        .orderBy(desc(careerApplications.createdAt));
    } catch (error) {
      console.error("Error fetching career applications:", error);
      return [];
    }
  }

  async getCareerApplicationById(id: number): Promise<CareerApplication | undefined> {
    try {
      const [application] = await db
        .select()
        .from(careerApplications)
        .where(eq(careerApplications.id, id));
      return application;
    } catch (error) {
      console.error("Error fetching career application by ID:", error);
      return undefined;
    }
  }

  async createCareerApplication(insertApplication: InsertCareerApplication): Promise<CareerApplication> {
    try {
      const [application] = await db
        .insert(careerApplications)
        .values({
          ...insertApplication,
          status: "pending"
        })
        .returning();
      return application;
    } catch (error) {
      console.error("Error creating career application:", error);
      throw error;
    }
  }

  async updateCareerApplicationStatus(id: number, status: string): Promise<CareerApplication | undefined> {
    try {
      const [updatedApplication] = await db
        .update(careerApplications)
        .set({ 
          status, 
          updatedAt: new Date()
        })
        .where(eq(careerApplications.id, id))
        .returning();
      return updatedApplication;
    } catch (error) {
      console.error("Error updating career application status:", error);
      return undefined;
    }
  }

  // Student application operations
  async getStudentApplications(): Promise<StudentApplication[]> {
    try {
      return await db
        .select()
        .from(studentApplications)
        .orderBy(desc(studentApplications.createdAt));
    } catch (error) {
      console.error("Error fetching student applications:", error);
      return [];
    }
  }

  async getStudentApplicationById(id: number): Promise<StudentApplication | undefined> {
    try {
      const [application] = await db
        .select()
        .from(studentApplications)
        .where(eq(studentApplications.id, id));
      return application;
    } catch (error) {
      console.error("Error fetching student application by ID:", error);
      return undefined;
    }
  }

  async createStudentApplication(insertApplication: InsertStudentApplication): Promise<StudentApplication> {
    try {
      const [application] = await db
        .insert(studentApplications)
        .values({
          ...insertApplication,
          status: "pending"
        })
        .returning();
      return application;
    } catch (error) {
      console.error("Error creating student application:", error);
      throw error;
    }
  }

  async updateStudentApplicationStatus(id: number, status: string): Promise<StudentApplication | undefined> {
    try {
      const [updatedApplication] = await db
        .update(studentApplications)
        .set({ 
          status, 
          updatedAt: new Date()
        })
        .where(eq(studentApplications.id, id))
        .returning();
      return updatedApplication;
    } catch (error) {
      console.error("Error updating student application status:", error);
      return undefined;
    }
  }

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      return await db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt));
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      return [];
    }
  }

  async getContactMessageById(id: number): Promise<ContactMessage | undefined> {
    try {
      const [message] = await db
        .select()
        .from(contactMessages)
        .where(eq(contactMessages.id, id));
      return message;
    } catch (error) {
      console.error("Error fetching contact message by ID:", error);
      return undefined;
    }
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      const [message] = await db
        .insert(contactMessages)
        .values({
          ...insertMessage,
          isRead: false
        })
        .returning();
      return message;
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }

  async markContactMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    try {
      const [updatedMessage] = await db
        .update(contactMessages)
        .set({ isRead: true })
        .where(eq(contactMessages.id, id))
        .returning();
      return updatedMessage;
    } catch (error) {
      console.error("Error marking contact message as read:", error);
      return undefined;
    }
  }

  // Admin dashboard operations
  async getDashboardStats(): Promise<{
    studentCount: number;
    courseCount: number;
    applicationCount: number;
    unreadMessageCount: number;
  }> {
    try {
      const [courseStats] = await db
        .select({ count: count() })
        .from(courses);
        
      const [applicationStats] = await db
        .select({ count: count() })
        .from(studentApplications);
        
      const [messageStats] = await db
        .select({ count: count() })
        .from(contactMessages)
        .where(eq(contactMessages.isRead, false));
        
      const [userStats] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.isAdmin, false));
        
      return {
        studentCount: userStats?.count || 0,
        courseCount: courseStats?.count || 0,
        applicationCount: applicationStats?.count || 0,
        unreadMessageCount: messageStats?.count || 0,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        studentCount: 0,
        courseCount: 0,
        applicationCount: 0,
        unreadMessageCount: 0,
      };
    }
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
