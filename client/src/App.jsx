import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobList from './pages/jobs/JobList';
import Onboarding from './pages/auth/Onboarding';
import Dashboard from './pages/dashboard/Dashboard';
import HRDashboard from './pages/dashboard/HRDashboard';
import CreateJob from './pages/hr/CreateJob';
import VoiceBuilder from './pages/seeker/VoiceBuilder';
import JobDetails from './pages/jobs/JobDetails';
import ApplicantBoard from './pages/hr/ApplicantBoard';
import CandidateReview from './pages/hr/CandidateReview';
import ApplicationTracker from './pages/seeker/ApplicationTracker';
import JobPostings from './pages/hr/JobPostings';
import Interviews from './pages/hr/Interviews';
import CompanyProfile from './pages/hr/CompanyProfile';
import CompanyPublicPage from './pages/seeker/CompanyPublicPage';
import HRSettings from './pages/hr/Settings';
import MyApplications from './pages/seeker/MyApplications';
import SavedJobs from './pages/seeker/SavedJobs';
import Messages from './pages/seeker/Messages';
import SeekerSettings from './pages/seeker/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminJobs from './pages/admin/AdminJobs';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import Features from './pages/Features';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/hr/create-job" element={<CreateJob />} />
          <Route path="/voice-builder" element={<VoiceBuilder />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/hr/board" element={<ApplicantBoard />} />
          <Route path="/hr/candidate/:id" element={<CandidateReview />} />
          <Route path="/application/:id" element={<ApplicationTracker />} />
          <Route path="/hr/jobs" element={<JobPostings />} />
          <Route path="/hr/interviews" element={<Interviews />} />
          <Route path="/hr/profile" element={<CompanyProfile />} />
          <Route path="/company/:id" element={<CompanyPublicPage />} />
          <Route path="/hr/settings" element={<HRSettings />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/saved" element={<SavedJobs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/settings" element={<SeekerSettings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;