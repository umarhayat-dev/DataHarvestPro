import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import CoursesPage from "@/pages/courses-page";
import CourseDetailsPage from "@/pages/course-details-page";
import CareerPage from "@/pages/career-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import ApplyPage from "@/pages/apply-page";

// Admin pages
import DashboardPage from "@/pages/admin/dashboard-page";
import AdminCoursesPage from "@/pages/admin/courses-page";
import ApplicationsPage from "@/pages/admin/applications-page";
import CareersPage from "@/pages/admin/careers-page";
import MessagesPage from "@/pages/admin/messages-page";
import TeamPage from "@/pages/admin/team-page";
import TestimonialsPage from "@/pages/admin/testimonials-page";
import SettingsPage from "@/pages/admin/settings-page";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/courses/:id" component={CourseDetailsPage} />
      <Route path="/career" component={CareerPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/apply" component={ApplyPage} />
      
      {/* Admin routes */}
      <Route path="/admin">
        <ProtectedRoute component={DashboardPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/courses">
        <ProtectedRoute component={AdminCoursesPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/applications">
        <ProtectedRoute component={ApplicationsPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/careers">
        <ProtectedRoute component={CareersPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/messages">
        <ProtectedRoute component={MessagesPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/team">
        <ProtectedRoute component={TeamPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/testimonials">
        <ProtectedRoute component={TestimonialsPage} requireAdmin={true} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={SettingsPage} requireAdmin={true} />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
