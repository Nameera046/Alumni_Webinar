const express = require('express');
const router = express.Router();

// Import models
const memberSchema = require('../models/Member');
const studentFeedbackSchema = require('../models/StudentFeedback');

// Get webinar database connection (assuming it's passed or created here)
// For now, we'll assume the webinarConnection is available globally or passed as parameter
// In a real app, you'd pass the connection or create it here

// POST endpoint to submit student feedback
router.post('/submit-student-feedback', async (req, res) => {
  try {
    const { email, name, webinar, speaker, q1, q2, feedback } = req.body;

    // Validate required fields
    if (!email || !name || !webinar || !speaker || !q1 || !q2 || !feedback) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Find member by email to get studentId
    const Member = req.app.locals.Member; // Assuming Member model is attached to app
    const member = await Member.findOne({ "basic.email_id": email });
    if (!member) {
      return res.status(404).json({ error: 'Student not found with this email' });
    }

    // Create new feedback document
    const StudentFeedback = req.app.locals.StudentFeedback; // Assuming StudentFeedback model is attached to app
    const newFeedback = new StudentFeedback({
      studentId: member._id,
      email,
      name,
      webinar,
      speaker,
      q1,
      q2,
      feedback
    });

    // Save to database
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve all student feedback
router.get('/student-feedback', async (req, res) => {
  try {
    const StudentFeedback = req.app.locals.StudentFeedback;
    const feedbacks = await StudentFeedback.find().sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve feedback by student email
router.get('/student-feedback/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const StudentFeedback = req.app.locals.StudentFeedback;
    const feedbacks = await StudentFeedback.find({ email }).sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve feedback by webinar
router.get('/student-feedback/webinar/:webinar', async (req, res) => {
  try {
    const { webinar } = req.params;
    const StudentFeedback = req.app.locals.StudentFeedback;
    const feedbacks = await StudentFeedback.find({ webinar }).sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
