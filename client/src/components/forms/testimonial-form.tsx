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
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Testimonial, insertTestimonialSchema } from '@shared/schema';

interface TestimonialFormProps {
  testimonial?: Testimonial;
  onSuccess?: () => void;
  isEditing?: boolean;
}

// Schema for form validation
const testimonialFormSchema = insertTestimonialSchema;

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

const TestimonialForm = ({ testimonial, onSuccess, isEditing = false }: TestimonialFormProps) => {
  const { toast } = useToast();
  
  // Get default values for form
  const getDefaultValues = (): Partial<TestimonialFormValues> => {
    if (testimonial) {
      return {
        ...testimonial,
      };
    }
    
    return {
      name: "",
      role: "",
      content: "",
      rating: 5,
      imageUrl: "",
      visible: true,
    };
  };
  
  // Form setup
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: getDefaultValues(),
  });
  
  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (values: TestimonialFormValues) => {
      if (isEditing && testimonial) {
        // Update existing testimonial
        const response = await apiRequest('PATCH', `/api/testimonials/${testimonial.id}`, values);
        return response.json();
      } else {
        // Create new testimonial
        const response = await apiRequest('POST', '/api/testimonials', values);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Testimonial updated" : "Testimonial added",
        description: isEditing 
          ? "The testimonial has been updated successfully." 
          : "The testimonial has been added successfully.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: isEditing ? "Update failed" : "Addition failed",
        description: error.message || "There was an error. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Form submission
  const onSubmit = (values: TestimonialFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Name of the person giving testimonial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Quran Recitation Student, Parent of Student" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial Content <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What the person said about their experience"
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <RadioGroup 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value.toString()}
                  className="flex space-x-4"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <FormItem key={rating} className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value={rating.toString()} />
                      </FormControl>
                      <FormLabel className="font-normal flex">
                        {rating}
                        <span className="material-icons text-accent text-sm ml-1">star</span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/profile.jpg" 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                URL to a profile image of the person (recommended size: 100x100px)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="visible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between p-4 border rounded-md">
              <div className="space-y-0.5">
                <FormLabel>Visible on Website</FormLabel>
                <FormDescription>
                  Show this testimonial on the website
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
        
        <Button 
          type="submit" 
          className="w-full bg-primary" 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : (
            isEditing ? "Update Testimonial" : "Add Testimonial"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TestimonialForm;
