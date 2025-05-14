import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import { Job, CareerApplication } from '@shared/schema';
import { Loader2, Plus, Eye, Edit, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import JobForm from '@/components/forms/job-form';

const CareersPage = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [isEditJobDialogOpen, setIsEditJobDialogOpen] = useState(false);
  const [isViewApplicationDialogOpen, setIsViewApplicationDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch jobs
  const { 
    data: jobs, 
    isLoading: isLoadingJobs 
  } = useQuery<Job[]>({ 
    queryKey: ['/api/jobs'] 
  });
  
  // Fetch career applications
  const { 
    data: applications, 
    isLoading: isLoadingApplications 
  } = useQuery<CareerApplication[]>({ 
    queryKey: ['/api/admin/career-applications'] 
  });
  
  // Toggle job active status
  const toggleJobActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      await apiRequest('PATCH', `/api/jobs/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({
        title: "Job updated",
        description: "The job status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update the job status. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Update application status
  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest('PATCH', `/api/admin/career-applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/career-applications'] });
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

  const handleEditJob = (job: Job) => {
    setSelectedJob(job);
    setIsEditJobDialogOpen(true);
  };

  const handleToggleJobActive = (job: Job) => {
    toggleJobActiveMutation.mutate({ id: job.id, active: !job.active });
  };

  const handleViewApplication = (application: CareerApplication) => {
    setSelectedApplication(application);
    setIsViewApplicationDialogOpen(true);
  };

  const handleUpdateApplicationStatus = (id: number, status: string) => {
    updateApplicationStatusMutation.mutate({ id, status });
    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({...selectedApplication, status});
    }
  };

  const handleAddJobSuccess = () => {
    setIsAddJobDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    toast({
      title: "Job created",
      description: "The new job has been created successfully.",
    });
  };

  const handleEditJobSuccess = () => {
    setIsEditJobDialogOpen(false);
    setSelectedJob(null);
    queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    toast({
      title: "Job updated",
      description: "The job has been updated successfully.",
    });
  };

  // Filter applications based on selected filters
  const filteredApplications = applications?.filter(app => {
    const matchesJob = jobFilter === 'all' || (app.jobId && app.jobId.toString() === jobFilter);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesJob && matchesStatus;
  });

  // Get job title by ID
  const getJobTitle = (jobId: number | null) => {
    if (!jobId || !jobs) return "Unknown Job";
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : "Unknown Job";
  };

  // Format date
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout 
      title="Career Management" 
      description="Manage job listings and career applications."
    >
      <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="applications">Career Applications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Job Listings</h2>
              <p className="text-gray-500">
                {jobs?.length || 0} jobs in total
              </p>
            </div>
            <Button onClick={() => setIsAddJobDialogOpen(true)} className="bg-primary">
              <Plus className="mr-2 h-4 w-4" /> Add New Job
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoadingJobs ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date Posted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>{job.type}</TableCell>
                          <TableCell>
                            <Badge variant={job.active ? "default" : "outline"} className={job.active ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                              {job.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(job.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleToggleJobActive(job)}
                                disabled={toggleJobActiveMutation.isPending}
                              >
                                {job.active ? "Deactivate" : "Activate"}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditJob(job)}
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
                  No job listings found. Create your first job listing by clicking the "Add New Job" button.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Career Applications</h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-gray-700 mr-3">Filter by:</span>
              </div>
              
              <div className="w-full sm:w-64 mr-4">
                <Select value={jobFilter} onValueChange={setJobFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {jobs?.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {isLoadingApplications || isLoadingJobs ? (
                <div className="flex justify-center items-center p-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredApplications && filteredApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Job Position</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{application.name}</div>
                              <div className="text-sm text-gray-500">{application.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getJobTitle(application.jobId)}</TableCell>
                          <TableCell>{formatDate(application.createdAt)}</TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                                application.status === 'reviewed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                                application.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                                'bg-red-100 text-red-800 hover:bg-red-100'
                              }
                            >
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewApplication(application)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No applications found matching the current filters.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Job Dialog */}
      <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Job Listing</DialogTitle>
          </DialogHeader>
          <JobForm onSuccess={handleAddJobSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditJobDialogOpen} onOpenChange={setIsEditJobDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Job Listing</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <JobForm 
              job={selectedJob} 
              onSuccess={handleEditJobSuccess} 
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={isViewApplicationDialogOpen} onOpenChange={setIsViewApplicationDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Career Application</DialogTitle>
            <DialogDescription>
              Submitted on {selectedApplication && formatDate(selectedApplication.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Applicant</h3>
                  <p className="mt-1 text-lg font-semibold">{selectedApplication.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Position</h3>
                  <p className="mt-1 text-lg font-semibold">{getJobTitle(selectedApplication.jobId)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">
                    <a href={`mailto:${selectedApplication.email}`} className="text-primary hover:underline">
                      {selectedApplication.email}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{selectedApplication.phone || "Not provided"}</p>
                </div>
              </div>
              
              {selectedApplication.resumeUrl && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Resume</h3>
                  <p className="mt-1">
                    <a 
                      href={selectedApplication.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Resume
                    </a>
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Cover Letter</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Application Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'pending' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'pending')}
                    disabled={updateApplicationStatusMutation.isPending}
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'reviewed' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'reviewed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'reviewed')}
                    disabled={updateApplicationStatusMutation.isPending}
                  >
                    Reviewed
                  </Button>
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'accepted' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'accepted')}
                    disabled={updateApplicationStatusMutation.isPending}
                  >
                    Accepted
                  </Button>
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'rejected' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                    onClick={() => handleUpdateApplicationStatus(selectedApplication.id, 'rejected')}
                    disabled={updateApplicationStatusMutation.isPending}
                  >
                    Rejected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CareersPage;
