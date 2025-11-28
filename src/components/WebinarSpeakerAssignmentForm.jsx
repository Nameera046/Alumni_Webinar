import React, { useState } from 'react';
import { Building2, Clock, Compass, Globe, Upload, Calendar, X ,User} from 'lucide-react';
import './Common.css'; // Make sure this imports your common CSS

export default function SpeakerAssignmentForm() {
  const [formData, setFormData] = useState({
    name: '', department: '', batch: '', designation: '', companyName: '', speakerPhoto: null, domain: ''
  });
  const [slots, setSlots] = useState([{ deadline: '', time: '' }]);

  const typeOptions = [
    { value: "fullstack_development", label: "Fullstack Development" },
    { value: "blockchain", label: "Blockchain" },
    { value: "artificial_intelligence", label: "Artificial Intelligence" },
    { value: "ui_ux", label: "UI & UX" }
  ];

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => setSlots([...slots, { deadline: '', time: '' }]);
  const removeSlot = index => setSlots(slots.filter((_, i) => i !== index));

  const handleSubmit = () => {
    if (!formData.name || !formData.department || !formData.batch || !formData.designation ||
        !formData.companyName || !formData.speakerPhoto || !formData.domain ||
        slots.some(s => !s.deadline || !s.time)) {
      alert("Please fill all required fields");
      return;
    }
    console.log("Form submitted:", formData);
    console.log("Assigned slots:", slots);
    alert("Speaker assigned successfully! 🎉");
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

          {/* Form Header */}
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
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />
                </div>

                <div className="form-group">
                  <label>
                    <Building2 className="field-icon" /> Department <span className="required">*</span>
                  </label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>
                    <Globe className="field-icon" /> Batch <span className="required">*</span>
                  </label>
                  <input type="text" name="batch" value={formData.batch} onChange={handleChange} className="input-field" />
                </div>

                <div className="form-group">
                  <label>
                    <Compass className="field-icon" /> Designation <span className="required">*</span>
                  </label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="input-field" />
                </div>
              </div>

              {/* Company + Photo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-group">
                  <label>
                    <Building2 className="field-icon" /> Company Name <span className="required">*</span>
                  </label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="input-field" />
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
                  <Globe className="field-icon" /> Select Webinar Topic <span className="required">*</span>
                </label>
                <select name="domain" value={formData.domain} onChange={handleChange} className="select-field">
                  <option value="" disabled>Select Topic</option>
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
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
                    <input type="date" value={slot.deadline} onChange={e => handleSlotChange(i, "deadline", e.target.value)} className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>
                      <Clock className="field-icon" /> Time <span className="required">*</span>
                    </label>
                    <input type="time" value={slot.time} onChange={e => handleSlotChange(i, "time", e.target.value)} className="input-field" />
                  </div>
                </div>
              ))}

              {/* Buttons */}
              <button type="button" onClick={addSlot} className="submit-btn">+ Add Another Slot</button>
              <button onClick={handleSubmit} className="submit-btn">Assign Speaker</button>

            </div>
          </div>

          <p className="form-footer">Designed with 💜 for Alumni Network</p>

        </div>
      </div>
    </div>
  );
}
