import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowLeft, Eye, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import stringSimilarity from 'string-similarity';
import Popup from './Popup';
import './Common.css';
import './WebinarDashboard.css';

export default function TopicApprovalForm() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApprovalPopupVisible, setIsApprovalPopupVisible] = useState(false);
  const [approvalPopupMessage, setApprovalPopupMessage] = useState('');

  // Function to group topics using fuzzy matching
  const groupTopics = (topics) => {
    let groups = [];
    topics.forEach(t => {
      let found = false;
      for (let g of groups) {
        if (stringSimilarity.compareTwoStrings(t, g[0]) > 0.6) {
          g.push(t);
          found = true;
          break;
        }
      }
      if (!found) groups.push([t]);
    });
    return groups;
  };

  // Fetch topic approvals on component mount
  useEffect(() => {
    fetchTopicApprovals();
  }, []);

  const fetchTopicApprovals = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/topic-approvals');
      const data = await response.json();
      setTopics(data.map(item => ({
        ...item,
        totalRequested: item.total_requested,
        status: item.approval
      })));
    } catch (error) {
      console.error('Error fetching topic approvals:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleApprove = async (index) => {
    const topic = topics[index];
    const newStatus = topic.status === "Approved" ? "On Hold" : "Approved";

    try {
      const response = await fetch(`http://localhost:5000/api/topic-approvals/${topic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approval: newStatus }),
      });

      if (response.ok) {
        const updatedTopics = [...topics];
        updatedTopics[index].status = newStatus;
        setTopics(updatedTopics);

        // Show approval popup
        setApprovalPopupMessage(`Topic "${topic.topic}" is now ${newStatus}.`);
        setIsApprovalPopupVisible(true);
      }
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  const handleView = async (topic) => {
    try {
      const response = await fetch(`http://localhost:5000/api/student-requests/${encodeURIComponent(topic.domain)}/${encodeURIComponent(topic.topic)}`);
      const students = await response.json();

      // Fetch member details for each student email
      const studentsWithDetails = await Promise.all(
        students.map(async (student, index) => {
          try {
            const memberResponse = await fetch(`http://localhost:5000/api/member-by-email?email=${encodeURIComponent(student.email)}`);
            const memberData = await memberResponse.json();

            return {
              serialNumber: index + 1,
              email: student.email,
              name: memberData.found ? memberData.name : 'N/A',
              department: memberData.found ? memberData.department : 'N/A',
              topic: student.topic,
              reason: student.reason
            };
          } catch (error) {
            console.error('Error fetching member details for email:', student.email, error);
            return {
              serialNumber: index + 1,
              email: student.email,
              name: 'N/A',
              department: 'N/A',
              topic: student.topic,
              reason: student.reason
            };
          }
        })
      );

      setSelectedTopic({
        ...topic,
        students: studentsWithDetails
      });
      setIsPopupOpen(true);
    } catch (error) {
      console.error('Error fetching student requests:', error);
    }
  };

  return (
    <div className="student-form-page">
      {/* Background Orbs */}
      <div className="background-orbs">
        <div className="orb orb-purple"></div>
        <div className="orb orb-blue animation-delay-2000"></div>
        <div className="orb orb-pink animation-delay-4000"></div>
      </div>

      <div className="form-wrapper">
        <div className="form-container">
          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft className="back-btn-icon" /> Back to Dashboard
          </button>

          <div className="form-header">
            <div className="icon-wrapper">
              <CheckCircle className="header-icon" />
            </div>
            <h1 className="form-title">Requested Topic Approval</h1>
          </div>



          {/* Table Header */}
          <div className="hidden md:grid md:grid-cols-6 gap-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold p-4 md:p-10 text-center">
            <div>DOMAIN</div>
            <div>TOPIC</div>
            <div>TOTAL REQUESTED</div>
            <div>STATUS</div>
            <div>ACTION</div>
            <div>DETAILS</div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold p-4 text-center">
            <h3 className="text-lg">Topic Approval Requests</h3>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200 py-4 md:py-8">
            {topics.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-6 gap-4 p-6 md:p-8 min-h-[110px] items-center hover:bg-purple-50 transition-colors border-b md:border-b-0"
              >
                {/* Mobile */}
                <div className="md:hidden space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-purple-800">{item.domain}</span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{item.topic}</div>
                  <div className="text-sm text-gray-600">
                    Total Requested: <span className="font-semibold">{item.totalRequested}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(index)}
                      disabled={item.status === "Approved"}
                      className={`flex-1 flex items-center justify-center gap-2 shadow-md
                        px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                        item.status === "Approved"
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white"
                      }`}
                    >
                      ✓ Approve
                    </button>

                    <button
                      onClick={() => handleView(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-500
                        hover:from-blue-700 hover:to-purple-600 text-white shadow-md
                        px-3 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>

                {/* Desktop */}
                <div className="hidden md:block text-gray-800 font-medium">{item.domain}</div>
                <div className="hidden md:block text-gray-700">{item.topic}</div>
                <div className="hidden md:block text-gray-800 font-semibold text-center">{item.totalRequested}</div>

                <div className="hidden md:flex justify-center items-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="hidden md:flex justify-center items-center">
                  <button
                    onClick={() => handleApprove(index)}
                    disabled={item.status === "Approved"}
                    className={`flex items-center justify-center gap-2 shadow-md
                      px-5 py-3 rounded-lg transition-colors font-medium min-w-[100px] h-[35px] ${
                      item.status === "Approved"
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white"
                    }`}
                  >
                    ✓ Approve
                  </button>
                </div>

                <div className="hidden md:flex justify-center items-center">
                  <button
                    onClick={() => handleView(item)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-500
                      hover:from-blue-700 hover:to-purple-600 text-white shadow-md
                      px-5 py-3 rounded-lg transition-colors font-medium min-w-[90px] h-[35px]"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Designed with 💜 for Alumni Network
        </div>
      </div>

      {/* Popup */}
      {isPopupOpen && selectedTopic && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Students Requested for "{selectedTopic.topic}"</h3>
            </div>

            <div className="modal-body">
              <div className="stats-grid">
                <div className="stat">
                  <div className="label">Domain</div>
                  <div className="value">{selectedTopic.domain}</div>
                </div>
                <div className="stat">
                  <div className="label">Total Requested</div>
                  <div className="value">{selectedTopic.totalRequested}</div>
                </div>
                <div className="stat">
                  <div className="label">Status</div>
                  <div className="value">{selectedTopic.status}</div>
                </div>
              </div>

              <h4 style={{ marginTop: '24px', marginBottom: '16px', color: '#5b21b6', fontWeight: '600', fontSize: '18px' }}>Student Details</h4>

              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-5 gap-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold p-4 text-center" style={{ borderRadius: '8px 8px 0 0' }}>
                <div>Serial Number</div>
                <div>Name</div>
                <div>Email</div>
                <div>Department</div>
                <div>Reason</div>
              </div>

              {/* Mobile Header */}
              <div className="md:hidden bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold p-4 text-center">
                <h5 className="text-sm">Student Details</h5>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200" style={{ backgroundColor: 'white', borderRadius: '0 0 8px 8px' }}>
                {selectedTopic.students.map((student, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 items-center hover:bg-purple-50 transition-colors"
                  >
                    {/* Mobile */}
                    <div className="md:hidden space-y-2">
                      <div className="font-semibold text-purple-800">#{student.serialNumber} - {student.name}</div>
                      <div className="text-sm text-gray-700">{student.email}</div>
                      <div className="text-sm text-gray-600">Department: {student.department}</div>
                      <div className="text-sm text-gray-600">Reason: {student.reason}</div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden md:block text-gray-800 font-medium text-center">{student.serialNumber}</div>
                    <div className="hidden md:block text-gray-700 text-center">{student.name}</div>
                    <div className="hidden md:block text-gray-700 text-center">{student.email}</div>
                    <div className="hidden md:block text-gray-700 text-center font-semibold">{student.department}</div>
                    <div className="hidden md:block text-gray-700 text-center">{student.reason}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-ghost" onClick={() => setIsPopupOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Popup */}
      {isApprovalPopupVisible && (
        <Popup
          message={approvalPopupMessage}
          type="success"
          onClose={() => setIsApprovalPopupVisible(false)}
        />
      )}
    </div>
  );
}
