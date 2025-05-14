import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import StudentApplicationForm from '@/components/forms/student-application-form';
import { Course } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const ApplyPage = () => {
  // Fetch all active courses
  const { 
    data: courses, 
    isLoading, 
    error 
  } = useQuery<Course[]>({ 
    queryKey: ['/api/courses'] 
  });

  // State to track application success
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>Apply Now - Alyusr Quran Institute</title>
        <meta name="description" content="Apply to join Alyusr Quran Institute. Begin your Quranic learning journey with our comprehensive courses taught by expert instructors." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">Apply for Admission</h1>
                <p className="text-lg mb-4">
                  Take the first step in your Quranic learning journey by applying to Alyusr Quran Institute.
                </p>
              </div>
            </div>
          </section>

          {/* Application Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {isSuccess ? (
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-icons text-green-600 text-2xl">check_circle</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
                  <p className="text-gray-700 mb-6">
                    Thank you for applying to Alyusr Quran Institute. We've received your application and will review it shortly. 
                    You should receive a confirmation email within the next 24 hours.
                  </p>
                  <p className="text-gray-700 mb-8">
                    Our team will contact you regarding the next steps in the enrollment process. If you have any questions in the meantime, 
                    feel free to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                    <Link href="/">
                      <Button className="bg-primary text-white">Return to Home</Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="border-primary text-primary">Contact Us</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Application Info */}
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Join Our Learning Community</h2>
                    <p className="text-gray-700 mb-6">
                      Thank you for your interest in studying with Alyusr Quran Institute. Please complete the application form, and our team will review your information and get back to you within 1-3 business days.
                    </p>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h3 className="text-xl font-semibold mb-4">Application Process</h3>
                      <ol className="space-y-4">
                        <li className="flex">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                          <div>
                            <h4 className="font-medium">Submit Application</h4>
                            <p className="text-gray-600 text-sm">Complete and submit the application form with all required information.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                          <div>
                            <h4 className="font-medium">Application Review</h4>
                            <p className="text-gray-600 text-sm">Our admissions team will review your application within 1-3 business days.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                          <div>
                            <h4 className="font-medium">Placement Assessment</h4>
                            <p className="text-gray-600 text-sm">For some courses, we may conduct a brief assessment to determine your current level.</p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">4</div>
                          <div>
                            <h4 className="font-medium">Enrollment & Payment</h4>
                            <p className="text-gray-600 text-sm">Upon acceptance, you'll receive enrollment instructions and payment information.</p>
                          </div>
                        </li>
                      </ol>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold mb-4">Have Questions?</h3>
                      <p className="text-gray-700 mb-4">
                        If you have any questions about the application process or need assistance, please don't hesitate to contact us.
                      </p>
                      <div className="flex items-center">
                        <span className="material-icons text-primary mr-2">email</span>
                        <a href="mailto:admissions@alyusrquran.com" className="text-primary hover:underline">admissions@alyusrquran.com</a>
                      </div>
                      <div className="flex items-center mt-2">
                        <span className="material-icons text-primary mr-2">phone</span>
                        <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Application Form */}
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6">Application Form</h2>
                    
                    {isLoading ? (
                      <div className="flex justify-center items-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : error ? (
                      <div className="text-center text-red-500 py-10">
                        Error loading courses. Please try again later.
                      </div>
                    ) : courses ? (
                      <StudentApplicationForm courses={courses} onSuccess={handleSuccess} />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ApplyPage;
