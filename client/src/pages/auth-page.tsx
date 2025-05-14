import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isAuthenticated, loginMutation, registerMutation } = useAuth();
  const [location, navigate] = useLocation();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Submit login form
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };
  
  // Submit register form
  const onRegisterSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Login or Register - Alyusr Quran Institute</title>
        <meta name="description" content="Join Alyusr Quran Institute. Login to your account or register for a new account to access our comprehensive Quranic education programs." />
        <meta property="og:title" content="Login or Register - Alyusr Quran Institute" />
        <meta property="og:description" content="Join Alyusr Quran Institute. Access our comprehensive Quranic education programs." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-background py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row bg-card rounded-lg shadow-md overflow-hidden">
                <div className="lg:w-1/2 p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">Welcome to Alyusr Quran Institute</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account or create a new one</p>
                  </div>
                    
                    <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="login">
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full bg-primary" 
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                  Logging in...
                                </>
                              ) : (
                                "Login"
                              )}
                            </Button>
                          </form>
                        </Form>
                        
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-primary"
                              onClick={() => setActiveTab("register")}
                            >
                              Register now
                            </Button>
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="register">
                        <Form {...registerForm}>
                          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={registerForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={registerForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter your last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={registerForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Choose a username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="Enter your email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Create a password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm your password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <Button 
                              type="submit" 
                              className="w-full bg-primary" 
                              disabled={registerMutation.isPending}
                            >
                              {registerMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                  Registering...
                                </>
                              ) : (
                                "Register"
                              )}
                            </Button>
                          </form>
                        </Form>
                        
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-primary"
                              onClick={() => setActiveTab("login")}
                            >
                              Login
                            </Button>
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="lg:w-1/2 bg-primary text-primary-foreground p-8 flex flex-col justify-center">
                    <div className="max-w-md mx-auto">
                      <h2 className="text-3xl font-bold mb-4">Begin Your Quranic Journey</h2>
                      <p className="mb-6">Join Alyusr Quran Institute and gain access to comprehensive Quranic education with expert instructors and flexible learning options.</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-accent" />
                          <span>Expert instructors with ijazah certification</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-accent" />
                          <span>Flexible learning options - online and in-person</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-accent" />
                          <span>Comprehensive curriculum for all levels</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-accent" />
                          <span>Personalized feedback and guidance</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 mr-2 text-accent" />
                          <span>Join a global community of learners</span>
                        </div>
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
  );
};

export default AuthPage;
