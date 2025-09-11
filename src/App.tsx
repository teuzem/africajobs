import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Layout } from './components/Layout/Layout'
import { AuthLayout } from './components/Layout/AuthLayout'
import { HomePage } from './pages/HomePage'
import { JobsPage } from './pages/JobsPage'
import { JobDetailPage } from './pages/JobDetailPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { ProfilePage } from './pages/profile/ProfilePage'
import { ApplicationsPage } from './pages/job-seeker/ApplicationsPage'
import { SavedJobsPage } from './pages/job-seeker/SavedJobsPage'
import { JobSeekerDashboardPage } from './pages/job-seeker/JobSeekerDashboardPage'
import { EmployerDashboardPage } from './pages/employer/EmployerDashboardPage'
import { JobEditorPage } from './pages/employer/JobEditorPage'
import { ApplicantsPage } from './pages/employer/ApplicantsPage'
import { ApplicantProfileView } from './pages/employer/ApplicantProfileView'
import { LoginPage } from './pages/auth/LoginPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { UpdatePasswordPage } from './pages/auth/UpdatePasswordPage'
import { CheckEmailPage } from './pages/auth/CheckEmailPage'
import { Spinner } from './components/ui/Spinner'
import { AboutPage } from './pages/static/AboutPage'
import { ContactPage } from './pages/static/ContactPage'
import { PrivacyPolicyPage } from './pages/static/PrivacyPolicyPage'
import { TermsPage } from './pages/static/TermsPage'
import { Toaster } from 'react-hot-toast'
import { CompaniesPage } from './pages/CompaniesPage'
import { CompanyDetailPage } from './pages/CompanyDetailPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  return <>{children}</>
}

function EmployerRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || profile?.user_type !== 'employer') {
    return <Navigate to="/job-seeker/dashboard" />
  }

  return <>{children}</>
}

function JobSeekerRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || profile?.user_type !== 'job_seeker') {
    return <Navigate to="/employer/dashboard" />
  }

  return <>{children}</>
}


function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/jobs" element={<Layout><JobsPage /></Layout>} />
      <Route path="/jobs/:id" element={<Layout><JobDetailPage /></Layout>} />
      <Route path="/companies" element={<Layout><CompaniesPage /></Layout>} />
      <Route path="/companies/:id" element={<Layout><CompanyDetailPage /></Layout>} />
      
      {/* --- Auth Routes --- */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Layout><AuthLayout><LoginPage /></AuthLayout></Layout>} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Layout><AuthLayout><SignUpPage /></AuthLayout></Layout>} />
      <Route path="/forgot-password" element={<Layout><AuthLayout><ForgotPasswordPage /></AuthLayout></Layout>} />
      <Route path="/update-password" element={<Layout><AuthLayout><UpdatePasswordPage /></AuthLayout></Layout>} />
      <Route path="/check-email" element={<Layout><CheckEmailPage /></Layout>} />

      {/* --- Static Pages --- */}
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/privacy" element={<Layout><PrivacyPolicyPage /></Layout>} />
      <Route path="/terms" element={<Layout><TermsPage /></Layout>} />

      {/* --- Protected Routes --- */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Navigate to={profile?.user_type === 'employer' ? '/employer/dashboard' : '/job-seeker/dashboard'} />
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/profile" 
        element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} 
      />

      {/* --- Job Seeker Routes --- */}
      <Route path="/job-seeker/dashboard" element={<JobSeekerRoute><Layout><JobSeekerDashboardPage /></Layout></JobSeekerRoute>} />
      <Route path="/recommendations" element={<JobSeekerRoute><Layout><RecommendationsPage /></Layout></JobSeekerRoute>} />
      <Route path="/applications" element={<JobSeekerRoute><Layout><ApplicationsPage /></Layout></JobSeekerRoute>} />
      <Route path="/saved-jobs" element={<JobSeekerRoute><Layout><SavedJobsPage /></Layout></JobSeekerRoute>} />

      {/* --- Employer Routes --- */}
      <Route path="/employer/dashboard" element={<EmployerRoute><Layout><EmployerDashboardPage /></Layout></EmployerRoute>} />
      <Route path="/employer/jobs/new" element={<EmployerRoute><Layout><JobEditorPage /></Layout></EmployerRoute>} />
      <Route path="/employer/jobs/:id/edit" element={<EmployerRoute><Layout><JobEditorPage /></Layout></EmployerRoute>} />
      <Route path="/employer/jobs/:id/applicants" element={<EmployerRoute><Layout><ApplicantsPage /></Layout></EmployerRoute>} />
      <Route path="/employer/applicants/:applicantId" element={<EmployerRoute><Layout><ApplicantProfileView /></Layout></EmployerRoute>} />

      {/* --- Catch all route --- */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="bottom-right" />
      </AuthProvider>
    </Router>
  )
}

export default App
