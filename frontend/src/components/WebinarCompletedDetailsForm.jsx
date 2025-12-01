import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiAward,
  FiUpload
} from "react-icons/fi";
import { ArrowLeft,Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Common.css";
import Popup from './Popup';

const WebinarCompletedDetailsForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    chosenTopic: "",
    attendanceFile: null,
    prizeWinnerEmail: "",
    name: "",
    department: "",
    batch: "",
     contact: "",
  });

  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  // Fetch student details based on prizeWinnerEmail
  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!formData.prizeWinnerEmail || formData.prizeWinnerEmail.length < 5)
        return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/member-by-email?email=${formData.prizeWinnerEmail}`
        );
        const data = await res.json();

        console.log("Fetched member:", data);

        if (data?.found) {
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            department: data.department || "",
            batch: data.batch || "",
            contact: data.contact_no || "",
          }));
        } else {
          console.log("No member found for entered email");
        }
      } catch (err) {
        console.error("Error fetching member:", err);
      }
    };

    fetchMemberDetails();
  }, [formData.prizeWinnerEmail]);

  // Handle input fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, attendanceFile: e.target.files[0] });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.chosenTopic)
      newErrors.chosenTopic = "Chosen Topic is required";
    if (!formData.attendanceFile)
      newErrors.attendanceFile = "Attendance Excel Sheet is required";
    if (!formData.prizeWinnerEmail)
      newErrors.prizeWinnerEmail = "Prize Winner Email is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitted:", formData);
      setPopup({ show: true, message: 'Form submitted successfully! 🎉', type: 'success' });

      // Reset form data after successful submission
      setFormData({
        chosenTopic: "",
        attendanceFile: null,
        prizeWinnerEmail: "",
        name: "",
        department: "",
        batch: "",
        contact: "",
      });
      setErrors({});
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
              Document of the Completed Webinar are needed to be filled out
              here.
            </p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-fields">

                {/* Topic */}
                <div className="form-group">
                  <label>
                    <FiBookOpen className="field-icon" /> Chosen Topic{" "}
                    <span>*</span>
                  </label>
                  <select
                    name="chosenTopic"
                    value={formData.chosenTopic}
                    onChange={handleInputChange}
                    className="select-field"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="React Basics">React Basics</option>
                    <option value="Cloud Fundamentals">
                      Cloud Fundamentals
                    </option>
                    <option value="AI Workshop">AI Workshop</option>
                  </select>
                  {errors.chosenTopic && (
                    <div className="error-text">{errors.chosenTopic}</div>
                  )}
                </div>

                {/* Upload File */}
                <div className="form-group">
                  <label>
                    <FiUpload className="field-icon" /> Upload Attendance Excel
                    Sheet <span>*</span>
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="input-field"
                    required
                  />
                  {errors.attendanceFile && (
                    <div className="error-text">{errors.attendanceFile}</div>
                  )}
                </div>

                {/* Prize Winner Email */}
                <div className="form-group">
                  <label>
                    <FiMail className="field-icon" /> Prize Winner Email{" "}
                    <span>*</span>
                  </label>
                  <input
                    type="email"
                    name="prizeWinnerEmail"
                    placeholder="Enter email"
                    value={formData.prizeWinnerEmail}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                  {errors.prizeWinnerEmail && (
                    <div className="error-text">
                      {errors.prizeWinnerEmail}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="form-group">
                  <label>
                    <FiUser className="field-icon" /> Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    readOnly
                    placeholder="Fetched automatically"
                    className="input-field readonly"
                  />
                </div>

                {/* Department */}
                <div className="form-group">
                  <label>
                    <FiBookOpen className="field-icon" /> Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    readOnly
                    placeholder="Fetched automatically"
                    className="input-field readonly"
                  />
                </div>

                {/* Batch */}
                <div className="form-group">
                  <label>
                    <FiAward className="field-icon" /> Batch
                  </label>
                  <input
                    type="text"
                    value={formData.batch}
                    readOnly
                    placeholder="Fetched automatically"
                    className="input-field readonly"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Phone className="field-icon" /> Contact No <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="Auto fetched from email..."
                    className="input-field"
                    readOnly
                  />
                  {errors.contact && (
                    <div className="error-text">{errors.contact}</div>
                  )}
                </div>


                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>

          <p className="form-footer">Designed with 💜 for Alumni Network</p>
        </div>
      </div>

      {popup.show && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
};

export default WebinarCompletedDetailsForm;
