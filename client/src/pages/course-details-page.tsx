import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Course } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CourseDetailsPage = () => {
  // Get course ID from URL params
  const { id } = useParams<{ id: string }>();
  
  // Fetch course details
  const { 
    data: course, 
    isLoading, 
    error 
  } = useQuery<Course>({ 
    queryKey: [`/api/courses/${id}`] 
  });

  // Basic structure for course outline
  const courseOutline = [
    {
      title: "Week 1-2: Foundations of Tajweed",
      content: "Introduction to Tajweed, importance of proper recitation, overview of the course, and basic pronunciation practice."
    },
    {
      title: "Week 3-4: Makharij (Articulation Points)",
      content: "Detailed study of the articulation points of Arabic letters, with focused practice on each letter."
    },
    {
      title: "Week 5-6: Sifaat (Characteristics of Letters)",
      content: "Learning the essential and complementary characteristics of Arabic letters and their impact on recitation."
    },
    {
      title: "Week 7-8: Rules of Noon Saakin and Tanween",
      content: "Izhar, Idgham, Iqlaab, and Ikhfa rules with practical application in Quranic verses."
    },
    {
      title: "Week 9-10: Rules of Meem Saakin and Other Essential Rules",
      content: "Rules related to Meem Saakin, Laam Saakin, Qalqalah, and Madd (elongation)."
    },
    {
      title: "Week 11-12: Practical Application and Assessment",
      content: "Comprehensive practice with selected Surahs, recitation review, and final assessment."
    }
  ];

  // Placeholder reviews (in a real application, these would come from an API)
  const reviews = [
    {
      id: 1,
      name: "Ibrahim Ahmad",
      date: "3 weeks ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "The Tajweed course completely transformed my Quran recitation. Dr. Aminah is patient and knowledgeable, and the feedback is detailed and helpful. I was struggling with some of the rules before, but now I feel much more confident in my recitation."
    },
    {
      id: 2,
      name: "Zainab Ali",
      date: "1 month ago",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      rating: 5,
      content: "This course is well-structured and the online learning platform is very user-friendly. The weekly live sessions were incredibly helpful, and I appreciated being able to practice with other students. Dr. Aminah has a wonderful teaching style that makes complex rules easy to understand."
    },
    {
      id: 3,
      name: "Ahmad Hassan",
      date: "2 months ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      rating: 4,
      content: "I've taken several Tajweed courses before, but this one stands out for its attention to detail and practical approach. The course materials are excellent, and the recordings of each session are very helpful for review. I would have liked more one-on-one time with the instructor, but overall it's an excellent course."
    }
  ];

  // Generate rating stats from reviews
  const reviewStats = {
    average: 4.8,
    total: 45,
    distribution: [
      { rating: 5, percentage: 75 },
      { rating: 4, percentage: 20 },
      { rating: 3, percentage: 5 },
      { rating: 2, percentage: 0 },
      { rating: 1, percentage: 0 }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or there was an error loading it.</p>
            <Link href="/courses">
              <Button>Browse All Courses</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{course.title} - Alyusr Quran Institute</title>
        <meta name="description" content={`${course.description.substring(0, 150)}...`} />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex mb-5" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <Link href="/">
                      <a className="text-gray-700 hover:text-primary">Home</a>
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 text-sm">chevron_right</span>
                      <Link href="/courses">
                        <a className="ml-1 text-gray-700 hover:text-primary">Courses</a>
                      </Link>
                    </div>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <span className="material-icons text-gray-400 text-sm">chevron_right</span>
                      <span className="ml-1 text-gray-500">{course.title}</span>
                    </div>
                  </li>
                </ol>
              </nav>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Course Content */}
                <div className="lg:w-2/3">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="h-96 bg-gray-200 relative">
                      {course.image ? (
                        <img 
                          src={course.image} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="material-icons text-6xl text-gray-400">menu_book</span>
                        </div>
                      )}
                      {course.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-accent text-white px-3 py-1 rounded text-sm font-medium">Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                      <div className="flex items-center mb-6">
                        <div className="flex mr-4">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const rating = parseFloat(course.rating.toString());
                            if (star <= Math.floor(rating)) {
                              return <span key={star} className="material-icons text-accent">star</span>;
                            } else if (star === Math.ceil(rating) && !Number.isInteger(rating)) {
                              return <span key={star} className="material-icons text-accent">star_half</span>;
                            } else {
                              return <span key={star} className="material-icons text-gray-300">star</span>;
                            }
                          })}
                          <span className="ml-1 text-gray-600">{course.rating} ({course.reviewCount} reviews)</span>
                        </div>
                        {course.duration && (
                          <div className="flex items-center text-gray-600 mr-4">
                            <span className="material-icons text-sm mr-1">schedule</span>
                            {course.duration}
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <span className="material-icons text-sm mr-1">people</span>
                          {course.reviewCount * 2 + 45} Students
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-3">Course Description</h2>
                      <p className="text-gray-700 mb-6">{course.description}</p>
                      
                      <h2 className="text-xl font-semibold mb-3">What You'll Learn</h2>
                      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                        <li>Proper pronunciation of Arabic letters</li>
                        <li>Essential Tajweed rules for correct recitation</li>
                        <li>Recognition and application of recitation marks</li>
                        <li>Melodious recitation techniques</li>
                        <li>Common recitation mistakes and how to avoid them</li>
                        <li>Practical application with selected Surahs</li>
                      </ul>
                      
                      <h2 className="text-xl font-semibold mb-3">Course Outline</h2>
                      <div className="mb-6">
                        <Accordion type="single" collapsible className="w-full">
                          {courseOutline.map((week, index) => (
                            <AccordionItem key={index} value={`week-${index+1}`}>
                              <AccordionTrigger className="hover:no-underline bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100">
                                <h3 className="text-left font-medium">{week.title}</h3>
                              </AccordionTrigger>
                              <AccordionContent className="p-4 text-gray-700">
                                {week.content}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-3">Prerequisites</h2>
                      <p className="text-gray-700 mb-6">
                        Basic ability to read Arabic script. No prior knowledge of Tajweed rules is required.
                      </p>
                      
                      {course.instructorName && (
                        <>
                          <h2 className="text-xl font-semibold mb-3">Meet Your Instructor</h2>
                          <div className="flex items-center mb-6">
                            {course.instructorImage ? (
                              <img 
                                src={course.instructorImage} 
                                alt={course.instructorName} 
                                className="w-16 h-16 rounded-full mr-4"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                                <span className="material-icons text-gray-400 text-2xl">person</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">{course.instructorName}</h3>
                              <p className="text-gray-600">{course.instructorTitle}</p>
                              <p className="text-gray-700 mt-2">
                                {course.instructorTitle === "Tajweed Specialist" 
                                  ? "Has over 15 years of experience teaching Quran recitation with an Ijazah in Hafs from Asim."
                                  : course.instructorTitle === "Children's Educator"
                                  ? "Specializes in teaching children with a focus on making learning fun and engaging."
                                  : "An expert educator with extensive experience in Quranic studies."}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Reviews Section */}
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-8">
                      <h2 className="text-2xl font-semibold mb-6">Student Reviews</h2>
                      
                      <div className="flex flex-col md:flex-row mb-8">
                        <div className="md:w-1/3 mb-6 md:mb-0">
                          <div className="text-center">
                            <div className="text-5xl font-bold text-gray-800 mb-2">{reviewStats.average}</div>
                            <div className="flex justify-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => {
                                if (star <= Math.floor(reviewStats.average)) {
                                  return <span key={star} className="material-icons text-accent">star</span>;
                                } else if (star === Math.ceil(reviewStats.average) && !Number.isInteger(reviewStats.average)) {
                                  return <span key={star} className="material-icons text-accent">star_half</span>;
                                } else {
                                  return <span key={star} className="material-icons text-gray-300">star</span>;
                                }
                              })}
                            </div>
                            <p className="text-gray-600">Based on {reviewStats.total} reviews</p>
                          </div>
                        </div>
                        
                        <div className="md:w-2/3 md:pl-8">
                          <div className="space-y-2">
                            {reviewStats.distribution.map((item) => (
                              <div key={item.rating} className="flex items-center">
                                <span className="text-sm text-gray-600 w-10">{item.rating} star</span>
                                <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full">
                                  <Progress value={item.percentage} className="h-4" />
                                </div>
                                <span className="text-sm text-gray-600 w-10">{item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
                      
                      <div className="space-y-8">
                        {reviews.map((review, index) => (
                          <div key={review.id} className={index < reviews.length - 1 ? "border-b border-gray-200 pb-6" : ""}>
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                <img 
                                  src={review.avatar} 
                                  alt={review.name} 
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                  <h4 className="font-semibold">{review.name}</h4>
                                  <p className="text-gray-500 text-sm">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span 
                                    key={star} 
                                    className={`material-icons text-sm ${star <= review.rating ? 'text-accent' : 'text-gray-300'}`}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8">
                        <button className="text-primary font-medium">Read all reviews →</button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:w-1/3">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                    <div className="p-6">
                      <div className="text-3xl font-bold text-primary mb-4">${parseFloat(course.price.toString()).toFixed(2)}</div>
                      <div className="mb-6">
                        <ul className="space-y-3">
                          <li className="flex items-center">
                            <span className="material-icons text-secondary mr-2">check_circle</span>
                            <span>{course.duration} of instruction</span>
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-secondary mr-2">check_circle</span>
                            <span>Weekly live sessions</span>
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-secondary mr-2">check_circle</span>
                            <span>Personalized feedback</span>
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-secondary mr-2">check_circle</span>
                            <span>Course materials included</span>
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-secondary mr-2">check_circle</span>
                            <span>Certificate upon completion</span>
                          </li>
                          <li className="flex items-center">
                            <span className="material-icons text-secondary mr-2">check_circle</span>
                            <span>Lifetime access to recordings</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <Link href="/apply">
                          <Button className="w-full bg-primary text-white">Enroll Now</Button>
                        </Link>
                        <Button className="w-full bg-white border border-primary text-primary hover:bg-blue-50" variant="outline">
                          Add to Wishlist
                        </Button>
                      </div>
                      
                      <div className="mt-6 text-center text-gray-600 text-sm">
                        <p>30-day money-back guarantee</p>
                        <p className="mt-2">Financial aid available</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 p-6">
                      <h3 className="font-semibold mb-2">This course includes:</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 text-sm">videocam</span>
                          <span>24 on-demand video lessons</span>
                        </li>
                        <li className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 text-sm">groups</span>
                          <span>12 live group sessions</span>
                        </li>
                        <li className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 text-sm">description</span>
                          <span>Comprehensive course materials</span>
                        </li>
                        <li className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 text-sm">assignment</span>
                          <span>Practice exercises & assessments</span>
                        </li>
                        <li className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 text-sm">chat</span>
                          <span>Community forum access</span>
                        </li>
                        <li className="flex items-center">
                          <span className="material-icons text-gray-500 mr-2 text-sm">workspace_premium</span>
                          <span>Certificate of completion</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border-t border-gray-200 p-6">
                      <h3 className="font-semibold mb-4">Share this course:</h3>
                      <div className="flex space-x-4">
                        <a href="#" className="text-blue-600 hover:text-blue-800">
                          <span className="material-icons">facebook</span>
                        </a>
                        <a href="#" className="text-blue-400 hover:text-blue-600">
                          <span className="material-icons">twitter</span>
                        </a>
                        <a href="#" className="text-red-600 hover:text-red-800">
                          <span className="material-icons">email</span>
                        </a>
                        <a href="#" className="text-green-600 hover:text-green-800">
                          <span className="material-icons">whatsapp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CourseDetailsPage;
