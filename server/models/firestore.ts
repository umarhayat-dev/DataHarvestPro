import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

// Helper to convert timestamps
export const firestoreTimestamp = z.custom<Timestamp>((val) => val instanceof Timestamp);

// Base schema for all documents
export const baseSchema = {
  createdAt: firestoreTimestamp,
  updatedAt: firestoreTimestamp,
};

// User schemas
export const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().nullable(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().nullable(),
  isAdmin: z.boolean().default(false),
}).strict();

export const userSchema = z.object({
  ...baseSchema,
  username: z.string(),
  password: z.string(),
  email: z.string().nullable(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().nullable(),
  isAdmin: z.boolean().default(false),
}).strict();

// Category schema
export const categorySchema = z.object({
  ...baseSchema,
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true),
}).strict();

// Course schema
export const courseSchema = z.object({
  ...baseSchema,
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  duration: z.string().optional(),
  price: z.number(),
  featured: z.boolean().default(false),
  categoryId: z.string(),
  instructorName: z.string().optional(),
  instructorTitle: z.string().optional(),
  instructorImage: z.string().optional(),
  rating: z.number().default(0),
  reviewCount: z.number().default(0),
  active: z.boolean().default(true),
}).strict();

// Testimonial schema
export const testimonialSchema = z.object({
  ...baseSchema,
  name: z.string(),
  role: z.string().optional(),
  content: z.string(),
  rating: z.number(),
  imageUrl: z.string().optional(),
  visible: z.boolean().default(true),
}).strict();

// Team member schema
export const teamMemberSchema = z.object({
  ...baseSchema,
  name: z.string(),
  role: z.string(),
  bio: z.string().optional(),
  imageUrl: z.string().optional(),
  visible: z.boolean().default(true),
}).strict();

// Job schema
export const jobSchema = z.object({
  ...baseSchema,
  title: z.string(),
  description: z.string(),
  requirements: z.string(),
  location: z.string().optional(),
  type: z.string().optional(),
  active: z.boolean().default(true),
}).strict();

const ApplicationStatus = z.enum(['pending', 'reviewed', 'accepted', 'rejected']);
type ApplicationStatus = z.infer<typeof ApplicationStatus>;

// Career application schema
export const careerApplicationSchema = z.object({
  ...baseSchema,
  jobId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
  status: ApplicationStatus.default('pending'),
}).strict();

// Student application schema
export const studentApplicationSchema = z.object({
  ...baseSchema,
  courseId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  message: z.string().optional(),
  status: ApplicationStatus.default('pending'),
}).strict();

// Contact message schema
export const contactMessageSchema = z.object({
  ...baseSchema,
  name: z.string(),
  email: z.string(),
  subject: z.string().optional(),
  message: z.string(),
  isRead: z.boolean().default(false),
}).strict();

// Type definitions with id
export type FirestoreDocument = {
  createdAt: Timestamp;
  updatedAt: Timestamp;
} & { id: string };

export type FirestoreUser = z.infer<typeof userSchema> & FirestoreDocument;
export type FirestoreCategory = z.infer<typeof categorySchema> & FirestoreDocument;
export type FirestoreCourse = z.infer<typeof courseSchema> & FirestoreDocument;
export type FirestoreTestimonial = z.infer<typeof testimonialSchema> & FirestoreDocument;
export type FirestoreTeamMember = z.infer<typeof teamMemberSchema> & FirestoreDocument;
export type FirestoreJob = z.infer<typeof jobSchema> & FirestoreDocument;
export type FirestoreCareerApplication = z.infer<typeof careerApplicationSchema> & FirestoreDocument;
export type FirestoreStudentApplication = z.infer<typeof studentApplicationSchema> & FirestoreDocument;
export type FirestoreContactMessage = z.infer<typeof contactMessageSchema> & FirestoreDocument;

// Helper function to create a new document with timestamps
export const createNewDocument = <T extends Record<string, any>>(data: Omit<T, keyof FirestoreDocument>): Omit<T, 'id'> => {
  const now = FieldValue.serverTimestamp();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  } as Omit<T, 'id'>;
};

// Helper function to update a document
export const updateDocument = <T extends Record<string, any>>(
  data: Partial<Omit<T, keyof FirestoreDocument>>
): { updatedAt: FieldValue } & Partial<Omit<T, keyof FirestoreDocument>> => {
  return {
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  };
};
