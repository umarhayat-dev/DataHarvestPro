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
import { TeamMember, insertTeamMemberSchema } from '@shared/schema';

interface TeamFormProps {
  member?: TeamMember;
  onSuccess?: () => void;
  isEditing?: boolean;
}

// Schema for form validation
const teamFormSchema = insertTeamMemberSchema;

type TeamFormValues = z.infer<typeof teamFormSchema>;

const TeamForm = ({ member, onSuccess, isEditing = false }: TeamFormProps) => {
  const { toast } = useToast();
  
  // Get default values for form
  const getDefaultValues = (): Partial<TeamFormValues> => {
    if (member) {
      return {
        ...member,
      };
    }
    
    return {
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      visible: true,
    };
  };
  
  // Form setup
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: getDefaultValues(),
  });
  
  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      if (isEditing && member) {
        // Update existing team member
        const response = await apiRequest('PATCH', `/api/team/${member.id}`, values);
        return response.json();
      } else {
        // Create new team member
        const response = await apiRequest('POST', '/api/team', values);
        return response.json();
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Team member updated" : "Team member added",
        description: isEditing 
          ? "The team member has been updated successfully." 
          : "The team member has been added successfully.",
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
  const onSubmit = (values: TeamFormValues) => {
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
                <Input placeholder="Full name of the team member" {...field} />
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
              <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="e.g., Quran Instructor, Arabic Teacher" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief biography of the team member, including qualifications and experience"
                  className="min-h-[120px]"
                  {...field}
                  value={field.value || ''}
                />
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
                URL to a profile image of the team member (recommended size: 400x400px)
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
                  Show this team member on the About page
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
            isEditing ? "Update Team Member" : "Add Team Member"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TeamForm;
