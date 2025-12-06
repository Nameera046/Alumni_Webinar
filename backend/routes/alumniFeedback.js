const express = require('express');
const router = express.Router();

// POST route to submit alumni feedback
router.post('/alumni-feedback', async (req, res) => {
  try {
    const { name, email, webinarTopic, arrangementsRating, studentParticipationRating, feedback } = req.body;

    // Validate required fields
    if (!name || !email || !webinarTopic || !arrangementsRating || !studentParticipationRating || !feedback) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get the AlumniFeedback model from app locals (webinar connection)
    const AlumniFeedback = req.app.locals.AlumniFeedback;

    // Create new feedback entry
    const newFeedback = new AlumniFeedback({
      name,
      email,
      webinarTopic,
      arrangementsRating,
      studentParticipationRating,
      feedback
    });

    // Save to database
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to retrieve all alumni feedback (optional, for admin purposes)
router.get('/feedbacks', async (req, res) => {
  try {
    const AlumniFeedback = req.app.locals.AlumniFeedback;
    const feedbacks = await AlumniFeedback.find({});
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;