const express = require('express');
const router = express.Router();

const memberSchema = require('../models/Member');
const studentFeedbackSchema = require('../models/StudentFeedback');

router.post('/submit-student-feedback', async (req, res) => {
  try {
    const { email, name, webinar, speaker, q1, q2, feedback } = req.body;
    if (!email || !name || !webinar || !speaker || !q1 || !q2 || !feedback) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const Member = req.app.locals.Member;
    const member = await Member.findOne({ "basic.email_id": email });
    if (!member) {
      return res.status(404).json({ error: 'Student not found with this email' });
    }
    const StudentFeedback = req.app.locals.StudentFeedback;
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
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
