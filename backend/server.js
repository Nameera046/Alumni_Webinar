const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import models/schemas
const MemberSchema = require('./models/Member');
const StudentFeedback = require('./models/StudentFeedback');
const StudentRequestForm = require('./models/StudentRequestForm');
const TopicApproval = require('./models/TopicApproval');
const Speaker = require('./models/Speaker');
const Webinar = require('./models/Webinar');
const RegisterSchema = require('./models/Register');
const AlumniFeedback = require('./models/AlumniFeedback');

// Import routes
const studentFeedbackRoutes = require('./routes/studentFeedback');
const studentRequestFormRoutes = require('./routes/studentRequestForm');
const topicApprovalRoutes = require('./routes/topicApproval');
const webinarSpeakerAssignmentRoutes = require('./routes/webinarSpeakerAssignment');
const registerRoutes = require('./routes/register');
const alumniFeedbackRoutes = require('./routes/alumniFeedback');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection for 'test' database
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected to test database'))
  .catch(err => console.error('MongoDB connection error:', err));

// Second connection for 'webinar' database
const webinarConnection = mongoose.createConnection(mongoURI.replace('/test?', '/webinar?'));
webinarConnection.on('connected', () => console.log('Connected to webinar database'));
webinarConnection.on('error', (err) => console.error('Webinar DB connection error:', err));

// Create models for main connection (test database)
const Member = mongoose.model('Member', MemberSchema, 'members');

// Create models for webinar connection
const WebinarStudentFeedback = webinarConnection.model('StudentFeedback', StudentFeedback.schema, 'studentfeedback');
const WebinarStudentRequestForm = webinarConnection.model('StudentRequestForm', StudentRequestForm.schema, 'StudentRequestForm');
const WebinarTopicApproval = webinarConnection.model('TopicApproval', TopicApproval.schema, 'TopicApproval');
const WebinarSpeaker = webinarConnection.model('Speaker', Speaker.schema, 'speakers');
const WebinarWebinar = webinarConnection.model('Webinar', Webinar.schema, 'webinars');
const WebinarRegister = webinarConnection.model('Register', RegisterSchema, 'register');
const WebinarAlumniFeedback = webinarConnection.model('AlumniFeedback', AlumniFeedback.schema, 'AlumniFeedback');

// Attach models to app locals for use in routes
app.locals.Member = Member;
app.locals.StudentFeedback = WebinarStudentFeedback;
app.locals.StudentRequestForm = WebinarStudentRequestForm;
app.locals.TopicApproval = WebinarTopicApproval;
app.locals.Speaker = WebinarSpeaker;
app.locals.Webinar = WebinarWebinar;
app.locals.Register = WebinarRegister;
app.locals.AlumniFeedback = WebinarAlumniFeedback;

// Use routes
app.use('/api', studentFeedbackRoutes);
app.use('/api', studentRequestFormRoutes);
app.use('/api', topicApprovalRoutes);
app.use('/api', webinarSpeakerAssignmentRoutes);
app.use('/api', registerRoutes);
app.use('/api', alumniFeedbackRoutes);

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

