
import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  FirestoreUser, FirestoreCategory, FirestoreCourse,
  FirestoreTestimonial, FirestoreTeamMember, FirestoreJob,
  FirestoreCareerApplication, FirestoreStudentApplication,
  FirestoreContactMessage
} from './models/firestore';

// Firestore storage class import
import { FirestoreStorage } from './storage.firestore';
import { db } from './firebase';

// Define the storage interface for Firestore and memory use
interface IStorage {
  // User operations
  getUser(id: string): Promise<FirestoreUser | undefined>;
  getUserByUsername(username: string): Promise<FirestoreUser | undefined>;
  createUser(user: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreUser>;

  // Category operations
  getCategories(): Promise<FirestoreCategory[]>;
  getCategoryById(id: string): Promise<FirestoreCategory | undefined>;
  createCategory(category: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCategory>;
  updateCategory(id: string, category: Partial<Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreCategory | undefined>;

  // Course operations
  getCourses(): Promise<FirestoreCourse[]>;
  getFeaturedCourses(): Promise<FirestoreCourse[]>;
  getCourseById(id: string): Promise<FirestoreCourse | undefined>;
  getCoursesByCategory(categoryId: string): Promise<FirestoreCourse[]>;
  createCourse(course: Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCourse>;
  updateCourse(id: string, course: Partial<Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreCourse | undefined>;

  // Testimonial operations
  getTestimonials(): Promise<FirestoreTestimonial[]>;
  getTestimonialById(id: string): Promise<FirestoreTestimonial | undefined>;
  createTestimonial(testimonial: Omit<FirestoreTestimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreTestimonial>;
  updateTestimonial(id: string, testimonial: Partial<Omit<FirestoreTestimonial, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreTestimonial | undefined>;

  // Team member operations
  getTeamMembers(): Promise<FirestoreTeamMember[]>;
  getTeamMemberById(id: string): Promise<FirestoreTeamMember | undefined>;
  createTeamMember(member: Omit<FirestoreTeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreTeamMember>;
  updateTeamMember(id: string, member: Partial<Omit<FirestoreTeamMember, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreTeamMember | undefined>;

  // Job operations
  getJobs(): Promise<FirestoreJob[]>;
  getActiveJobs(): Promise<FirestoreJob[]>;
  getJobById(id: string): Promise<FirestoreJob | undefined>;
  createJob(job: Omit<FirestoreJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreJob>;
  updateJob(id: string, job: Partial<Omit<FirestoreJob, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreJob | undefined>;

  // Career application operations
  getCareerApplications(): Promise<FirestoreCareerApplication[]>;
  getCareerApplicationById(id: string): Promise<FirestoreCareerApplication | undefined>;
  createCareerApplication(application: Omit<FirestoreCareerApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCareerApplication>;
  updateCareerApplicationStatus(id: string, status: string): Promise<FirestoreCareerApplication | undefined>;

  // Student application operations
  getStudentApplications(): Promise<FirestoreStudentApplication[]>;
  getStudentApplicationById(id: string): Promise<FirestoreStudentApplication | undefined>;
  createStudentApplication(application: Omit<FirestoreStudentApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreStudentApplication>;
  updateStudentApplicationStatus(id: string, status: string): Promise<FirestoreStudentApplication | undefined>;

  // Contact message operations
  getContactMessages(): Promise<FirestoreContactMessage[]>;
  getContactMessageById(id: string): Promise<FirestoreContactMessage | undefined>;
  createContactMessage(message: Omit<FirestoreContactMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreContactMessage>;
  markContactMessageAsRead(id: string): Promise<FirestoreContactMessage | undefined>;

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

// Export the Firestore implementation as the default storage
export const storage = new FirestoreStorage();

// [Optional] Keep MemStorage for testing or development as a stand-in/mock.
// If you don't use MemStorage at all, you can remove this as well.
const MemoryStore = createMemoryStore(session);
/*
// If you don't need memory storage for dev/testing, you can safely remove this class too!
export class MemStorage implements IStorage {
  // ...implementation as you had before
}
*/

