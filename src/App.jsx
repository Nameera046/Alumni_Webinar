
import React, { useState } from 'react';
import { Briefcase, Building2, MessageSquare, ClipboardCheck, CheckCircle } from 'lucide-react';
import WebinarAlumniFeedbackForm from './components/WebinarAlumniFeedbackForm';
import WebinarCompletedDetailsForm from './components/WebinarCompletedDetailsForm';
import StudentRequestForm from './components/StudentRequestForm';
import WebinarSpeakerAssignmentForm from './components/WebinarSpeakerAssignmentForm';
import WebinarStudentFeedbackForm from './components/WebinarStudentFeedbackForm';


function App() {
  const [activeTab, setActiveTab] = useState('webinar-completed');

  const tabs = [
    { id: 'webinar-Alumni-Request', name: 'Alumni Webinar Feedback', icon: CheckCircle },
    { id: 'webinar-Student-request', name: 'Student Webinar Request', icon: CheckCircle },
    { id: 'webinar-Speaker-Assignment', name: 'Webinar Speaker Assignment', icon: CheckCircle },
    { id: 'webinar-Student-Feedback', name: 'Student Webinar Feedback', icon: CheckCircle },
    { id: 'webinar-completed', name: 'Webinar Completed Details', icon: CheckCircle }
  ];

  const renderForm = () => {
    switch (activeTab) {
      case 'webinar-Alumni-Request':
        return <WebinarAlumniFeedbackForm />;
      case 'webinar-Student-request':
        return <StudentRequestForm/>;
      case 'webinar-Speaker-Assignment':
        return <WebinarSpeakerAssignmentForm />;
      case 'webinar-Student-Feedback':
        return <WebinarStudentFeedbackForm />;
      case 'webinar-completed':
        return <WebinarCompletedDetailsForm />;
      default:
        return <WebinarAlumniFeedbackForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-violet-50">
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-8 font-semibold text-lg whitespace-nowrap transition-all duration-300 border-b-4 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                      : 'border-transparent text-gray-600 hover:text-purple-600 hover:bg-purple-50/30'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="transition-all duration-300">
        {renderForm()}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default App;