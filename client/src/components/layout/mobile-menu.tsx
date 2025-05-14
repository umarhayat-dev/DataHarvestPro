import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  currentPath: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  isPendingLogout: boolean;
}

const MobileMenu = ({ 
  isOpen, 
  currentPath, 
  isAuthenticated, 
  isAdmin,
  onLogout,
  isPendingLogout
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
        <Link href="/"
          className={`${
            currentPath === "/" 
              ? "bg-primary text-white" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          } block px-3 py-2 rounded-md text-base font-medium`}
        >
          Home
        </Link>
        
        <Link href="/about"
          className={`${
            currentPath === "/about" 
              ? "bg-primary text-white" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          } block px-3 py-2 rounded-md text-base font-medium`}
        >
          About
        </Link>
        
        <Link href="/courses"
          className={`${
            currentPath.startsWith("/courses") 
              ? "bg-primary text-white" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          } block px-3 py-2 rounded-md text-base font-medium`}
        >
          Courses
        </Link>
        
        <Link href="/career"
          className={`${
            currentPath === "/career" 
              ? "bg-primary text-white" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          } block px-3 py-2 rounded-md text-base font-medium`}
        >
          Careers
        </Link>
        
        <Link href="/contact"
          className={`${
            currentPath === "/contact" 
              ? "bg-primary text-white" 
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          } block px-3 py-2 rounded-md text-base font-medium`}
        >
          Contact
        </Link>

        {isAdmin && (
          <Link href="/admin"
            className={`${
              currentPath.startsWith("/admin") 
                ? "bg-primary text-white" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            } block px-3 py-2 rounded-md text-base font-medium`}
          >
            Admin
          </Link>
        )}
        
        <Link href="/apply"
          className="mt-2 w-full bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 text-center block"
        >
          Apply Now
        </Link>

        {isAuthenticated ? (
          <Button 
            variant="outline" 
            onClick={onLogout}
            disabled={isPendingLogout}
            className="mt-2 w-full border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
          >
            {isPendingLogout ? "Logging out..." : "Logout"}
          </Button>
        ) : (
          <Link href="/auth"
            className="mt-2 w-full border border-primary text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 text-center block"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
