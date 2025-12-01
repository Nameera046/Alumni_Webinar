import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Common.css';
import WebinarAlumniFeedbackForm from './WebinarAlumniFeedbackForm';
import { FiBookOpen, FiAward, FiUpload } from "react-icons/fi";
import WebinarStudentFeedbackForm from './WebinarStudentFeedbackForm';
import { GraduationCap, User, Mail,ArrowLeft } from "lucide-react";
import Popup from './Popup';

export default function WebinarEvents() {
  const navigate = useNavigate();
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showAlumniFeedback, setShowAlumniFeedback] = useState(false);
  const [showStudentRequest, setShowStudentRequest] = useState(false);
  const [showStudentFeedback, setShowStudentFeedback] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const webinars = {
    january: [
      {
        title: "AI in Healthcare",
        slot: "10 Jan 2025, 3:00 PM",
        registered: 45,
        domain: "Artificial Intelligence",
        speaker: {
          name: "[Alumni Name]",
          designation: "[Job Title]",
          passoutYear: "[Year]",
          department: "[Department]"
        }
      },
      {
        title: "Data Science Career Roadmap",
        slot: "15 Jan 2025, 5:00 PM",
        registered: 38,
        domain: "Data Science",
        speaker: {
          name: "[Alumni Name]",
          designation: "[Job Title]",
          passoutYear: "[Year]",
          department: "[Department]"
        }
      },
      {
        title: "Cybersecurity Trends 2025",
        slot: "20 Jan 2025, 4:00 PM",
        registered: 52,
        domain: "Cybersecurity",
        speaker: {
          name: "[Alumni Name]",
          designation: "[Job Title]",
          passoutYear: "[Year]",
          department: "[Department]"
        }
      }
    ],
    february: [
      {
        title: "Full Stack Development",
        slot: "05 Feb 2025, 2:00 PM",
        registered: 60,
        domain: "Web Development",
        speaker: {
          name: "[Alumni Name]",
          designation: "[Job Title]",
          passoutYear: "[Year]",
          department: "[Department]"
        }
      },
      {
        title: "Cloud Computing Basics",
        slot: "12 Feb 2025, 4:00 PM",
        registered: 50,
        domain: "Cloud Computing",
        speaker: {
          name: "[Alumni Name]",
          designation: "[Job Title]",
          passoutYear: "[Year]",
          department: "[Department]"
        }
      }
    ]
  };
  /** ------------------ Webinar Card ------------------ */
  const WebinarCard = ({ webinar }) => (
    <div className="form-card p-6 flex flex-col h-full webinar-card">
      <h3 className="text-xl font-bold text-purple-900 mb-4 webinar-card-title">{webinar.title}</h3>
      <div className="bg-purple-50 p-3 rounded-lg mb-4 webinar-card-slot">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Slot:</span> {webinar.slot}
        </p>
      </div>

      <p className="text-sm text-gray-700 mb-4 webinar-card-registered">
        Registered: <strong>{webinar.registered}</strong>
      </p>

      <button
        onClick={() => setSelectedWebinar(webinar)}
        className="submit-btn mt-auto webinar-card-btn"
      >
        See Details
      </button>
    </div>
  );

  /** ------------------ Webinar Detail Modal ------------------ */
   const WebinarDetail = ({ webinar, onClose }) => (
<div className="fixed inset-0 bg-white/85 bg-opacity-30 flex items-center justify-center p-5 z-50">

<div className="bg-gradient-to-br from-purple-50/70 via-pink-50/70 to-blue-50/70 
                rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-y-auto 
                max-h-[90vh] hide-scrollbar p-8">

                                  <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-purple-900 hover:text-purple-800 text-2xl font-bold"
          >
            X
          </button>
        </div>
        <div className="form-header">
          <div className="icon-wrapper">
            <FiBookOpen className="header-icon" />
          </div>
          <h1 className="form-title">Webinar Details</h1>
          <p className="webinar-subtitle">
            {webinar.title}
          </p>
        </div>

        <div className="form-card">
          <div className="form-fields">
            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="text"
                value={webinar.slot}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Domain</label>
              <input
                type="text"
                value={webinar.domain}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Registered Count</label>
              <input
                type="text"
                value={webinar.registered}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Webinar Poster</label>
              <div className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 flex items-center justify-center h-48 relative">
                <span className="text-purple-700 font-semibold">Webinar Poster</span>
                <span className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">#1</span>
              </div>
            </div>

            <div className="form-group">
              <label>Speaker Name</label>
              <input
                type="text"
                value={webinar.speaker.name}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                value={webinar.speaker.designation}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Passout Year</label>
              <input
                type="text"
                value={webinar.speaker.passoutYear}
                disabled
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={webinar.speaker.department}
                disabled
                className="input-field"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setPopup({ show: true, message: 'Registration successful! 🎉', type: 'success' });
                  onClose();
                }}
                className="submit-btn"
              >
                Register Now
              </button>
              <button
                onClick={() => navigate("/student-feedback")}
                className="submit-btn bg-purple-100 hover:bg-purple-200 text-purple-800"
              >
                Feedback Form
              </button>
            </div>
          </div>
        </div>

        <p className="form-footer">Designed with 💜 for Alumni Network</p>
      </div>
    </div>
  );

 
return (
    <div className="student-form-page">

      {/* Background Animated Orbs */}
      <div className="background-orbs">
        <div className="orb orb-purple animation-delay-2000"></div>
        <div className="orb orb-blue animation-delay-4000"></div>
        <div className="orb orb-pink"></div>
      </div>

      {/* Main Container */}
      <div className="form-wrapper">
        <div className="form-container">
            <button className="back-btn" onClick={() => navigate("/")}>
              <ArrowLeft className="back-btn-icon" /> Back to Dashboard
            </button>
          {/* Header */}
          <div className="form-header webinar-events-header">
            <div className="icon-wrapper">
                <FiBookOpen className="header-icon" />
            </div>
            <h1 className="form-title webinar-events-title">Webinar Events</h1>
            <button
              onClick={() => setShowStudentFeedback(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors webinar-feedback-btn"
            >
              CERTFICATES
            </button>
          </div>

          {/* January List */}
          <h2 className="text-2xl font-bold text-purple-900 mb-4 mt-4 webinar-section-title">January 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 webinar-grid">
            {webinars.january.map((wb, i) => (
              <WebinarCard key={i} webinar={wb} />
            ))}
          </div>

          {/* February List */}
          <h2 className="text-2xl font-bold text-purple-900 mb-4 mt-4 webinar-section-title">February 2025</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 webinar-grid">
            {webinars.february.map((wb, i) => (
              <WebinarCard key={i} webinar={wb} />
            ))}
          </div>
        </div>
      </div>

      {/* Webinar Detail Modal */}
      {selectedWebinar && (
        <WebinarDetail webinar={selectedWebinar} onClose={() => setSelectedWebinar(null)} />
      )}



      {/* Certificate Download Modal */}
      {showCertificates && (
        <CertificateDownload onClose={() => setShowCertificates(false)} />
      )}

      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
}
