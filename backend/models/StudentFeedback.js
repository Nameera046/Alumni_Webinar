const mongoose = require('mongoose');

// StudentFeedback schema for webinar database
const studentFeedbackSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to member in test db
  email: { type: String, required: true },
  name: { type: String, required: true },
  webinar: { type: String, required: true },
  speaker: { type: String, required: true },
  q1: { type: Number, required: true, min: 1, max: 5 }, // Rating 1-5
  q2: { type: Number, required: true, min: 1, max: 5 }, // Rating 1-5
  feedback: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = studentFeedbackSchema;
