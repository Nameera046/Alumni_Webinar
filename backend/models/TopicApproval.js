const mongoose = require('mongoose');

const topicApprovalSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  total_requested: {
    type: Number,
    required: true
  },
  approval: {
    type: String,
    enum: ['Approved', 'On Hold', 'Rejected'],
    default: 'On Hold'
  }
}, { timestamps: true });

const TopicApproval = mongoose.models.TopicApproval || mongoose.model('TopicApproval', topicApprovalSchema);
module.exports = TopicApproval;
