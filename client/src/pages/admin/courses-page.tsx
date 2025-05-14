import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import { Course, Category } from '@shared/schema';
import { Loader2, Plus, Edit, Trash2, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import CourseForm from '@/components/forms/course-form';
import { Link } from 'wouter';

const CoursesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch all courses
  const { 
    data: courses, 
    isLoading: isLoadingCourses 
  } = useQuery<Course[]>({ 
    queryKey: ['/api/courses'] 
  });
  
  // Fetch categories for the form
  const { 
    data: categories 
  } = useQuery<Category[]>({ 
    queryKey: ['/api/categories'] 
  });
  
  // Toggle featured status
  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      await apiRequest('PATCH', `/api/courses/${id}`, { featured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course updated",
        description: "The course has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update the course. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      await apiRequest('PATCH', `/api/courses/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      toast({
        title: "Course updated",
        description: "The course status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update the course status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    toast({
      title: "Course created",
      description: "The new course has been created successfully.",
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedCourse(null);
    queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    toast({
      title: "Course updated",
      description: "The course has been updated successfully.",
    });
  };

  const handleToggleFeatured = (course: Course) => {
    toggleFeatureMutation.mutate({ id: course.id, featured: !course.featured });
  };

  const handleToggleActive = (course: Course) => {
    toggleActiveMutation.mutate({ id: course.id, active: !course.active });
  };

  // Find category name by ID
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId || !categories) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  return (
    <AdminLayout 
      title="Course Management" 
      description="Create, edit, and manage all courses."
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">All Courses</h2>
          <p className="text-gray-500">
            {courses?.length || 0} courses in total
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Add New Course
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoadingCourses ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-gray-200 mr-3 flex-shrink-0 overflow-hidden">
                            {course.image ? (
                              <img 
                                src={course.image} 
                                alt={course.title} 
                                className="h-full w-full object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full w-full">
                                <span className="material-icons text-gray-400">menu_book</span>
                              </div>
                            )}
                          </div>
                          <span>{course.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryName(course.categoryId)}
                      </TableCell>
                      <TableCell>${parseFloat(course.price.toString()).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleToggleFeatured(course)}
                          disabled={toggleFeatureMutation.isPending}
                        >
                          {course.featured ? (
                            <Check className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.active ? "default" : "outline"} className={course.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                          {course.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleActive(course)}
                            disabled={toggleActiveMutation.isPending}
                          >
                            {course.active ? "Deactivate" : "Activate"}
                          </Button>
                          <Link href={`/courses/${course.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(course)}
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
              No courses found. Create your first course by clicking the "Add New Course" button.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          {categories && (
            <CourseForm 
              categories={categories} 
              onSuccess={handleAddSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          {selectedCourse && categories && (
            <CourseForm 
              course={selectedCourse} 
              categories={categories} 
              onSuccess={handleEditSuccess} 
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CoursesPage;
