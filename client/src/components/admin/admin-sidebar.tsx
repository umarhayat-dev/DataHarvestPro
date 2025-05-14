import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  onLinkClick?: () => void;
}

const AdminSidebar = ({ onLinkClick }: AdminSidebarProps) => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const navigationItems = [
    { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/courses', icon: 'menu_book', label: 'Courses' },
    { path: '/admin/applications', icon: 'school', label: 'Applications', badge: 18 },
    { path: '/admin/careers', icon: 'work', label: 'Career Applications' },
    { path: '/admin/messages', icon: 'message', label: 'Messages', badge: 3 },
    { path: '/admin/team', icon: 'groups', label: 'Team' },
    { path: '/admin/testimonials', icon: 'format_quote', label: 'Testimonials' },
    { path: '/admin/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/admin">
          <a className="flex items-center text-xl font-bold text-primary" onClick={onLinkClick}>
            <span className="material-icons mr-2">school</span>
            Admin Dashboard
          </a>
        </Link>
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={`flex items-center px-4 py-3 ${
                location === item.path 
                  ? 'bg-blue-50 text-primary' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-primary'
              }`}
              onClick={onLinkClick}
            >
              <span className="material-icons mr-3">{item.icon}</span>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-accent text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt={user.username}
                className="h-10 w-10 rounded-full" 
              />
            ) : (
              <span className="material-icons text-gray-400">person</span>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
        
        <Link href="/">
          <a className="block text-center text-sm text-primary hover:underline mt-3">
            Return to Website
          </a>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
