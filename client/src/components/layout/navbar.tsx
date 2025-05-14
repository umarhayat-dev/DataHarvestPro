import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "./mobile-menu";

const Navbar = () => {
  const [location] = useLocation();
  const { user, isAuthenticated, logoutMutation } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className={`bg-white sticky top-0 z-50 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary font-bold text-xl cursor-pointer">
                  Alyusr Quran Institute
                </span>
              </Link>
            </div>
            
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className={`${
                  location === "/" 
                    ? "border-primary text-gray-900 border-b-2" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                } px-1 pt-1 inline-flex items-center text-sm font-medium h-full`}
              >
                Home
              </Link>
              
              <Link 
                href="/about" 
                className={`${
                  location === "/about" 
                    ? "border-primary text-gray-900 border-b-2" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                } px-1 pt-1 inline-flex items-center text-sm font-medium h-full`}
              >
                About
              </Link>
              
              <Link 
                href="/courses" 
                className={`${
                  location.startsWith("/courses") 
                    ? "border-primary text-gray-900 border-b-2" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                } px-1 pt-1 inline-flex items-center text-sm font-medium h-full`}
              >
                Courses
              </Link>
              
              <Link 
                href="/career" 
                className={`${
                  location === "/career" 
                    ? "border-primary text-gray-900 border-b-2" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                } px-1 pt-1 inline-flex items-center text-sm font-medium h-full`}
              >
                Careers
              </Link>
              
              <Link 
                href="/contact" 
                className={`${
                  location === "/contact" 
                    ? "border-primary text-gray-900 border-b-2" 
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                } px-1 pt-1 inline-flex items-center text-sm font-medium h-full`}
              >
                Contact
              </Link>

              {user?.isAdmin && (
                <Link 
                  href="/admin" 
                  className={`${
                    location.startsWith("/admin") 
                      ? "border-primary text-gray-900 border-b-2" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2"
                  } px-1 pt-1 inline-flex items-center text-sm font-medium h-full`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <Link 
                href="/auth"
                className="text-primary hover:text-primary-dark font-medium inline-flex items-center px-4 py-2 rounded-md"
              >
                Login
              </Link>
            )}
            
            <Link 
              href="/apply"
              className="bg-primary text-white hover:bg-blue-700 inline-flex items-center px-4 py-2 rounded-md font-medium"
            >
              Apply Now
            </Link>
          </div>
          
          <div className="flex items-center sm:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="material-icons">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        currentPath={location} 
        isAuthenticated={isAuthenticated}
        isAdmin={user?.isAdmin || false}
        onLogout={handleLogout}
        isPendingLogout={logoutMutation.isPending}
      />
    </header>
  );
};

export default Navbar;
