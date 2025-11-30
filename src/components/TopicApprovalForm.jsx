import React, { useState } from 'react';
import { CheckCircle, ArrowLeft, Eye, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './Common.css';

export default function TopicApprovalForm() {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState([
    {
      domain: "AI / ML",
      topic: "AI in Medical Diagnosis",
      totalRequested: 12,
      status: "Approved",
      students: [
        { serialNumber: 1, email: "john.doe@example.com", name: "John Doe", department: "Computer Science", reason: "Research on AI applications in healthcare" },
        { serialNumber: 2, email: "jane.smith@example.com", name: "Jane Smith", department: "Information Technology", reason: "Project on medical imaging" },
        { serialNumber: 3, email: "bob.johnson@example.com", name: "Bob Johnson", department: "Data Science", reason: "Thesis on AI diagnostics" }
      ]
    },
    {
      domain: "Web Development",
      topic: "Responsive UI Frameworks",
      totalRequested: 8,
      status: "On Hold",
      students: [
        { serialNumber: 1, email: "alice.williams@example.com", name: "Alice Williams", department: "Computer Science", reason: "Building responsive web applications" },
        { serialNumber: 2, email: "charlie.brown@example.com", name: "Charlie Brown", department: "Software Engineering", reason: "Learning modern UI frameworks" }
      ]
    },
    {
      domain: "Cyber Security",
      topic: "Phishing Detection",
      totalRequested: 15,
      status: "On Hold",
      students: [
        { serialNumber: 1, email: "david.miller@example.com", name: "David Miller", department: "Cyber Security", reason: "Developing phishing detection tools" },
        { serialNumber: 2, email: "eve.davis@example.com", name: "Eve Davis", department: "Information Security", reason: "Research on email security" },
        { serialNumber: 3, email: "frank.wilson@example.com", name: "Frank Wilson", department: "Computer Science", reason: "Machine learning for phishing detection" }
      ]
    }
  ]);

  const handleApprove = (index) => {
    const updatedTopics = [...topics];
    updatedTopics[index].status =
      updatedTopics[index].status === "Approved" ? "On Hold" : "Approved";
    setTopics(updatedTopics);
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
          <div className="grid grid-cols-6 gap-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold p-10 text-center">
            <div>DOMAIN</div>
            <div>TOPIC</div>
            <div>TOTAL REQUESTED</div>
            <div>STATUS</div>
            <div>ACTION</div>
            <div>DETAILS</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200 py-8">
            {topics.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 h-15 px-6 items-center hover:bg-purple-50 transition-colors"
              >
                <div className="text-gray-800 font-medium">{item.domain}</div>
                <div className="text-gray-700">{item.topic}</div>
                <div className="text-gray-800 font-semibold text-center">{item.totalRequested}</div>

<div className="flex justify-center items-center w-full">                   <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

<div className="flex justify-center items-center w-full">                  
  <button
                    onClick={() => handleApprove(index)}
className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-500 
  hover:from-blue-700 hover:to-purple-600 text-white shadow-md 
  px-5 py-3 rounded-lg transition-colors font-medium min-w-[100px] h-[30px] text-center"                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                </div>

<div className="flex justify-center items-center w-full"><button
  onClick={() => {
    setSelectedTopic(item);
    setIsPopupOpen(true);
  }}
  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-500
  hover:from-blue-700 hover:to-purple-600 text-white shadow-md
  px-5 py-3 rounded-lg transition-colors font-medium min-w-[90px] h-[30px] text-center"
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

      {/* Popup Modal */}
      {isPopupOpen && selectedTopic && (
        <div className="fixed inset-0 bg-white/85 bg-opacity-30 flex items-center justify-center p-5 z-50">
          <div className="bg-gradient-to-br from-purple-50/70 via-pink-50/70 to-blue-50/70
                          rounded-2xl max-w-6xl w-full shadow-2xl relative overflow-hidden
                          max-h-[95vh] hide-scrollbar animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-purple-200/50 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-t-2xl">
              <h2 className="text-xl font-semibold">
                Students Requested for "{selectedTopic.topic}"
              </h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] hide-scrollbar">
              <div className="bg-white/50  p-4 shadow-inner">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-900 text center">
                      <th className="px-4 py-3 text-center font-semibold">S.No</th>
                      <th className="px-4 py-3 text-center font-semibold">Email</th>
                      <th className="px-4 py-3 text-center font-semibold">Name</th>
                      <th className="px-4 py-3 text-center font-semibold">Department</th>
                      <th className="px-4 py-3 text-center font-semibold">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTopic.students.map((student, index) => (
                      <tr key={index} className="hover:bg-purple-50/50 transition-colors border-b border-purple-100/50">
                        <td className="px-4 py-3 text-purple-800 font-medium">{student.serialNumber}</td>
                        <td className="px-4 py-3 text-gray-700">{student.email}</td>
                        <td className="px-4 py-3 text-gray-700 font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-gray-700">{student.department}</td>
                        <td className="px-4 py-3 text-gray-700">{student.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
