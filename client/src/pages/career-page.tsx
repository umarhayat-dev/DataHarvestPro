import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import CareerApplicationForm from '@/components/forms/career-application-form';
import { Job } from '@shared/schema';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const CareerPage = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  // Fetch all active job listings
  const { 
    data: jobs, 
    isLoading, 
    error 
  } = useQuery<Job[]>({ 
    queryKey: ['/api/jobs'] 
  });

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplicationOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Careers - Alyusr Quran Institute</title>
        <meta name="description" content="Explore career opportunities at Alyusr Quran Institute. Join our team of dedicated educators and professionals committed to providing excellence in Quranic education." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">Join Our Team</h1>
                <p className="text-lg mb-8">
                  Explore career opportunities at Alyusr Quran Institute and help us make Quranic education accessible to students worldwide.
                </p>
              </div>
            </div>
          </section>

          {/* Why Work With Us Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
                <p className="text-gray-700">
                  At Alyusr Quran Institute, we're not just educators—we're a community dedicated to making a positive impact through Quranic education.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-primary text-2xl">lightbulb</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
                  <p className="text-gray-700">
                    Make a lasting impact by helping students develop a deeper connection with the Quran and Islamic teachings.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-secondary text-2xl">groups</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Supportive Community</h3>
                  <p className="text-gray-700">
                    Join a diverse team of dedicated professionals who are passionate about education and personal growth.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-accent text-2xl">trending_up</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Professional Growth</h3>
                  <p className="text-gray-700">
                    Benefit from ongoing training, mentorship, and opportunities to enhance your skills and advance your career.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Current Openings Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Current Openings</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-10">
                  Error loading job listings. Please try again later.
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <Card key={job.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl font-bold mb-1">{job.title}</CardTitle>
                            <CardDescription className="text-gray-600">
                              <div className="flex items-center">
                                <span className="material-icons text-gray-400 text-sm mr-1">location_on</span>
                                {job.location}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge className={job.type === "Full-time" ? "bg-primary" : "bg-secondary"}>
                            {job.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{job.description}</p>
                        
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <p className="text-gray-700 mb-4">{job.requirements}</p>
                        
                        <Button 
                          onClick={() => handleApply(job)}
                          className="bg-primary text-white mt-2"
                        >
                          Apply Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center bg-white rounded-lg shadow p-10">
                  <span className="material-icons text-gray-400 text-5xl mb-4">work_off</span>
                  <h3 className="text-xl font-semibold mb-2">No Current Openings</h3>
                  <p className="text-gray-600 mb-6">
                    We don't have any open positions at the moment, but we're always looking for talented individuals to join our team.
                  </p>
                  <p className="text-gray-600 mb-6">
                    Send your resume to <a href="mailto:careers@alyusrquran.com" className="text-primary hover:underline">careers@alyusrquran.com</a> and we'll keep your information on file for future opportunities.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Application Dialog */}
          <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <div className="py-4">
                <h2 className="text-2xl font-bold mb-6">Apply for: {selectedJob?.title}</h2>
                {selectedJob && (
                  <CareerApplicationForm jobId={selectedJob.id} onSuccess={() => setIsApplicationOpen(false)} />
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* CTA Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-primary text-white rounded-lg p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl font-bold mb-4">Don't See the Right Position?</h2>
                  <p className="text-lg mb-8">
                    We're always looking for talented individuals to join our team. Send your resume to us, and we'll contact you when a suitable position becomes available.
                  </p>
                  <a 
                    href="mailto:careers@alyusrquran.com" 
                    className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md text-base font-medium inline-block"
                  >
                    Send Your Resume
                  </a>
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

export default CareerPage;
