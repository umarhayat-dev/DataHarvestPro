import { useState } from 'react';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Course, StudentApplication } from '@shared/schema';
import { Eye } from 'lucide-react';

interface ApplicationListProps {
  applications: StudentApplication[];
  courses: Course[];
  onStatusChange: (id: number, status: string) => void;
  isUpdating: boolean;
}

const ApplicationList = ({ applications, courses, onStatusChange, isUpdating }: ApplicationListProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<StudentApplication | null>(null);
  
  // Get course title by ID
  const getCourseTitle = (courseId: number | null) => {
    if (!courseId) return "Unknown Course";
    const course = courses.find(course => course.id === courseId);
    return course ? course.title : "Unknown Course";
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
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'accepted':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return '';
    }
  };

  const handleViewApplication = (application: StudentApplication) => {
    setSelectedApplication(application);
    setIsViewDialogOpen(true);
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No applications found matching the current criteria.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Date Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.name}</TableCell>
                <TableCell>{application.email}</TableCell>
                <TableCell>{getCourseTitle(application.courseId)}</TableCell>
                <TableCell>{formatDate(application.createdAt)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(application.status)}>
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

      {/* View Application Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Student Application</DialogTitle>
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
                  <h3 className="text-sm font-medium text-gray-500">Course</h3>
                  <p className="mt-1 text-lg font-semibold">{getCourseTitle(selectedApplication.courseId)}</p>
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
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{selectedApplication.message}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Application Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'pending' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                    onClick={() => onStatusChange(selectedApplication.id, 'pending')}
                    disabled={isUpdating}
                  >
                    Pending
                  </Button>
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'reviewed' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'reviewed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                    onClick={() => onStatusChange(selectedApplication.id, 'reviewed')}
                    disabled={isUpdating}
                  >
                    Reviewed
                  </Button>
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'accepted' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'accepted' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                    onClick={() => onStatusChange(selectedApplication.id, 'accepted')}
                    disabled={isUpdating}
                  >
                    Accepted
                  </Button>
                  <Button 
                    size="sm"
                    variant={selectedApplication.status === 'rejected' ? 'default' : 'outline'}
                    className={selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}
                    onClick={() => onStatusChange(selectedApplication.id, 'rejected')}
                    disabled={isUpdating}
                  >
                    Rejected
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <a 
                  href={`mailto:${selectedApplication.email}?subject=Regarding Your Application to Alyusr Quran Institute`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button>Contact Applicant</Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApplicationList;
