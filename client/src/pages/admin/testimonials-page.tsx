import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import { Testimonial } from '@shared/schema';
import { Loader2, Plus, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import TestimonialForm from '@/components/forms/testimonial-form';

const TestimonialsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch testimonials
  const { 
    data: testimonials, 
    isLoading 
  } = useQuery<Testimonial[]>({ 
    queryKey: ['/api/testimonials'] 
  });
  
  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, visible }: { id: number; visible: boolean }) => {
      await apiRequest('PATCH', `/api/testimonials/${id}`, { visible });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({
        title: "Testimonial updated",
        description: "The visibility has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update the testimonial. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsEditDialogOpen(true);
  };

  const handleToggleVisibility = (testimonial: Testimonial) => {
    toggleVisibilityMutation.mutate({ id: testimonial.id, visible: !testimonial.visible });
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    toast({
      title: "Testimonial added",
      description: "The new testimonial has been added successfully.",
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedTestimonial(null);
    queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    toast({
      title: "Testimonial updated",
      description: "The testimonial has been updated successfully.",
    });
  };

  // Generate stars for rating display
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`material-icons text-sm ${i < rating ? 'text-accent' : 'text-gray-300'}`}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout 
      title="Testimonials Management" 
      description="Add, edit, and manage customer testimonials."
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Testimonials</h2>
          <p className="text-gray-500">
            {testimonials?.length || 0} testimonials in total
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : testimonials && testimonials.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                            {testimonial.imageUrl ? (
                              <img 
                                src={testimonial.imageUrl} 
                                alt={testimonial.name} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full">
                                <span className="material-icons text-gray-400">person</span>
                              </div>
                            )}
                          </div>
                          <span>{testimonial.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{testimonial.role || "—"}</TableCell>
                      <TableCell>{renderStars(testimonial.rating)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {testimonial.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleVisibility(testimonial)}
                          disabled={toggleVisibilityMutation.isPending}
                        >
                          {testimonial.visible ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleVisibility(testimonial)}
                            disabled={toggleVisibilityMutation.isPending}
                          >
                            {testimonial.visible ? "Hide" : "Show"}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(testimonial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No testimonials found. Add your first testimonial by clicking the "Add Testimonial" button.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Testimonial Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
          </DialogHeader>
          <TestimonialForm onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          {selectedTestimonial && (
            <TestimonialForm 
              testimonial={selectedTestimonial} 
              onSuccess={handleEditSuccess} 
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default TestimonialsPage;
