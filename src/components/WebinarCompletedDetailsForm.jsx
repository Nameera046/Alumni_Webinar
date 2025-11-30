import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiHash, FiBookOpen, FiAward, FiUpload } from "react-icons/fi";
import { ArrowLeft  } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import "./Common.css";

const WebinarCompletedDetailsForm = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chosenTopic: "",
    attendanceFile: null,
    prizeWinnerEmail: "",
    name: "",
    rollNumber: "",
    department: "",
    batch: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attendanceFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.chosenTopic) newErrors.chosenTopic = 'Chosen Topic is required';
    if (!formData.attendanceFile) newErrors.attendanceFile = 'Attendance Excel Sheet is required';
    if (!formData.prizeWinnerEmail) newErrors.prizeWinnerEmail = 'Prize Winner Email is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Submitted:", formData);
      alert("Form submitted successfully! 🎉");
    }
  };

  return (
    <div className="student-form-page">
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
              <FiBookOpen className="header-icon" />
            </div>
            <h1 className="form-title">Webinar Completed Details Form</h1>
            <p className="webinar-subtitle">
              Document of the Completed Webinar are needed to be filled out here.
            </p>
          </div>
          <div className="form-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-fields">
                <div className="form-group">
                  <label><FiBookOpen className="field-icon" /> Chosen Topic <span>*</span></label>
                  <select
                    name="chosenTopic"
                    value={formData.chosenTopic}
                    onChange={handleInputChange}
                    required
                    className="select-field"
                  >
                    <option value="">Select a topic</option>
                    <option value="React Basics">React Basics</option>
                    <option value="Cloud Fundamentals">Cloud Fundamentals</option>
                    <option value="AI Workshop">AI Workshop</option>
                  </select>
                  {errors.chosenTopic && <div className="error-text">{errors.chosenTopic}</div>}
                </div>
                <div className="form-group">
                  <label><FiUpload className="field-icon" /> Upload Attendance Excel Sheet <span>*</span></label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="input-field"
                    required
                  />
                  {errors.attendanceFile && <div className="error-text">{errors.attendanceFile}</div>}
                </div>

                <div className="form-group">
                  <label><FiMail className="field-icon" /> Prize Winner Email <span>*</span></label>
                  <input
                    type="email"
                    name="prizeWinnerEmail"
                    placeholder="Enter email"
                    value={formData.prizeWinnerEmail}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {errors.prizeWinnerEmail && <div className="error-text">{errors.prizeWinnerEmail}</div>}
                </div>

                <div className="form-group">
                  <label><FiUser className="field-icon" /> Name</label>
                  <input type="text" value={formData.name} placeholder="fetched through login" readOnly className="input-field readonly" />
                </div>

                <div className="form-group">
                  <label><FiHash className="field-icon" /> Roll Number</label>
                  <input type="text" value={formData.rollNumber} placeholder="fetched through login" readOnly className="input-field readonly" />
                </div>

                <div className="form-group">
                  <label><FiBookOpen className="field-icon" /> Department</label>
                  <input type="text" value={formData.department} placeholder="fetched through login" readOnly className="input-field readonly" />
                </div>

                <div className="form-group">
                  <label><FiAward className="field-icon" /> Batch</label>
                  <input type="text" value={formData.batch} placeholder="fetched through login" readOnly className="input-field readonly" />
                </div>

                <div className="form-group">
                  <label><FiPhone className="field-icon" /> Mobile Number</label>
                  <input type="text" value={formData.mobileNumber} placeholder="fetched through login" readOnly className="input-field readonly" />
                </div>

                <button type="submit" className="submit-btn">Submit</button>
              </div>
            </form>
          </div>
          <p className="form-footer">Designed with 💜 for Alumni Network</p>
        </div>
      </div>
    </div>
  );
};

export default WebinarCompletedDetailsForm;