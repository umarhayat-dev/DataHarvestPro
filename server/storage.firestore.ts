import { Firestore, Query, DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import { 
  FirestoreUser, FirestoreCategory, FirestoreCourse,
  FirestoreTestimonial, FirestoreTeamMember, FirestoreJob,
  FirestoreCareerApplication, FirestoreStudentApplication,
  FirestoreContactMessage,
  createNewDocument, updateDocument,
  userSchema, createUserSchema, categorySchema, courseSchema, testimonialSchema,
  teamMemberSchema, jobSchema, careerApplicationSchema,
  studentApplicationSchema, contactMessageSchema
} from './models/firestore';
import { Store } from 'express-session';

function handleFirestoreError(error: unknown): never {
  console.error('Firestore operation failed:', error);
  throw error;
}

export interface IStorage {
  sessionStore: Store;

  // User operations
  getUser(id: string): Promise<FirestoreUser | undefined>;
  getUserByUsername(username: string): Promise<FirestoreUser | undefined>;
  createUser(user: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreUser>;

  // Category operations
  getCategories(): Promise<FirestoreCategory[]>;
  getCategoryById(id: string): Promise<FirestoreCategory | undefined>;
  createCategory(category: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCategory>;
  updateCategory(id: string, category: Partial<Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreCategory | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Course operations
  getCourses(): Promise<FirestoreCourse[]>;
  getFeaturedCourses(): Promise<FirestoreCourse[]>;
  getCourseById(id: string): Promise<FirestoreCourse | undefined>;
  getCoursesByCategory(categoryId: string): Promise<FirestoreCourse[]>;
  createCourse(course: Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCourse>;
  updateCourse(id: string, course: Partial<Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>>): Promise<FirestoreCourse | undefined>;
  deleteCourse(id: string): Promise<boolean>;

  // Additional operations for other entities...
  // (Include all other methods that are in FirestoreStorage)
}
import session from 'express-session';
import createMemoryStore from 'memorystore';
import { z } from 'zod';
import { getFirestore } from './firebase';
import { db } from './firebase';

type WithTimestamps<T> = T & {
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};

export class FirestoreStorage implements IStorage {
  private readonly db: Firestore;
  readonly sessionStore: session.Store;

  constructor() {
    this.db = getFirestore();
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  private parseDoc<T>(doc: DocumentSnapshot<DocumentData>, schema: z.ZodSchema): T | undefined {
    if (!doc.exists) return undefined;
    try {
      const data = schema.parse(doc.data());
      // Add the document ID after validation
      return { ...data, id: doc.id } as T & { id: string };
    } catch (error) {
      console.error('Error parsing Firestore document:', error);
      throw error;
    }
  }

  private async getDoc<T>(
    collectionName: string, 
    id: string, 
    schema: z.ZodSchema
  ): Promise<T | undefined> {
    try {
      const doc = await this.db.collection(collectionName).doc(id).get();
      if (!doc.exists) return undefined;
      return this.parseDoc<T>(doc, schema);
    } catch (error) {
      handleFirestoreError(error);
    }
  }

  private async getDocs<T>(query: Query, schema: z.ZodSchema): Promise<T[]> {
    try {
      const snapshot = await query.get();
      return snapshot.docs
        .map(doc => this.parseDoc<T>(doc, schema))
        .filter((doc): doc is T => doc !== undefined);
    } catch (error) {
      console.error('Error getting Firestore documents:', error);
      throw error;
    }
  }

  // User operations
  async getUser(id: string): Promise<FirestoreUser | undefined> {
    return this.getDoc<FirestoreUser>('users', id, userSchema);
  }

  async getUserByUsername(username: string): Promise<FirestoreUser | undefined> {
    const snapshot = await this.db.collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    
    if (snapshot.empty) return undefined;
    return this.parseDoc<FirestoreUser>(snapshot.docs[0], userSchema);
  }

  async createUser(user: Omit<FirestoreUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreUser> {
    // Validate user data with createUserSchema
    const validatedUser = createUserSchema.parse(user);
    const newUser = createNewDocument<FirestoreUser>({
      ...validatedUser,
      isAdmin: validatedUser.isAdmin ?? false
    });
    const docRef = await this.db.collection('users').add(newUser);
    return { ...newUser as any, id: docRef.id };
  }

  // Category operations
  async getCategories(): Promise<FirestoreCategory[]> {
    return this.getDocs<FirestoreCategory>(
      this.db.collection('categories').where('active', '==', true).orderBy('name'),
      categorySchema
    );
  }

  async getCategoryById(id: string): Promise<FirestoreCategory | undefined> {
    return this.getDoc<FirestoreCategory>('categories', id, categorySchema);
  }

  async createCategory(category: Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCategory> {
    const newCategory = createNewDocument<FirestoreCategory>({
      ...category,
      active: category.active ?? true
    });
    const docRef = await this.db.collection('categories').add(newCategory);
    return { ...newCategory as any, id: docRef.id };
  }

  async updateCategory(
    id: string, 
    category: Partial<Omit<FirestoreCategory, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirestoreCategory | undefined> {
    const categoryRef = this.db.collection('categories').doc(id);
    const categoryDoc = await categoryRef.get();
    if (!categoryDoc.exists) return undefined;

    const updates = updateDocument<FirestoreCategory>(category);
    await categoryRef.update(updates);
    
    const updatedCategory = await categoryRef.get();
    return this.parseDoc<FirestoreCategory>(updatedCategory, categorySchema);
  }

  // Course operations
  async getCourses(): Promise<FirestoreCourse[]> {
    return this.getDocs<FirestoreCourse>(
      this.db.collection('courses').where('active', '==', true).orderBy('title'),
      courseSchema
    );
  }

  async getFeaturedCourses(): Promise<FirestoreCourse[]> {
    return this.getDocs<FirestoreCourse>(
      this.db.collection('courses')
        .where('active', '==', true)
        .where('featured', '==', true)
        .orderBy('title'),
      courseSchema
    );
  }

  async getCourseById(id: string): Promise<FirestoreCourse | undefined> {
    return this.getDoc<FirestoreCourse>('courses', id, courseSchema);
  }

  // Example of using the query builder:
  async getCoursesByCategory(categoryId: string): Promise<FirestoreCourse[]> {
    try {
      const query = this.db.collection('courses')
        .where('categoryId', '==', categoryId)
        .where('active', '==', true)
        .orderBy('title', 'asc');

      return this.getDocs<FirestoreCourse>(query, courseSchema);
    } catch (error) {
      console.error('Error getting courses by category:', error);
      return [];
    }
  }

  async createCourse(course: Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreCourse> {
    // Ensure required fields are present and properly typed
    const newCourse = createNewDocument<FirestoreCourse>({
      ...course,
      title: course.title,
      description: course.description,
      price: Number(course.price),
      categoryId: String(course.categoryId),
      active: course.active ?? true,
      featured: course.featured ?? false,
      rating: course.rating ?? 0,
      reviewCount: course.reviewCount ?? 0,
      // Optional fields with null fallback
      image: course.image ?? undefined,
      duration: course.duration ?? undefined,
      instructorName: course.instructorName ?? undefined,
      instructorTitle: course.instructorTitle ?? undefined,
      instructorImage: course.instructorImage ?? undefined
    });
    const docRef = await this.db.collection('courses').add(newCourse);
    return { ...newCourse, id: docRef.id } as FirestoreCourse;
  }


  async updateCourse(
    id: string, 
    course: Partial<Omit<FirestoreCourse, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirestoreCourse | undefined> {
    const courseRef = this.db.collection('courses').doc(id);
    const courseDoc = await courseRef.get();
    if (!courseDoc.exists) return undefined;

    const updates = updateDocument<FirestoreCourse>(course);
    await courseRef.update(updates);
    
    const updatedCourse = await courseRef.get();
    return this.parseDoc<FirestoreCourse>(updatedCourse, courseSchema);
  }

  // Testimonial operations
  async getTestimonials(): Promise<FirestoreTestimonial[]> {
    return this.getDocs<FirestoreTestimonial>(
      this.db.collection('testimonials')
        .where('visible', '==', true)
        .orderBy('createdAt', 'desc'),
      testimonialSchema
    );
  }

  async getTestimonialById(id: string): Promise<FirestoreTestimonial | undefined> {
    return this.getDoc<FirestoreTestimonial>('testimonials', id, testimonialSchema);
  }

  async createTestimonial(testimonial: Omit<FirestoreTestimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreTestimonial> {
    const newTestimonial = createNewDocument<FirestoreTestimonial>({
      ...testimonial,
      visible: testimonial.visible ?? true
    });
    const docRef = await this.db.collection('testimonials').add(newTestimonial);
    return { ...newTestimonial as any, id: docRef.id };
  }

  async updateTestimonial(
    id: string, 
    testimonial: Partial<Omit<FirestoreTestimonial, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirestoreTestimonial | undefined> {
    const testimonialRef = this.db.collection('testimonials').doc(id);
    const testimonialDoc = await testimonialRef.get();
    if (!testimonialDoc.exists) return undefined;

    const updates = updateDocument<FirestoreTestimonial>(testimonial);
    await testimonialRef.update(updates);
    
    const updatedTestimonial = await testimonialRef.get();
    return this.parseDoc<FirestoreTestimonial>(updatedTestimonial, testimonialSchema);
  }

  // Team member operations
  async getTeamMembers(): Promise<FirestoreTeamMember[]> {
    return this.getDocs<FirestoreTeamMember>(
      this.db.collection('teamMembers')
        .where('visible', '==', true)
        .orderBy('name'),
      teamMemberSchema
    );
  }

  async getTeamMemberById(id: string): Promise<FirestoreTeamMember | undefined> {
    return this.getDoc<FirestoreTeamMember>('teamMembers', id, teamMemberSchema);
  }

  async createTeamMember(member: Omit<FirestoreTeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreTeamMember> {
    const newMember = createNewDocument<FirestoreTeamMember>({
      ...member,
      visible: member.visible ?? true
    });
    const docRef = await this.db.collection('teamMembers').add(newMember);
    return { ...newMember as any, id: docRef.id };
  }

  async updateTeamMember(
    id: string, 
    member: Partial<Omit<FirestoreTeamMember, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirestoreTeamMember | undefined> {
    const teamMemberRef = this.db.collection('teamMembers').doc(id);
    const teamMemberDoc = await teamMemberRef.get();
    if (!teamMemberDoc.exists) return undefined;

    const updates = updateDocument<FirestoreTeamMember>(member);
    await teamMemberRef.update(updates);
    
    const updatedTeamMember = await teamMemberRef.get();
    return this.parseDoc<FirestoreTeamMember>(updatedTeamMember, teamMemberSchema);
  }

  // Job operations
  async getJobs(): Promise<FirestoreJob[]> {
    return this.getDocs<FirestoreJob>(
      this.db.collection('jobs').orderBy('createdAt', 'desc'),
      jobSchema
    );
  }

  async getActiveJobs(): Promise<FirestoreJob[]> {
    return this.getDocs<FirestoreJob>(
      this.db.collection('jobs')
        .where('active', '==', true)
        .orderBy('createdAt', 'desc'),
      jobSchema
    );
  }

  async getJobById(id: string): Promise<FirestoreJob | undefined> {
    return this.getDoc<FirestoreJob>('jobs', id, jobSchema);
  }

  async createJob(job: Omit<FirestoreJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirestoreJob> {
    const newJob = createNewDocument<FirestoreJob>({
      ...job,
      active: job.active ?? true
    });
    const docRef = await this.db.collection('jobs').add(newJob);
    return { ...newJob as any, id: docRef.id };
  }

  async updateJob(
    id: string, 
    job: Partial<Omit<FirestoreJob, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirestoreJob | undefined> {
    const jobRef = this.db.collection('jobs').doc(id);
    const jobDoc = await jobRef.get();
    if (!jobDoc.exists) return undefined;

    const updates = updateDocument<FirestoreJob>(job);
    await jobRef.update(updates);
    
    const updatedJob = await jobRef.get();
    return this.parseDoc<FirestoreJob>(updatedJob, jobSchema);
  }

  // Career application operations
  async getCareerApplications(): Promise<FirestoreCareerApplication[]> {
    return this.getDocs<FirestoreCareerApplication>(
      this.db.collection('careerApplications').orderBy('createdAt', 'desc'),
      careerApplicationSchema
    );
  }

  async getCareerApplicationById(id: string): Promise<FirestoreCareerApplication | undefined> {
    return this.getDoc<FirestoreCareerApplication>('careerApplications', id, careerApplicationSchema);
  }

  async createCareerApplication(
    application: Omit<FirestoreCareerApplication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FirestoreCareerApplication> {
    const newApplication = createNewDocument<FirestoreCareerApplication>({
      ...application,
      // Required fields
      name: application.name,
      email: application.email,
      jobId: String(application.jobId),
      // Optional fields with null fallback
      status: application.status ?? 'pending',
      phone: application.phone ?? undefined,
      coverLetter: application.coverLetter ?? undefined,
      resumeUrl: application.resumeUrl ?? undefined
    });
    const careerAppRef = await this.db.collection('careerApplications').add(newApplication);
    return { ...newApplication as any, id: careerAppRef.id };
  }


  async updateCareerApplicationStatus(
    id: string, 
    status: FirestoreCareerApplication['status']
  ): Promise<FirestoreCareerApplication | undefined> {
    const careerAppRef = this.db.collection('careerApplications').doc(id);
    const careerAppDoc = await careerAppRef.get();
    if (!careerAppDoc.exists) return undefined;

    const updates = updateDocument<FirestoreCareerApplication>({ status });
    await careerAppRef.update(updates);
    
    const updatedCareerApp = await careerAppRef.get();
    return this.parseDoc<FirestoreCareerApplication>(updatedCareerApp, careerApplicationSchema);
  }

  // Student application operations
  async getStudentApplications(): Promise<FirestoreStudentApplication[]> {
    return this.getDocs<FirestoreStudentApplication>(
      this.db.collection('studentApplications').orderBy('createdAt', 'desc'),
      studentApplicationSchema
    );
  }

  async getStudentApplicationById(id: string): Promise<FirestoreStudentApplication | undefined> {
    return this.getDoc<FirestoreStudentApplication>('studentApplications', id, studentApplicationSchema);
  }

  async createStudentApplication(
    application: Omit<FirestoreStudentApplication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FirestoreStudentApplication> {
    const newApplication = createNewDocument<FirestoreStudentApplication>({
      ...application,
      // Required fields
      name: application.name,
      email: application.email,
      courseId: String(application.courseId),
      // Optional fields with defaults
      status: application.status ?? 'pending',
      phone: application.phone ?? undefined,
      message: application.message ?? undefined
    });
    const studentAppRef = await this.db.collection('studentApplications').add(newApplication);
    return { ...newApplication as any, id: studentAppRef.id };
  }


  async updateStudentApplicationStatus(
    id: string, 
    status: FirestoreStudentApplication['status']
  ): Promise<FirestoreStudentApplication | undefined> {
    const studentAppRef = this.db.collection('studentApplications').doc(id);
    const studentAppDoc = await studentAppRef.get();
    if (!studentAppDoc.exists) return undefined;

    const updates = updateDocument<FirestoreStudentApplication>({ status });
    await studentAppRef.update(updates);
    
    const updatedStudentApp = await studentAppRef.get();
    return this.parseDoc<FirestoreStudentApplication>(updatedStudentApp, studentApplicationSchema);
  }

  // Contact message operations
  async getContactMessages(): Promise<FirestoreContactMessage[]> {
    return this.getDocs<FirestoreContactMessage>(
      this.db.collection('contactMessages').orderBy('createdAt', 'desc'),
      contactMessageSchema
    );
  }

  async getContactMessageById(id: string): Promise<FirestoreContactMessage | undefined> {
    return this.getDoc<FirestoreContactMessage>('contactMessages', id, contactMessageSchema);
  }

  async createContactMessage(
    message: Omit<FirestoreContactMessage, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FirestoreContactMessage> {
    const newMessage = createNewDocument<FirestoreContactMessage>({
      ...message,
      isRead: message.isRead ?? false
    });
    const docRef = await this.db.collection('contactMessages').add(newMessage);
    return { ...newMessage as any, id: docRef.id };
  }

  async markContactMessageAsRead(id: string): Promise<FirestoreContactMessage | undefined> {
    const contactMessageRef = this.db.collection('contactMessages').doc(id);
    const contactMessageDoc = await contactMessageRef.get();
    if (!contactMessageDoc.exists) return undefined;

    const updates = updateDocument<FirestoreContactMessage>({ isRead: true });
    await contactMessageRef.update(updates);
    
    const updatedContactMessage = await contactMessageRef.get();
    return this.parseDoc<FirestoreContactMessage>(updatedContactMessage, contactMessageSchema);
  }

  // Admin dashboard operations
  async getDashboardStats(): Promise<{
    studentCount: number;
    courseCount: number;
    applicationCount: number;
    unreadMessageCount: number;
  }> {
    const [
      studentApps,
      courses,
      careerApps,
      messages
    ] = await Promise.all([
      this.db.collection('studentApplications').count().get(),
      this.db.collection('courses').where('active', '==', true).count().get(),
      this.db.collection('careerApplications').count().get(),
      this.db.collection('contactMessages').where('isRead', '==', false).count().get()
    ]);

    return {
      studentCount: studentApps.data().count,
      courseCount: courses.data().count,
      applicationCount: careerApps.data().count,
      unreadMessageCount: messages.data().count
    };
  }

  /**
   * Helper to delete a document by collection and ID.
   */
  private async deleteById(collection: string, id: string): Promise<boolean> {
    try {
      const docRef = this.db.collection(collection).doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return false;
      await docRef.delete();
      return true;
    } catch (error) {
      console.error(`deleteById(${collection})`, error);
      return false;
    }
  }

  /**
   * Delete a category by ID.
   */
  async deleteCategory(id: string): Promise<boolean> {
    return this.deleteById('categories', id);
  }

  /**
   * Delete a course by ID.
   */
  async deleteCourse(id: string): Promise<boolean> {
    return this.deleteById('courses', id);
  }

  /**
   * Delete a testimonial by ID.
   */
  async deleteTestimonial(id: string): Promise<boolean> {
    return this.deleteById('testimonials', id);
  }

  /**
   * Delete a team member by ID.
   */
  async deleteTeamMember(id: string): Promise<boolean> {
    return this.deleteById('teamMembers', id);
  }

  /**
   * Delete a job by ID.
   */
  async deleteJob(id: string): Promise<boolean> {
    return this.deleteById('jobs', id);
  }

  /**
   * Delete a student application by ID.
   * (Consider soft delete for auditing in production)
   */
  async deleteStudentApplication(id: string): Promise<boolean> {
    return this.deleteById('studentApplications', id);
  }

  /**
   * Delete a career application by ID.
   * (Consider soft delete for auditing in production)
   */
  async deleteCareerApplication(id: string): Promise<boolean> {
    return this.deleteById('careerApplications', id);
  }

  /**
   * Delete a contact message by ID.
   */
  async deleteContactMessage(id: string): Promise<boolean> {
    return this.deleteById('contactMessages', id);
  }
}

// Initialize storage with Firestore
export const storage = new FirestoreStorage();
