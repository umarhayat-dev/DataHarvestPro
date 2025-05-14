import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { TeamMember } from '@shared/schema';
import { Loader2 } from 'lucide-react';

const AboutPage = () => {
  // Fetch team members
  const { 
    data: teamMembers, 
    isLoading, 
    error 
  } = useQuery<TeamMember[]>({ 
    queryKey: ['/api/team'] 
  });

  return (
    <>
      <Helmet>
        <title>About Us - Alyusr Quran Institute</title>
        <meta name="description" content="Learn about Alyusr Quran Institute's mission, vision, and our dedicated team of instructors committed to providing excellence in Quranic education." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Alyusr Quran Institute</h1>
                <p className="text-lg mb-8">
                  Dedicated to providing excellence in Quranic education for students of all ages and backgrounds.
                </p>
              </div>
            </div>
          </section>

          {/* Mission & Vision Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-gray-700 mb-4">
                    Alyusr Quran Institute is committed to providing accessible, high-quality Quranic education to learners worldwide. We strive to help students develop a deep, meaningful connection with the Quran through proper recitation, understanding of its meanings, and implementation of its teachings in daily life.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Our mission extends beyond teaching the technical aspects of Quranic recitation. We aim to nurture a love for the Quran in our students' hearts and guide them toward embodying its values and principles.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                  <p className="text-gray-700 mb-4">
                    We envision a global community where the Quran is accessible to everyone, regardless of age, background, or location. We strive to be the leading institute for Quranic education, known for our comprehensive curriculum, qualified instructors, and student-centered approach.
                  </p>
                  <p className="text-gray-700 mb-4">
                    By bridging traditional teaching methods with modern technology, we aim to make Quranic learning engaging, effective, and adaptable to the diverse needs of our global student body.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Alyusr Quran Institute was founded in 2010 by a group of dedicated Quran scholars who recognized the need for accessible, structured Quranic education in the digital age. What began as a small local initiative has grown into a global educational platform serving thousands of students across different countries and time zones.
                </p>
                <p className="text-gray-700 mb-4">
                  The name "Alyusr" comes from the Arabic word for "ease," reflecting our commitment to making Quranic learning accessible and manageable for students of all backgrounds and abilities. This aligns with the Quranic principle: "Allah intends for you ease and does not intend for you hardship" (Quran 2:185).
                </p>
                <p className="text-gray-700 mb-4">
                  Over the years, we have continuously refined our teaching methods and expanded our course offerings to meet the evolving needs of our students. Today, we offer a comprehensive range of programs from basic Quran recitation to advanced studies in Tajweed, Quranic Arabic, and Tafsir (interpretation).
                </p>
              </div>
            </div>
          </section>

          {/* Our Approach Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Educational Approach</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-primary text-2xl">auto_stories</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Structured Learning</h3>
                  <p className="text-gray-700">
                    Our curriculum is carefully designed to provide a clear progression path, with each level building upon the knowledge and skills gained in previous stages.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-secondary text-2xl">people</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Interactive Learning</h3>
                  <p className="text-gray-700">
                    We emphasize engagement through interactive sessions, regular feedback, and practical application to ensure concepts are truly internalized.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-accent text-2xl">psychology</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalized Attention</h3>
                  <p className="text-gray-700">
                    We recognize that each student has unique needs, learning styles, and goals. Our approach allows for personalization within a structured framework.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-10">
                  Error loading team members. Please try again later.
                </div>
              ) : teamMembers && teamMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-64 bg-gray-200">
                        {member.imageUrl ? (
                          <img 
                            src={member.imageUrl} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="material-icons text-4xl text-gray-400">person</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-gray-600 mb-4">{member.role}</p>
                        <p className="text-gray-700">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10">
                  No team members to display.
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

export default AboutPage;
