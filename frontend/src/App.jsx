import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WebinarDashboard from "./components/WebinarDashboard";
import WebinarAlumniFeedbackForm from "./components/WebinarAlumniFeedbackForm";
import WebinarCompletedDetailsForm from "./components/WebinarCompletedDetailsForm";
import StudentRequestForm from "./components/StudentRequestForm";
import WebinarSpeakerAssignmentForm from "./components/WebinarSpeakerAssignmentForm";
import WebinarStudentFeedbackForm from "./components/WebinarStudentFeedbackForm";
import TopicApprovalForm from './components/TopicApprovalForm';
import WebinarCircular from './components/WebinarCircular';
import WebinarCertificate from './components/WebinarCertificate';
import WebinarEvents from './components/WebinarEvents';
import OverallWebinarReport from './components/OverallWebinarReport';

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<WebinarDashboard />} />
        <Route path="/student-request" element={<StudentRequestForm />} />
        <Route path="/speaker-assignment" element={<WebinarSpeakerAssignmentForm />} />
        <Route path="/webinar-events" element={<WebinarEvents />} />
        <Route path="/webinar-details-upload/:id" element={<WebinarCompletedDetailsForm />} />
        <Route path="/alumni-feedback" element={<WebinarAlumniFeedbackForm />} />
        <Route path="/student-feedback" element={<WebinarStudentFeedbackForm />} />
        <Route path="/requested-topic-approval" element={<TopicApprovalForm />} />
        <Route path="/webinar-circular" element={<WebinarCircular />} />
        <Route path="/student-certificate/:webinarId" element={<WebinarCertificate />} />
      </Routes>
    </Router>
  );
}

export default App;
