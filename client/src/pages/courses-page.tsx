import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import CourseCard from '@/components/course/course-card';
import { Course, Category } from '@shared/schema';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch all courses
  const { 
    data: courses, 
    isLoading: isLoadingCourses,
    error: coursesError
  } = useQuery<Course[]>({ 
    queryKey: ['/api/courses'] 
  });

  // Fetch categories
  const { 
    data: categories, 
    isLoading: isLoadingCategories
  } = useQuery<Category[]>({ 
    queryKey: ['/api/categories']
  });

  // Filter courses based on search query and selected category
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           (course.categoryId && course.categoryId.toString() === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Courses - Alyusr Quran Institute</title>
        <meta name="description" content="Explore our comprehensive Quran education courses. From recitation with Tajweed to Arabic language for Quran understanding, find the perfect course for your learning journey." />
        <meta property="og:title" content="Courses - Alyusr Quran Institute" />
        <meta property="og:description" content="Explore our comprehensive Quran education courses, from beginners to advanced levels." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Our Courses</h1>
              <p className="text-lg mb-8">
                Discover our comprehensive range of Quranic education programs designed for all ages and learning levels.
              </p>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="mb-10 bg-card p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Find Your Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="text"
                      className="pl-9"
                      placeholder="Search by course name or keywords"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {isLoadingCourses || isLoadingCategories ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : coursesError ? (
              <div className="text-center text-destructive py-10">
                Error loading courses. Please try again later.
              </div>
            ) : filteredCourses && filteredCourses.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary text-white rounded-lg p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Quranic Journey?</h2>
                <p className="text-lg mb-8">
                  Join thousands of students worldwide who have enhanced their understanding of the Quran through our comprehensive programs.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/apply"
                    className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md text-base font-medium inline-block"
                  >
                    Apply Now
                  </Link>
                  <Link 
                    href="/contact"
                    className="bg-accent text-white hover:bg-amber-600 px-6 py-3 rounded-md text-base font-medium inline-block"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CoursesPage;
