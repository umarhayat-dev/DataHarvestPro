import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/admin-layout';
import StatCard from '@/components/admin/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { StudentApplication, CareerApplication, ContactMessage } from '@shared/schema';

interface DashboardStats {
  studentCount: number;
  courseCount: number;
  applicationCount: number;
  unreadMessageCount: number;
}

const DashboardPage = () => {
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: isLoadingStats 
  } = useQuery<DashboardStats>({ 
    queryKey: ['/api/admin/stats'] 
  });
  
  // Fetch recent applications
  const { 
    data: applications, 
    isLoading: isLoadingApplications 
  } = useQuery<StudentApplication[]>({ 
    queryKey: ['/api/admin/applications'],
    select: (data) => data.slice(0, 5) // Get only the 5 most recent
  });
  
  // Fetch recent messages
  const { 
    data: messages, 
    isLoading: isLoadingMessages 
  } = useQuery<ContactMessage[]>({ 
    queryKey: ['/api/admin/messages'],
    select: (data) => data.slice(0, 3) // Get only the 3 most recent
  });

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout 
      title="Dashboard Overview" 
      description="Welcome to the Alyusr Quran Institute admin dashboard."
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoadingStats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              </Card>
            ))}
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Total Students"
              value={stats.studentCount}
              icon="people"
              iconBgColor="bg-blue-100"
              iconColor="text-primary"
              trend={{ value: "12% from last month", isPositive: true }}
            />
            
            <StatCard
              title="Active Courses"
              value={stats.courseCount}
              icon="menu_book"
              iconBgColor="bg-green-100"
              iconColor="text-secondary"
              trend={{ value: "3 new this month", isPositive: true }}
            />
            
            <StatCard
              title="Applications"
              value={stats.applicationCount}
              icon="school"
              iconBgColor="bg-amber-100"
              iconColor="text-accent"
              trend={{ value: "8 pending review", isPositive: false }}
            />
            
            <StatCard
              title="New Messages"
              value={stats.unreadMessageCount}
              icon="message"
              iconBgColor="bg-red-100"
              iconColor="text-red-500"
              trend={stats.unreadMessageCount > 0 ? { value: "Requires attention", isPositive: false } : undefined}
            />
          </>
        ) : (
          <div className="col-span-4 text-center text-red-500 py-6">
            Error loading dashboard statistics
          </div>
        )}
      </div>
      
      {/* Recent Applications */}
      <Card className="mb-8">
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold">Recent Applications</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          {isLoadingApplications ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : applications && applications.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          <span className="material-icons text-gray-400">person</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.name}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Course #{application.courseId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(application.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button 
                        variant="link" 
                        className="text-primary hover:text-blue-700 font-medium"
                        onClick={() => {/* Handle review */}}
                      >
                        {application.status === 'pending' ? 'Review' : 'View'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No recent applications
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link href="/admin/applications">
            <a className="text-primary hover:text-blue-700 font-medium text-sm">View all applications →</a>
          </Link>
        </div>
      </Card>
      
      {/* Recent Messages */}
      <Card>
        <CardHeader className="px-6 py-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : messages && messages.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div key={message.id} className="p-6 flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <span className="material-icons text-primary">mail</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">{message.name}</h3>
                      <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}</p>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        className="bg-primary text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => {/* Handle reply */}}
                      >
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded ml-2 hover:bg-gray-200"
                        onClick={() => {/* Handle mark as read */}}
                      >
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No recent messages
            </div>
          )}
        </CardContent>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link href="/admin/messages">
            <a className="text-primary hover:text-blue-700 font-medium text-sm">View all messages →</a>
          </Link>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default DashboardPage;
