import React, { useState } from "react";
import { GraduationCap, User, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Common.css";

export default function WebinarStudentFeedbackForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    webinar: "",
    speaker: "",
    q1: "",
    q2: "",
    feedback: "",
    isRobot: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.isRobot) {
      alert("Please verify that you are not a robot");
      return;
    }

    if (
      !formData.webinar ||
      !formData.speaker ||
      !formData.q1 ||
      !formData.q2 ||
      !formData.feedback
    ) {
      alert("Please fill all required fields");
      return;
    }

    console.log("Feedback submitted:", formData);
    alert("Feedback submitted successfully! 🎉");
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
            <h1 className="form-title">Student Feedback Form</h1>
            <p className="webinar-subtitle">
              Provide your feedback for the attended webinar
            </p>
          </div>

          <div className="form-card">
            <form className="form-fields" onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="form-group">
                <label>
                  <User className="field-icon" /> Name{" "}
                  <span className="required">*</span>
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
                  <Mail className="field-icon" /> Personal Email ID{" "}
                  <span className="required">*</span>
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

              {/* Webinar */}
              <div className="form-group">
                <label>
                  Select Webinar Attended <span className="required">*</span>
                </label>
                <select
                  className="select-field"
                  name="webinar"
                  value={formData.webinar}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Choose Webinar --
                  </option>
                  <option value="webinar1">Webinar 1</option>
                  <option value="webinar2">Webinar 2</option>
                </select>
              </div>

              {/* Speaker */}
              <div className="form-group">
                <label>
                  Select Speaker of the Webinar{" "}
                  <span className="required">*</span>
                </label>
                <select
                  className="select-field"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- Choose Speaker --
                  </option>
                  <option value="speaker1">Webinar Speakername 1</option>
                  <option value="speaker2">Webinar Speakername 2</option>
                </select>
              </div>

              {/* Question 1 */}
              <div className="form-group">
                <label>
                  1. How would you rate the quality and relevance of the webinar
                  content? <span className="required">*</span>
                </label>
                <div className="radio-group">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val}>
                      <input
                        type="radio"
                        name="q1"
                        value={val}
                        onChange={handleChange}
                      />{" "}
                      {val}
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="form-group">
                <label>
                  2. How would you rate the speaker's clarity and engagement?{" "}
                  <span className="required">*</span>
                </label>
                <div className="radio-group">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <label key={val}>
                      <input
                        type="radio"
                        name="q2"
                        value={val}
                        onChange={handleChange}
                      />{" "}
                      {val}
                    </label>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="form-group">
                <label>
                  3. Additional feedback or suggestions{" "}
                  <span className="required">*</span>
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  placeholder="Write your feedback here..."
                  className="textarea-field"
                  required
                ></textarea>
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

              {/* Button */}
              <button type="submit" className="submit-btn">
                Submit Feedback
              </button>
            </form>
          </div>

          <p className="form-footer">Designed with 💜 for Alumni Network</p>
        </div>
      </div>
    </div>
  );
}