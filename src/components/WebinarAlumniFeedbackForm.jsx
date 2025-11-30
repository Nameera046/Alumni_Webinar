import React, { useState } from "react";
import { User, Mail, GraduationCap, MessageSquare,ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import "./Common.css";

const WebinarAlumniFeedbackForm = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    webinar: "",
    rating1: "",
    rating2: "",
    feedback: "",
    isRobot: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.isRobot) {
      alert("Please verify that you are not a robot");
      return;
    }
    if (!formData.webinar) newErrors.webinar = 'Webinar selection is required';
    if (!formData.rating1) newErrors.rating1 = 'Rating for arrangements is required';
    if (!formData.rating2) newErrors.rating2 = 'Rating for student involvement is required';
    if (!formData.feedback) newErrors.feedback = 'Feedback is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Feedback submitted:", formData);
      alert("Feedback submitted successfully! 🎉");
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
              <GraduationCap className="header-icon" />
            </div>
            <h1 className="form-title">Webinar Alumni Feedback Form</h1>
            <p className="webinar-subtitle">
              Provide your feedback for the attended webinar
            </p>
          </div>

          <div className="form-card">
            <div className="form-fields">

              {/* Name */}
              <div className="form-group">
                <label>
                  <User className="field-icon" /> Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled
                  placeholder="Auto fetched from profile"
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label>
                  <Mail className="field-icon" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  placeholder="Auto fetched from profile"
                  className="input-field"
                />
              </div>

              {/* Webinar Select */}
              <div className="form-group">
                <label>Select Webinar Attended <span className="required">*</span></label>
                <select
                  name="webinar"
                  value={formData.webinar}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="" disabled>-- Choose Webinar --</option>
                  <option value="webinar1">Webinar 1</option>
                  <option value="webinar2">Webinar 2</option>
                </select>
                {errors.webinar && <div className="error-text">{errors.webinar}</div>}
              </div>

              {/* Rating 1 */}
              <div className="form-group">
                <label>1. How would you rate the arrangements of the webinar? <span className="required">*</span></label>
                <select
                  name="rating1"
                  value={formData.rating1}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="" disabled>-- Select --</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
                {errors.rating1 && <div className="error-text">{errors.rating1}</div>}
              </div>

              {/* Rating 2 */}
              <div className="form-group">
                <label>2. How would you rate the student involvement / participation? <span className="required">*</span></label>
                <select
                  name="rating2"
                  value={formData.rating2}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="" disabled>-- Select --</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
                {errors.rating2 && <div className="error-text">{errors.rating2}</div>}
              </div>

              {/* Feedback */}
              <div className="form-group">
                <label>
                  <MessageSquare className="field-icon" /> Share your overall experience / feedback <span className="required">*</span>
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Write your feedback here..."
                  rows="4"
                  className="textarea-field"
                ></textarea>
                {errors.feedback && <div className="error-text">{errors.feedback}</div>}
              </div>

              {/* Robot Check */}
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="isRobot"
                  checked={formData.isRobot}
                  onChange={handleChange}
                  className="checkbox-field"
                />
                <label className="checkbox-label">I'm not a robot</label>
              </div>

              <button onClick={handleSubmit} className="submit-btn">
                Submit Feedback
              </button>
            </div>
          </div>

          <p className="form-footer">Designed with 💜 for Alumni Network</p>
        </div>
      </div>
    </div>
  );
};

export default WebinarAlumniFeedbackForm;
