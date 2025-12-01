
import { Building2, Clock, Compass, Globe, Upload, Calendar, X ,User,ArrowLeft, MapPin} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Common.css';
import WebinarPoster from './WebinarPoster';
import Popup from './Popup';

export default function WebinarSpeakerAssignmentForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', department: '', batch: '', designation: '', companyName: '', speakerPhoto: null, domain: '', conductingDepartment: '', webinarVenue: 'NEC Auditorium, Kovilpatti', alumniCity: 'Chennai'
  });
  const [slots, setSlots] = useState([{ deadline: '2024-12-15', time: '10:00' }]);
  const [showPoster, setShowPoster] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (formData.speakerPhoto) {
      const url = URL.createObjectURL(formData.speakerPhoto);
      setPhotoURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.speakerPhoto]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const removeSlot = index => setSlots(slots.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!formData.name || !formData.department || !formData.batch || !formData.designation ||
        !formData.companyName || !formData.speakerPhoto || !formData.domain || !formData.conductingDepartment ||
        slots.some(s => !s.deadline || !s.time)) {
      setPopup({ show: true, message: 'Please fill all required fields', type: 'error' });
      return;
    }
    console.log("Form submitted:", formData);
    console.log("Assigned slots:", slots);
    setPopup({ show: true, message: 'Speaker assigned successfully! 🎉', type: 'success' });
  };

  const handleGeneratePoster = () => {
    if (!formData.name || !formData.department || !formData.batch || !formData.designation ||
        !formData.companyName || !formData.speakerPhoto || !formData.domain || !formData.conductingDepartment ||
        slots.some(s => !s.deadline || !s.time)) {
      alert("Please fill all required fields before generating the poster");
      return;
    }
    setShowPoster(!showPoster);
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
              <Building2 className="header-icon" />
            </div>
            <h1 className="form-title">Speaker Assignment Form</h1>
          </div>
          <div className="form-card">
            <div className="form-fields">
              <h2 className="section-heading">Speaker Details</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>
                    <User className="field-icon" /> Name <span className="required">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" className="input-field" />
                </div>

                <div className="form-group">
                  <label>
                    <Building2 className="field-icon" /> Department <span className="required">*</span>
                  </label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Enter department" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>
                    <Globe className="field-icon" /> Batch <span className="required">*</span>
                  </label>
                  <input type="text" name="batch" value={formData.batch} onChange={handleChange} placeholder="Enter batch" className="input-field" />
                </div>

                <div className="form-group">
                  <label>
                    <Compass className="field-icon" /> Designation <span className="required">*</span>
                  </label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Enter designation" className="input-field" />
                </div>
              </div>

              {/* Company + Photo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>
                    <Building2 className="field-icon" /> Company Name <span className="required">*</span>
                  </label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" className="input-field" />
                </div>

                <div className="form-group">
                  <label>
                    <Upload className="field-icon" /> Speaker Photo <span className="required">*</span>
                  </label>
                  <input type="file" name="speakerPhoto" id="speaker-photo-upload" accept="image/*" className="input-field hidden" onChange={handleChange} />
                  <label htmlFor="speaker-photo-upload" className="input-field cursor-pointer flex items-center gap-2">
                    <Upload className="field-icon" /> {formData.speakerPhoto ? formData.speakerPhoto.name : "Choose photo or drag here"}
                  </label>
                </div>
              </div>

              {/* Domain */}
              <div className="form-group">
                <label>
                  <Globe className="field-icon" /> Webinar Topic <span className="required">*</span>
                </label>
                <input type="text" name="domain" value={formData.domain} onChange={handleChange} placeholder="Enter webinar topic" className="input-field" />
              </div>

              {/* Conducting Department */}
              <div className="form-group">
                <label>
                  <Building2 className="field-icon" /> Department Conducting Webinars <span className="required">*</span>
                </label>
                <input type="text" name="conductingDepartment" value={formData.conductingDepartment} onChange={handleChange} placeholder="Select the department conducting webinars" className="input-field" />
              </div>

              {/* Webinar Venue and Alumni City */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>
                    <MapPin className="field-icon" /> Webinar Venue <span className="required">*</span>
                  </label>
                  <input type="text" name="webinarVenue" value={formData.webinarVenue} onChange={handleChange} placeholder="Enter venue" className="input-field" />
                </div>

                <div className="form-group">
                  <label>
                    <Globe className="field-icon" /> Alumni City <span className="required">*</span>
                  </label>
                  <input type="text" name="alumniCity" value={formData.alumniCity} onChange={handleChange} placeholder="Enter city" className="input-field" />
                </div>
              </div>

              {/* Assign Slot */}
              <h2 className="section-heading">Assign Slot</h2>
              {slots.map((slot, i) => (
                <div key={i} className="form-card relative grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <button type="button" onClick={() => removeSlot(i)} className="remove-slot absolute top-2 right-2">
                    <X className="field-icon" />
                  </button>
                  <div className="form-group">
                    <label>
                      <Calendar className="field-icon" /> Deadline <span className="required">*</span>
                    </label>
                    <input type="date" value={slot.deadline} onChange={e => handleSlotChange(i, "deadline", e.target.value)} placeholder="Select date" className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>
                      <Clock className="field-icon" /> Time <span className="required">*</span>
                    </label>
                    <input type="time" value={slot.time} onChange={e => handleSlotChange(i, "time", e.target.value)} placeholder="Select time" className="input-field" />
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <button onClick={handleSubmit} className="submit-btn">Assign Speaker</button>
              <button onClick={handleGeneratePoster} className="submit-btn">Generate Poster</button>

            </div>
          </div>

          <p className="form-footer">Designed with 💜 for Alumni Network</p>

          {showPoster && (
            <div className="mt-8 flex justify-center">
              <WebinarPoster
                alumniPhoto={photoURL}
                webinarTopic={formData.domain}
                webinarDate={slots[0]?.deadline || ''}
                webinarTime={slots[0]?.time || ''}
                webinarVenue={formData.webinarVenue}
                alumniName={formData.name}
                alumniDesignation={formData.designation}
                alumniCompany={formData.companyName}
                alumniCity={formData.alumniCity}
                alumniBatch={formData.batch}
                alumniDepartment={formData.department}
              />
            </div>
          )}

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
}
