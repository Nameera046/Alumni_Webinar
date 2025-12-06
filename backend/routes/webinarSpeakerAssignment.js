const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET route to get member by email
router.get('/member-by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const member = await req.app.locals.Member.findOne({ 'basic.email_id': email });
    if (!member) {
      return res.json({ found: false });
    }

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
        member.education_details?.[0]?.department,
        member.education_details?.[0]?.dept,
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

    const department = getDepartmentFromMember(member);

    // ------------------------------
    // ⭐ FETCH BATCH FROM education_details[0].batch or end_year
    // ------------------------------
    const batch =
      member.education_details?.[0]?.batch ||
      member.basic?.batch ||
      member.education_details?.[0]?.end_year ||
      "";

    res.json({
      found: true,
      name: member.basic?.name || "",
      department: department || "",
      batch: batch
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST route to assign speaker
router.post('/assign-speaker', upload.single('speakerPhoto'), async (req, res) => {
  try {
    const {
      email, designation, companyName, alumniCity, domain, topic,
      webinarVenue, meetingLink, slots
    } = req.body;

    console.log('Received data:', { email, designation, companyName, alumniCity, domain, topic, webinarVenue, meetingLink, slots });

    const speakerPhoto = req.file ? req.file.filename : null;
    console.log('Speaker photo:', speakerPhoto);

    // Parse slots
    let parsedSlots;
    try {
      parsedSlots = JSON.parse(slots);
      console.log('Parsed slots:', parsedSlots);
    } catch (error) {
      console.error('Error parsing slots:', error);
      return res.status(400).json({ error: 'Invalid slots data' });
    }

    // Validate required fields
    if (!email || !designation || !companyName || !alumniCity || !domain || !topic || !webinarVenue || !meetingLink || !speakerPhoto) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Get member details
    const member = await req.app.locals.Member.findOne({ 'basic.email_id': email });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    console.log('Found member:', member.basic?.name);

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
        member.education_details?.[0]?.department,
        member.education_details?.[0]?.dept,
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

    const name = member.basic?.name || "";
    const department = getDepartmentFromMember(member);

    // ------------------------------
    // ⭐ FETCH BATCH FROM education_details[0].batch or end_year
    // ------------------------------
    const batch =
      member.education_details?.[0]?.batch ||
      member.basic?.batch ||
      member.education_details?.[0]?.end_year ||
      "";

    console.log('Extracted data:', { name, department, batch });

    // Allow empty department and batch for now, but log warning
    if (!department) {
      console.warn('Department not found for member, proceeding with empty department');
    }
    if (!batch) {
      console.warn('Batch not found for member, proceeding with empty batch');
    }

    // Create speaker
    const speakerData = {
      email,
      name,
      department: department || '',
      batch: batch || '',
      designation,
      companyName,
      speakerPhoto,
      domain,
      topic,
      webinarVenue,
      alumniCity,
      meetingLink,
      slots: parsedSlots
    };

    console.log('Creating speaker with data:', speakerData);

    const newSpeaker = new req.app.locals.Speaker(speakerData);
    await newSpeaker.save();
    console.log('Speaker created successfully:', newSpeaker._id);

    // Create webinars for each slot
    const webinars = parsedSlots.map(slot => ({
      webinarDate: new Date(slot.webinarDate),
      deadline: new Date(slot.deadline),
      time: slot.time,
      speaker: newSpeaker._id,
      topic,
      domain,
      venue: webinarVenue,
      meetingLink,
      alumniCity
    }));

    console.log('Creating webinars:', webinars);
    await req.app.locals.Webinar.insertMany(webinars);
    console.log('Webinars created successfully');

    res.status(201).json({ message: 'Speaker assigned successfully' });
  } catch (error) {
    console.error('Error assigning speaker:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

module.exports = router;
