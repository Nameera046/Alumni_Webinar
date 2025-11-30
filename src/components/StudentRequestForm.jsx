import React, { useState } from 'react';
import { User, Compass, Globe, Mail, Phone, GraduationCap, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
import './Common.css';

export default function StudentRequestForm() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    department: '',
    domain: '',
    topic: '',
    isRobot: false
  });
  const [errors, setErrors] = useState({});
  const typeOptions = [
    { value: "fullstack_development", label: "Fullstack Development" },
    { value: "blockchain", label: "Blockchain" },
    { value: "artificial_intelligence", label: "Artificial Intelligence" },
    { value: "ui_ux", label: "Ui & Ux " }
  ];
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };
  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.isRobot) {
      alert('Please verify that you are not a robot');
      return;
    }
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Personal Email ID is required';
    if (!formData.contact) newErrors.contact = 'Contact No is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.domain) newErrors.domain = 'Domain is required';
    if (!formData.topic) newErrors.topic = 'Topic is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! 🎉');
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
            <h1 className="form-title">Webinar Request Form</h1>
          </div>

          <div className="form-card">
            <div className="form-fields">
              <div className="form-group">
                <label>
                  <User className="field-icon" /> Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Auto fetched from profile"
                  className="input-field"
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>
                  <Mail className="field-icon" /> Personal Email ID <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Auto fetched from profile"
                  className="input-field"
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label>
                  <Phone className="field-icon" /> Contact No <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Auto fetched from profile"
                  className="input-field"
                />
                {errors.contact && <div className="error-text">{errors.contact}</div>}
              </div>
              <div className="form-group">
                <label>
                  <Compass className="field-icon" /> Department <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Auto fetched from profile"
                  className="input-field"
                />
                {errors.department && <div className="error-text">{errors.department}</div>}
              </div>
              <div className="form-group">
                <label>
                  <Globe className="field-icon" /> Domain <span className="required">*</span>
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="" disabled>Select Domain</option>
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.domain && <div className="error-text">{errors.domain}</div>}
              </div>
              <div className="form-group">
                <label>
                  <MessageSquare className="field-icon" /> Topic <span className="required">*</span>
                </label>
                <textarea
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="Add topic details"
                  rows="4"
                  className="textarea-field"
                ></textarea>
                {errors.topic && <div className="error-text">{errors.topic}</div>}
              </div>
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
                Submit
              </button>
            </div>
          </div>
          <p className="form-footer">
            Designed with 💜 for Alumni Network
          </p>
        </div>
      </div>
    </div>
  );
}
