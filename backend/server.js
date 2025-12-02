const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Member schema
const memberSchema = new mongoose.Schema({
  basic: {
    name: String,
    email_id: String,
    alternate_email_id: String
  },
  contact_details: {
    mobile: String
  },
  education_details: Array    // <-- ensures array is stored
}, { strict: false });

const Member = mongoose.model('Member', memberSchema, 'members');

// API endpoint to get email suggestions
app.get('/api/emails', async (req, res) => {
  try {
    const members = await Member.find({}, 'basic.email_id');

    const emails = members
      .map(member => member.basic?.email_id)
      .filter(email => email);

    res.json(emails);
    console.log(emails);

  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get names
app.get('/api/names', async (req, res) => {
  try {
    const members = await Member.find({}, 'basic.name');
    const names = members.map(m => m.basic?.name).filter(Boolean);
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get mobile number suggestions
app.get('/api/mobiles', async (req, res) => {
  try {
    const members = await Member.find({}, 'contact_details.mobile');
    const mobiles = members.map(m => m.contact_details?.mobile).filter(Boolean);
    res.json(mobiles);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ------------------------------
// Department Extraction Logic
// ------------------------------

function extractDepartment(label) {
  if (!label) return "";
  const departments = ["CSE", "ECE", "MECH", "EEE", "CIVIL", "AIDS", "CE", "CS", "CS&E", "CSEH", "AEI", "IT"];

  const upperLabel = String(label).toUpperCase();

  for (const dept of departments) {
    try {
      const re = new RegExp("\\b" + dept.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "\\b", 'i');
      if (re.test(upperLabel)) return dept;
    } catch (e) {
      if (upperLabel.includes(dept)) return dept;
    }
  }

  if (upperLabel.includes('COMPUTER') && upperLabel.includes('ENGINEER')) return 'CSE';
  if (upperLabel.includes('ELECTRON') && upperLabel.includes('COMM')) return 'ECE';
  if (upperLabel.includes('MECHAN') || upperLabel.includes('MECH')) return 'MECH';

  return "";
}

function getDepartmentFromMember(member) {
  if (!member) return "";

  const candidates = [
    member.basic?.department,
    member.basic?.dept,
    member.basic?.label,
    member.basic?.course,
    member.department,
    member.dept,
    member.contact_details?.department,
    member.contact_details?.dept
  ];

  for (const c of candidates) {
    if (!c) continue;
    const dept = extractDepartment(c);
    if (dept) return dept;

    const str = String(c).trim();
    if (str.length > 0 && str.length <= 10) return str.toUpperCase();
  }

  try {
    const fullText = JSON.stringify(member).toUpperCase();
    const fallbackOrder = ["CSE", "ECE", "MECH", "EEE", "CIVIL", "AIDS", "CE", "CS", "IT"];

    for (const dept of fallbackOrder) {
      const re = new RegExp("\\b" + dept.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") + "\\b", 'i');
      if (re.test(fullText)) return dept;
    }

    if (/COMPUTER/.test(fullText) && /ENGINEER/.test(fullText)) return 'CSE';
    if (/ELECTRON/.test(fullText) && /COMM/.test(fullText)) return 'ECE';
    if (/MECHAN|MECH/.test(fullText)) return 'MECH';

  } catch (e) {}

  return "";
}

// API to get a member by email
app.get('/api/member-by-email', async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const member = await Member.findOne({ "basic.email_id": email });

    if (!member) {
      return res.json({ found: false });
    }

    console.log('DEBUG: member.basic.label =', member.basic?.label);
    console.log('DEBUG: member.basic =', member.basic);

    const department = getDepartmentFromMember(member);
    console.log('DEBUG: detected department =', department);

    // ------------------------------
    // ⭐ FETCH BATCH FROM education_details[0].end_year
    // ------------------------------
    const batch =
      member.basic?.batch ||
      member.education_details?.[0]?.end_year ||   // <--- main batch field
      "";

    const result = {
      found: true,
      name: member.basic?.name || "",
      contact_no:
        member.contact_details?.phone ||
        member.contact_details?.mobile ||
        member.contact_details?.mobile_no ||
        member.contact_details?.contact ||
        "",
      department: department || "",
      batch: batch
    };

    res.json(result);

  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Run Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});