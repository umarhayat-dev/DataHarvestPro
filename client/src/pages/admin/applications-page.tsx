import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import ApplicationList from '@/components/admin/application-list';
import { Course, StudentApplication } from '@shared/schema';
import { Loader2, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const ApplicationsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch student applications
  const { 
    data: applications, 
    isLoading: isLoadingApplications 
  } = useQuery<StudentApplication[]>({ 
    queryKey: ['/api/admin/applications'] 
  });
  
  // Fetch courses for the filter
  const { 
    data: courses, 
    isLoading: isLoadingCourses 
  } = useQuery<Course[]>({ 
    queryKey: ['/api/courses'] 
  });
  
  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PATCH', `/api/admin/applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/applications'] });
      toast({
        title: "Status updated",
        description: "The application status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update the application status. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter applications based on selected filters
  const filteredApplications = applications?.filter(app => {
    const matchesCourse = courseFilter === 'all' || app.courseId.toString() === courseFilter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesCourse && matchesStatus;
  });

  // Calculate counts for status badges
  const getStatusCounts = () => {
    if (!applications) return { total: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
    
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === 'pending').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      accepted: applications.filter(app => app.status === 'accepted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <AdminLayout 
      title="Student Applications" 
      description="View and manage student applications."
    >
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${statusFilter === 'all' ? 'bg-primary text-white hover:bg-primary' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({statusCounts.total})
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${statusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({statusCounts.pending})
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${statusFilter === 'reviewed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}`}
            onClick={() => setStatusFilter('reviewed')}
          >
            Reviewed ({statusCounts.reviewed})
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${statusFilter === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}
            onClick={() => setStatusFilter('accepted')}
          >
            Accepted ({statusCounts.accepted})
          </Badge>
          <Badge 
            variant="outline" 
            className={`cursor-pointer ${statusFilter === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-100' : ''}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected ({statusCounts.rejected})
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4 text-gray-500" />
            <span className="text-gray-700 mr-3">Filter by:</span>
          </div>
          
          <div className="w-full sm:w-64">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        {isLoadingApplications || isLoadingCourses ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ApplicationList 
            applications={filteredApplications || []} 
            courses={courses || []} 
            onStatusChange={handleStatusChange}
            isUpdating={updateStatusMutation.isPending}
          />
        )}
      </Card>
    </AdminLayout>
  );
};

export default ApplicationsPage;
