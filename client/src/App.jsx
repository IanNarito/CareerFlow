import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
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


function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;