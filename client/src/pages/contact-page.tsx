import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ContactForm from '@/components/forms/contact-form';
import { Card, CardContent } from '@/components/ui/card';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Alyusr Quran Institute</title>
        <meta name="description" content="Get in touch with Alyusr Quran Institute. We're here to answer your questions about our courses, enrollment process, or any other inquiries you may have." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
                <p className="text-lg mb-4">
                  We're here to help with any questions you may have about our courses or enrollment process.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Info & Form Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                  <p className="text-gray-700 mb-8">
                    Have questions about our courses, enrollment process, or anything else? Our team is ready to assist you. Fill out the contact form, and we'll get back to you as soon as possible.
                  </p>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <span className="material-icons text-primary">location_on</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold mb-1">Our Address</h3>
                            <p className="text-gray-700">123 Education Ave, New York, NY 10001</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-green-100 p-3 rounded-full">
                            <span className="material-icons text-secondary">email</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold mb-1">Email Us</h3>
                            <p className="text-gray-700">
                              <a href="mailto:info@alyusrquran.com" className="text-primary hover:underline">info@alyusrquran.com</a>
                            </p>
                            <p className="text-gray-700 mt-1">
                              <a href="mailto:admin@alyusrquran.com" className="text-primary hover:underline">admin@alyusrquran.com</a> (For administrative inquiries)
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-amber-100 p-3 rounded-full">
                            <span className="material-icons text-accent">phone</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold mb-1">Call Us</h3>
                            <p className="text-gray-700">
                              <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a>
                            </p>
                            <p className="text-gray-600 text-sm mt-1">Monday to Friday, 9am to 5pm EST</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="bg-purple-100 p-3 rounded-full">
                            <span className="material-icons text-purple-600">schedule</span>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold mb-1">Office Hours</h3>
                            <p className="text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM</p>
                            <p className="text-gray-700">Saturday: 10:00 AM - 2:00 PM</p>
                            <p className="text-gray-700">Sunday: Closed</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Find Us</h2>
              <div className="rounded-lg overflow-hidden shadow-md h-96 bg-gray-200">
                {/* Here you would typically add a Google Maps component */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="material-icons text-6xl text-gray-400">map</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">How do I enroll in a course?</h3>
                      <p className="text-gray-700">
                        You can enroll in a course by clicking the "Apply Now" button on the course page and completing the application form. Our team will review your application and contact you with next steps.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Are there any prerequisites for courses?</h3>
                      <p className="text-gray-700">
                        Prerequisites vary by course. Basic courses typically have no prerequisites, while more advanced courses may require prior knowledge. Check the specific course page for prerequisite information.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">Do you offer financial aid?</h3>
                      <p className="text-gray-700">
                        Yes, we offer financial aid and scholarships to qualified students. Please contact our administrative office for more information about financial aid options.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">What is your refund policy?</h3>
                      <p className="text-gray-700">
                        We offer a 30-day money-back guarantee for most courses. If you're not satisfied with your course within the first 30 days, you can request a full refund.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