// Get names with email
app.get('/api/names', async (req, res) => {
  try {
    const members = await Member.find({}, 'basic.name basic.email_id');
    const memberData = members.map(m => ({
      name: m.basic?.name,
      email: m.basic?.email_id
    })).filter(m => m.name && m.email);
    res.json(memberData);
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

// Get member details by email for auto-fill
app.get('/api/member-by-email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const member = await Member.findOne({ 'basic.email_id': email });
    if (!member) {
      return res.json({ found: false });
    }
    // Extract department using the existing logic
    const department = getDepartmentFromMember(member);
    // Extract batch from member data
    const batch = member.basic?.batch || member.batch || '';
    // Extract contact number from multiple possible paths
    const contact_no = member.contact_details?.mobile ||
                      member.contact_details?.phone ||
                      member.mobile ||
                      member.phone ||
                      member.contact ||
                      '';
    res.json({
      found: true,
      name: member.basic?.name || '',
      contact_no: contact_no,
      department: department || '',
      batch: batch
    });
  } catch (error) {
    console.error('Error fetching member by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all webinars with populated speaker data and registration count
app.get('/api/webinars', async (req, res) => {
  try {
    const webinars = await WebinarWebinar.find()
      .populate('speaker', 'name designation department batch companyName speakerPhoto email')
      .sort({ webinarDate: 1 });
    // Add registration count for each webinar
    const webinarsWithCount = await Promise.all(
      webinars.map(async (webinar) => {
        const registrationCount = await WebinarRegister.countDocuments({ webinarId: webinar._id });
        return {
          ...webinar.toObject(),
          registeredCount: registrationCount
        };
      })
    );
    res.json(webinarsWithCount);
  } catch (error) {
    console.error('Error fetching webinars:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single webinar by ID
app.get('/api/webinars/:id', async (req, res) => {
  try {
    const webinar = await WebinarWebinar.findById(req.params.id)
      .populate('speaker', 'name designation department batch companyName');
    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }
    res.json(webinar);
  } catch (error) {
    console.error('Error fetching webinar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update webinar with completion details
app.put('/api/webinars/:id/complete', async (req, res) => {
  try {
    const { attendedCount, prizeWinnerEmail, attendanceData } = req.body;
    const webinar = await WebinarWebinar.findByIdAndUpdate(
      req.params.id,
      { attendedCount, prizeWinnerEmail },
      { new: true }
    );
    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }
    // Update attended status in register collection based on attendance data
    if (attendanceData && Array.isArray(attendanceData)) {
      for (const attendee of attendanceData) {
        if (attendee.Email && attendee.Duration !== undefined) {
          // Parse duration
          let durationMinutes = 0;
          if (typeof attendee.Duration === 'number') {
            durationMinutes = attendee.Duration;
          } else if (typeof attendee.Duration === 'string') {
            // Handle "HH:MM" format
            const timeMatch = attendee.Duration.match(/(\d+):(\d+)/);
            if (timeMatch) {
              durationMinutes = parseInt(timeMatch[1]) * 60 + parseInt(timeMatch[2]);
            } else {
              durationMinutes = parseFloat(attendee.Duration) || 0;
            }
          }
          const attendedStatus = durationMinutes > 30 ? 'yes' : 'no';
          // Update the register record
          await WebinarRegister.findOneAndUpdate(
            { email: attendee.Email, webinarId: req.params.id },
            { attendedStatus },
            { upsert: false } // Don't create new records, only update existing
          );
        }
      }
    }
    res.json(webinar);
  } catch (error) {
    console.error('Error updating webinar:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check certificate eligibility
app.get('/api/check-certificate-eligibility', async (req, res) => {
  try {
    const { email, webinarId } = req.query;
    if (!email || !webinarId) {
      return res.status(400).json({ error: 'Email and webinarId are required' });
    }
    // Check if user has attendedStatus = "yes" in register collection
    const registration = await WebinarRegister.findOne({
      email: email,
      webinarId: webinarId,
      attendedStatus: 'yes'
    });
    res.json({ eligible: !!registration });
  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Download certificate
app.post('/api/download-certificate', async (req, res) => {
  try {
    const { email, webinarId } = req.body;
    if (!email || !webinarId) {
      return res.status(400).json({ error: 'Email and webinarId are required' });
    }
    // Check if user is eligible for certificate
    const registration = await WebinarRegister.findOne({
      email: email,
      webinarId: webinarId,
      attendedStatus: 'yes'
    });
    if (!registration) {
      return res.status(403).json({ error: 'You are not eligible for this certificate' });
    }
    // Get webinar details
    const webinar = await WebinarWebinar.findById(webinarId).populate('speaker', 'name designation');
    if (!webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }
    // Get user name from Member collection
    const member = await app.locals.Member.findOne({ 'basic.email_id': email });
    const userName = member?.basic?.name || email; // Fallback to email if name not found
    // Generate PDF certificate
    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${webinar.topic.replace(/\s+/g, '_')}.pdf"`);
    // Pipe the PDF to the response
    doc.pipe(res);
    // Add background image
    const backgroundPath = path.resolve(process.cwd(), 'frontend/src/assets/webinarcertificategreen.jpg');
    console.log('Background image path:', backgroundPath);
    try {
      doc.image(backgroundPath, 0, 0, {
        width: doc.page.width,
        height: doc.page.height
      });
      console.log('Background image added successfully');
    } catch (error) {
      console.warn('Background image not found, proceeding without background:', error.message);
    }
    // Certificate content
    doc.fontSize(30).text('Certificate of Participation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('This is to certify that', { align: 'center' });
    doc.moveDown();
    doc.fontSize(24).text(userName, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`has successfully participated in the webinar "${webinar.topic}"`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`conducted on ${new Date(webinar.webinarDate).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Speaker: ${webinar.speaker?.name || 'TBD'}`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(14).text('NEC Alumni Network', { align: 'center' });
    // Add signatures
    const alumniPresidentSignaturePath = path.join(process.cwd(), 'frontend/src/assets/Alumni-President-removebg-preview.png');
    const principalSignaturePath = path.join(process.cwd(), 'frontend/src/assets/principal-removebg-preview.png');
    console.log('Alumni President signature path:', alumniPresidentSignaturePath);
    console.log('Principal signature path:', principalSignaturePath);
    // Alumni President signature (left side)
    try {
      doc.image(alumniPresidentSignaturePath, 150, doc.page.height - 150, {
        width: 100,
        height: 60
      });
      doc.fontSize(12).text('Alumni President', 150, doc.page.height - 80, { align: 'center', width: 100 });
      console.log('Alumni President signature added successfully');
    } catch (error) {
      console.warn('Alumni President signature image not found:', error.message);
      doc.fontSize(12).text('Alumni President', 150, doc.page.height - 80, { align: 'center', width: 100 });
    }
    // Principal signature (right side)
    try {
      doc.image(principalSignaturePath, doc.page.width - 250, doc.page.height - 150, {
        width: 100,
        height: 60
      });
      doc.fontSize(12).text('Principal', doc.page.width - 250, doc.page.height - 80, { align: 'center', width: 100 });
      console.log('Principal signature added successfully');
    } catch (error) {
      console.warn('Principal signature image not found:', error.message);
      doc.fontSize(12).text('Principal', doc.page.width - 250, doc.page.height - 80, { align: 'center', width: 100 });
    }
    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all speakers
app.get('/api/speakers', async (req, res) => {
  try {
    const speakers = await WebinarSpeaker.find()
      .select('name designation department batch companyName domain topic')
      .sort({ name: 1 });
    res.json(speakers);
  } catch (error) {
    console.error('Error fetching speakers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats for a specific phase
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    const { phase } = req.query;
    if (!phase) {
      return res.status(400).json({ error: 'Phase parameter is required' });
    }

    const domains = ['Full Stack Development', 'Artificial Intelligence', 'Cyber Security', 'Data Science', 'Cloud Computing', 'Embedded Systems', 'DevOps'];

    if (phase === 'Phase 6') {
      // Phase 6: Dec 2025 - Mar 2026
      const phaseStart = new Date('2025-12-01');
      const phaseEnd = new Date('2026-03-31');

      // Get all webinars in Phase 6
      const webinars = await WebinarWebinar.find({
        webinarDate: { $gte: phaseStart, $lte: phaseEnd }
      }).populate('speaker', 'name designation department batch companyName');

      // Get all speakers to calculate total speakers per domain
      const allSpeakers = await WebinarSpeaker.find();

      // Initialize domain stats
      const domainStats = domains.map(domain => ({
        id: domain.toLowerCase().replace(/\s+/g, '-'),
        name: domain,
        planned: 4, // Default 4 webinars planned for Phase 6
        conducted: 0,
        postponed: 0,
        totalSpeakers: 0,
        newSpeakers: 0,
        requestedTopics: [],
        approvedTopics: [],
        completedTopics: []
      }));

      // Calculate conducted and postponed
      const now = new Date();
      webinars.forEach(webinar => {
        const domainIndex = domains.indexOf(webinar.domain);
        if (domainIndex !== -1) {
          if (webinar.webinarDate <= now) {
            // Webinar date has passed
            if (webinar.attendedCount && webinar.attendedCount > 0) {
              // Completion details uploaded
              domainStats[domainIndex].conducted += 1;
            } else {
              // No completion details
              domainStats[domainIndex].postponed += 1;
            }
          }
        }
      });

      // Calculate speakers per domain
      domains.forEach((domain, index) => {
        const domainSpeakers = allSpeakers.filter(speaker => speaker.domain === domain);
        domainStats[index].totalSpeakers = domainSpeakers.length;
        // For Phase 6, newSpeakers = totalSpeakers since it's the latest phase
        domainStats[index].newSpeakers = domainSpeakers.length;
      });

      const result = {
        months: ['Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
        domains: domainStats
      };

      res.json(result);
    } else {
      // For other phases, return static data or handle differently
      res.status(400).json({ error: 'Phase not supported for dynamic data' });
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get monthly webinar stats aggregated by month
app.get('/api/webinar-stats/monthly', async (req, res) => {
  try {
    const webinars = await WebinarWebinar.find()
      .populate('speaker', 'name designation department batch companyName')
      .sort({ webinarDate: 1 });

    // Group webinars by month-year
    const monthlyStats = {};
    const domains = ['Full Stack Development', 'Artificial Intelligence', 'Cyber Security', 'Data Science', 'Cloud Computing', 'Embedded Systems', 'DevOps'];

    webinars.forEach(webinar => {
      const date = new Date(webinar.webinarDate);
      const monthYear = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

      if (!monthlyStats[monthYear]) {
        monthlyStats[monthYear] = {
          months: [monthYear],
          domains: domains.map(domain => ({
            id: domain.toLowerCase().replace(/\s+/g, '-'),
            name: domain,
            planned: 0,
            conducted: 0,
            postponed: 0,
            totalSpeakers: 0,
            newSpeakers: 0,
            requestedTopics: [],
            approvedTopics: [],
            completedTopics: []
          }))
        };
      }

      const domainIndex = domains.indexOf(webinar.domain);
      if (domainIndex !== -1) {
        monthlyStats[monthYear].domains[domainIndex].conducted += 1;
        // Track unique speakers per domain
        const speakerKey = webinar.speaker?._id?.toString();
        if (speakerKey && !monthlyStats[monthYear].domains[domainIndex].speakers?.includes(speakerKey)) {
          monthlyStats[monthYear].domains[domainIndex].speakers = monthlyStats[monthYear].domains[domainIndex].speakers || [];
          monthlyStats[monthYear].domains[domainIndex].speakers.push(speakerKey);
          monthlyStats[monthYear].domains[domainIndex].newSpeakers += 1;
        }
      }
    });

    // Convert to array and sort by date
    const result = Object.keys(monthlyStats)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(month => ({
        month,
        ...monthlyStats[month]
      }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching monthly webinar stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate overall report as DOCX from backend
app.get('/api/overall-report', async (req, res) => {
  try {
    const { phase } = req.query;
    if (!phase) {
      return res.status(400).json({ error: 'Phase parameter is required' });
    }

    const webinars = await WebinarWebinar.find()
      .populate('speaker', 'name designation department batch companyName')
      .sort({ webinarDate: 1 });

    // Filter webinars by phase (assuming phase corresponds to a date range)
    // For now, we'll use all webinars since phase logic needs to be defined
    const phaseWebinars = webinars;

    // Aggregate stats by domain
    const domainStats = {};
    const domains = ['Full Stack Development', 'Artificial Intelligence', 'Cyber Security', 'Data Science', 'Cloud Computing', 'Embedded Systems', 'DevOps'];

    domains.forEach(domain => {
      domainStats[domain] = {
        planned: 0,
        conducted: 0,
        postponed: 0,
        totalSpeakers: 0,
        newSpeakers: 0,
        speakers: new Set()
      };
    });

    phaseWebinars.forEach(webinar => {
      if (domainStats[webinar.domain]) {
        domainStats[webinar.domain].conducted += 1;
        if (webinar.speaker?._id) {
          if (!domainStats[webinar.domain].speakers.has(webinar.speaker._id.toString())) {
            domainStats[webinar.domain].speakers.add(webinar.speaker._id.toString());
            domainStats[webinar.domain].newSpeakers += 1;
          }
        }
      }
    });

    // Calculate totals
    const totals = {
      planned: Object.values(domainStats).reduce((sum, d) => sum + d.planned, 0),
      conducted: Object.values(domainStats).reduce((sum, d) => sum + d.conducted, 0),
      postponed: Object.values(domainStats).reduce((sum, d) => sum + d.postponed, 0),
      totalSpeakers: Object.values(domainStats).reduce((sum, d) => sum + d.totalSpeakers, 0),
      newSpeakers: Object.values(domainStats).reduce((sum, d) => sum + d.newSpeakers, 0)
    };

    // Generate DOCX
    const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType } = require('docx');

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                width: 11906,
                height: 16838,
              },
              margin: {
                top: 720,
                bottom: 720,
                left: 720,
                right: 720,
              },
            },
          },
          children: [
            // Header
            new Paragraph({
              children: [new TextRun({ text: "NATIONAL ENGINEERING COLLEGE", bold: true, size: 34, font: 'Times New Roman' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "(An Autonomous Institution, Affiliated to Anna University–Chennai)", size: 24, font: 'Times New Roman' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 80 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "K.R. NAGAR, KOVILPATTI – 628 503", size: 24, font: 'Times New Roman' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "NEC ALUMNI ASSOCIATION", bold: true, size: 30, font: 'Times New Roman' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 150 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Overall Webinar Report - ${phase}`, bold: true, size: 28, font: 'Times New Roman' })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Generated on: ${new Date().toLocaleDateString()}`, size: 24, font: 'Times New Roman' })],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 300 },
            }),
            // Summary
            new Paragraph({
              children: [new TextRun({ text: "Summary Statistics", bold: true, size: 26, font: 'Times New Roman' })],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Planned Webinars: ${totals.planned}`, size: 24, font: 'Times New Roman' })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Conducted Webinars: ${totals.conducted}`, size: 24, font: 'Times New Roman' })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Postponed Webinars: ${totals.postponed}`, size: 24, font: 'Times New Roman' })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: `Total Speakers: ${totals.totalSpeakers + totals.newSpeakers}`, size: 24, font: 'Times New Roman' })],
              spacing: { after: 400 },
            }),
            // Domain table
            new Paragraph({
              children: [new TextRun({ text: "Domain-wise Details", bold: true, size: 26, font: 'Times New Roman' })],
              spacing: { after: 200 },
            }),
            new Table({
              width: { size: 100, type: "pct" },
              alignment: AlignmentType.CENTER,
              borders: {
                top: { style: "single", size: 1 },
                bottom: { style: "single", size: 1 },
                left: { style: "single", size: 1 },
                right: { style: "single", size: 1 },
                insideVertical: { style: "single", size: 1 },
                insideHorizontal: { style: "single", size: 1 },
              },
              rows: [
                new TableRow({
                  tableHeader: true,
                  children: [
                    new TableCell({ width: { size: 20, type: "pct" }, children: [new Paragraph({ children: [new TextRun({ text: "Domain", bold: true, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ width: { size: 8, type: "pct" }, children: [new Paragraph({ children: [new TextRun({ text: "Planned", bold: true, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ width: { size: 8, type: "pct" }, children: [new Paragraph({ children: [new TextRun({ text: "Conducted", bold: true, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ width: { size: 8, type: "pct" }, children: [new Paragraph({ children: [new TextRun({ text: "Postponed", bold: true, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ width: { size: 10, type: "pct" }, children: [new Paragraph({ children: [new TextRun({ text: "Total Speakers", bold: true, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ width: { size: 10, type: "pct" }, children: [new Paragraph({ children: [new TextRun({ text: "New Speakers", bold: true, font: 'Times New Roman' })], alignment: AlignmentType.CENTER })] }),
                  ],
                }),
                ...domains.map(domain =>
                  new TableRow({
                    children: [
                      new TableCell({ width: { size: 20, type: "pct" }, children: [new Paragraph({ text: domain, alignment: AlignmentType.LEFT })] }),
                      new TableCell({ width: { size: 8, type: "pct" }, children: [new Paragraph({ text: domainStats[domain].planned.toString(), alignment: AlignmentType.CENTER })] }),
                      new TableCell({ width: { size: 8, type: "pct" }, children: [new Paragraph({ text: domainStats[domain].conducted.toString(), alignment: AlignmentType.CENTER })] }),
                      new TableCell({ width: { size: 8, type: "pct" }, children: [new Paragraph({ text: domainStats[domain].postponed.toString(), alignment: AlignmentType.CENTER })] }),
                      new TableCell({ width: { size: 10, type: "pct" }, children: [new Paragraph({ text: (domainStats[domain].totalSpeakers + domainStats[domain].newSpeakers).toString(), alignment: AlignmentType.CENTER })] }),
                      new TableCell({ width: { size: 10, type: "pct" }, children: [new Paragraph({ text: domainStats[domain].newSpeakers.toString(), alignment: AlignmentType.CENTER })] }),
                    ],
                  })
                ),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Overall_Report_${phase.replace(' ', '_')}.docx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating overall report:', error);
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

// Run Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});