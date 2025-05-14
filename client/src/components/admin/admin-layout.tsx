import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'wouter';
import AdminSidebar from './admin-sidebar';
import { Button } from '@/components/ui/button';
import { Loader2, Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/auth" />;
  }

  if (!user.isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>{title} - Admin Dashboard | Alyusr Quran Institute</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      
      <div className="bg-gray-100 min-h-screen">
        <div className="flex">
          {/* Admin Sidebar - hidden on mobile, visible on md and up */}
          <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 md:relative`}>
            <AdminSidebar onLinkClick={() => setIsSidebarOpen(false)} />
          </div>
          
          {/* Overlay when sidebar is open on mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Main content */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle sidebar"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-bold">{title}</h1>
              <div className="w-6"></div> {/* Spacer for flex alignment */}
            </div>
            
            {/* Page content */}
            <div className="p-6">
              <div className="hidden md:block mb-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-gray-600 mt-1">{description}</p>}
              </div>
              
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
