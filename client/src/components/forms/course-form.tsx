import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Course, Category, insertCourseSchema } from '@shared/schema';

interface CourseFormProps {
  course?: Course;
  categories: Category[];
  onSuccess?: () => void;
  isEditing?: boolean;
}

// Schema for form validation
const courseFormSchema = insertCourseSchema
  .extend({
    price: z.string().refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0 && num <= 99999999.99;
      },
      {
        message: "Price must be a valid number between 0 and 99,999,999.99",
      }
    ),
    categoryId: z.string().nullable().or(z.literal("all")),
    image: z.string().nullable(),
    duration: z.string().nullable(),
    instructorName: z.string().nullable(),
    instructorTitle: z.string().nullable(),
    instructorImage: z.string().nullable(),
  })
  .omit({ rating: true, reviewCount: true });

type CourseFormValues = z.infer<typeof courseFormSchema>;

const CourseForm = ({ course, categories, onSuccess, isEditing = false }: CourseFormProps) => {
  const { toast } = useToast();
  
  // Convert course data for form if editing
  const getDefaultValues = (): Partial<CourseFormValues> => {
    if (course) {
      return {
        ...course,
        price: typeof course.price === "number" ? course.price.toFixed(2) : course.price,
        categoryId: course.categoryId ? course.categoryId.toString() : "all",
        image: course.image ?? null,
        duration: course.duration ?? null,
        instructorName: course.instructorName ?? null,
        instructorTitle: course.instructorTitle ?? null,
        instructorImage: course.instructorImage ?? null,
      };
    }
    
    return {
      title: "",
      description: "",
      image: null,
      duration: null,
      price: "0.00",
      featured: false,
      categoryId: "all",
      instructorName: null,
      instructorTitle: null,
      instructorImage: null,
      active: true,
    };
  };
  
  // Form setup
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: getDefaultValues(),
  });
  
  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      // Convert form values to match API expectations
      const apiValues = {
        ...values,
        price: Number(values.price),
        categoryId: values.categoryId || undefined,
        image: values.image || undefined,
        duration: values.duration || undefined,
        instructorName: values.instructorName || undefined,
        instructorTitle: values.instructorTitle || undefined,
        instructorImage: values.instructorImage || undefined,
      };

      if (isEditing && course) {
        const response = await apiRequest('PATCH', `/api/courses/${course.id}`, apiValues);
        return response.json();
      } else {
        const response = await apiRequest('POST', '/api/courses', apiValues);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Course updated" : "Course created",
        description: isEditing 
          ? "The course has been updated successfully." 
          : "The course has been created successfully.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: isEditing ? "Update failed" : "Creation failed",
        description: error.message || "There was an error. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission
  const onSubmit = (values: CourseFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Quran Recitation with Tajweed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what the course is about and what students will learn"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      {...field} 
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormDescription>
                    URL to an image representing this course
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 12 weeks" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="e.g., 199.99" 
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          const num = Number(value);
                          if (!isNaN(num)) {
                            field.onChange(value);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category <span className="text-red-500">*</span></FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "all" ? "all" : value)} 
                    value={field.value || "all"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instructorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Dr. Aminah Khan" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instructorTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Tajweed Specialist" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="instructorImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/instructor.jpg" 
                      {...field} 
                      value={field.value || ''} 
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Course</FormLabel>
                      <FormDescription>
                        Display this course on the home page
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Show this course in listings
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-primary" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update Course" : "Create Course"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
