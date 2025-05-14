import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Alyusr Quran Institute</h3>
            <p className="text-gray-300 mb-4">Providing excellence in Quranic education for students worldwide.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="material-icons">twitter</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="material-icons">language</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="material-icons">email</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white">Courses</Link></li>
              <li><Link href="/career" className="text-gray-300 hover:text-white">Careers</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Courses</h3>
            <ul className="space-y-2">
              <li><Link href="/courses/1" className="text-gray-300 hover:text-white">Quran Recitation</Link></li>
              <li><Link href="/courses/2" className="text-gray-300 hover:text-white">Quran for Children</Link></li>
              <li><Link href="/courses/3" className="text-gray-300 hover:text-white">Arabic for Quran</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Quran Memorization</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Tajweed Rules</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="material-icons text-gray-400 mr-2">location_on</span>
                <span className="text-gray-300">123 Education Ave, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-gray-400 mr-2">phone</span>
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons text-gray-400 mr-2">email</span>
                <span className="text-gray-300">info@alyusrquran.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Alyusr Quran Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
