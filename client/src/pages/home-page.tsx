import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import CourseCard from '@/components/course/course-card';
import TestimonialCard from '@/components/home/testimonial-card';
import FeatureCard from '@/components/home/feature-card';
import { Button } from '@/components/ui/button';
import { Course, Testimonial } from '@shared/schema';
import { Loader2 } from 'lucide-react';

const HomePage = () => {
  // Fetch featured courses
  const { 
    data: featuredCourses, 
    isLoading: isLoadingCourses,
    error: coursesError
  } = useQuery<Course[]>({ 
    queryKey: ['/api/courses/featured']
  });

  // Fetch testimonials
  const { 
    data: testimonials, 
    isLoading: isLoadingTestimonials,
    error: testimonialsError
  } = useQuery<Testimonial[]>({ 
    queryKey: ['/api/testimonials']
  });

  const features = [
    {
      title: "Expert Teachers",
      description: "Learn from qualified scholars with ijazah (certification) in Quran recitation and Islamic studies.",
      icon: "school",
      iconBgColor: "bg-blue-100",
      iconColor: "text-primary"
    },
    {
      title: "Flexible Learning",
      description: "Study at your own pace with both online and in-person options to fit your schedule and preferences.",
      icon: "devices",
      iconBgColor: "bg-green-100",
      iconColor: "text-secondary"
    },
    {
      title: "Global Community",
      description: "Join students from around the world in a supportive learning environment with diverse perspectives.",
      icon: "public",
      iconBgColor: "bg-amber-100",
      iconColor: "text-accent"
    },
    {
      title: "Personalized Approach",
      description: "Receive individualized attention and feedback to help you progress at your optimal pace.",
      icon: "person",
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Alyusr Quran Institute - Home</title>
        <meta name="description" content="Begin your Quran journey with Alyusr Quran Institute. Comprehensive Quranic education with expert instructors and flexible learning options." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold mb-4">Begin Your Quran Journey Today</h1>
                  <p className="text-lg mb-8">Join Alyusr Quran Institute for comprehensive Quranic education with expert instructors and flexible learning options.</p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/courses">
                      <Button className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                        Explore Courses
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button className="bg-accent text-white hover:bg-amber-600 w-full sm:w-auto">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                    alt="Students learning Quran" 
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Courses Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Featured Courses</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Explore our most popular Quranic education programs designed for all ages and levels.</p>
              </div>
              
              {isLoadingCourses ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : coursesError ? (
                <div className="text-center text-red-500 py-10">
                  Error loading courses. Please try again later.
                </div>
              ) : (
                <>
                  {/* Featured Courses Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredCourses?.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                  
                  <div className="text-center mt-12">
                    <Link href="/courses">
                      <Button variant="outline" className="border-primary text-primary hover:bg-blue-50">
                        View All Courses
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Why Choose Alyusr</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">We provide a supportive environment for students to develop their Quranic knowledge and skills.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <FeatureCard 
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    iconBgColor={feature.iconBgColor}
                    iconColor={feature.iconColor}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">Student Testimonials</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Hear what our students have to say about their learning journey with Alyusr.</p>
              </div>
              
              {isLoadingTestimonials ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : testimonialsError ? (
                <div className="text-center text-red-500 py-10">
                  Error loading testimonials. Please try again later.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials?.map((testimonial) => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-primary text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Quranic Journey?</h2>
                <p className="text-lg mb-8">Join thousands of students worldwide who have enhanced their understanding of the Quran through our comprehensive programs.</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
                  <Link href="/courses">
                    <Button className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                      Explore Courses
                    </Button>
                  </Link>
                  <Link href="/apply">
                    <Button className="bg-accent text-white hover:bg-amber-600 w-full sm:w-auto">
                      Apply Now
                    </Button>
                  </Link>
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

export default HomePage;
