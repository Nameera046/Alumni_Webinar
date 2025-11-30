// ---------- FILE: WebinarDashboard.jsx ----------
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import './WebinarDashboard.css';
import './Common.css';
import { GraduationCap, ArrowLeft} from "lucide-react";
import { useNavigate } from "react-router-dom";


/*
  WebinarDashboard.jsx
  - Single-file React component that implements ALL requested options:
    1) Charts (bar / doughnut / line)
    2) Advanced UI (sidebar, animations, glass cards)
    3) Table view with sorting, pagination, search
    4) College-theme toggle (example styles) to match provided UI
    5) Phase-wise tabs and domain popups with speaker counts

  Usage:
    - place this file and the CSS file in the same folder
    - install recharts: `npm i recharts`
    - import and render <WebinarDashboard /> from your app
*/

// -----------------------
// Context (phase selection)
// -----------------------
const PhaseContext = createContext();
export const usePhase = () => useContext(PhaseContext);

const PhaseProvider = ({ children }) => {
  const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
  const [selectedPhase, setSelectedPhase] = useState(phases[0]);
  return (
    <PhaseContext.Provider value={{ phases, selectedPhase, setSelectedPhase }}>
      {children}
    </PhaseContext.Provider>
  );
};

// -----------------------
// Seed data (example)
// -----------------------
const seedPhases = {
  'Phase 1': {
    months: ['Aug', 'Sep', 'Oct', 'Nov'],
    domains: [
      { id: 'd1', name: 'Full Stack Development', planned: 28, conducted: 21, postponed: 7, totalSpeakers: 18, newSpeakers: 5 },
      { id: 'd2', name: 'Artificial Intelligence', planned: 28, conducted: 24, postponed: 4, totalSpeakers: 20, newSpeakers: 6 },
      { id: 'd3', name: 'Cyber Security', planned: 28, conducted: 18, postponed: 10, totalSpeakers: 15, newSpeakers: 3 },
      { id: 'd4', name: 'Data Science', planned: 28, conducted: 22, postponed: 6, totalSpeakers: 17, newSpeakers: 4 },
      { id: 'd5', name: 'Cloud Computing', planned: 28, conducted: 25, postponed: 3, totalSpeakers: 13, newSpeakers: 2 },
      { id: 'd6', name: 'Embedded Systems', planned: 28, conducted: 20, postponed: 8, totalSpeakers: 12, newSpeakers: 1 }
    ]
  },
  'Phase 2': {
    months: ['Dec', 'Jan', 'Feb', 'Mar'],
    domains: [
      { id: 'd1', name: 'Full Stack Development', planned: 28, conducted: 22, postponed: 6, totalSpeakers: 16, newSpeakers: 4 },
      { id: 'd2', name: 'Artificial Intelligence', planned: 28, conducted: 23, postponed: 5, totalSpeakers: 18, newSpeakers: 5 },
      { id: 'd3', name: 'Cyber Security', planned: 28, conducted: 19, postponed: 9, totalSpeakers: 14, newSpeakers: 3 },
      { id: 'd4', name: 'Data Science', planned: 28, conducted: 20, postponed: 8, totalSpeakers: 15, newSpeakers: 4 },
      { id: 'd5', name: 'Cloud Computing', planned: 28, conducted: 24, postponed: 4, totalSpeakers: 14, newSpeakers: 3 },
      { id: 'd6', name: 'Embedded Systems', planned: 28, conducted: 18, postponed: 10, totalSpeakers: 11, newSpeakers: 2 }
    ]
  },
  'Phase 3': {
    months: ['Apr', 'May', 'Jun', 'Jul'],
    domains: [
      { id: 'd1', name: 'Full Stack Development', planned: 28, conducted: 20, postponed: 8, totalSpeakers: 14, newSpeakers: 3 },
      { id: 'd2', name: 'Artificial Intelligence', planned: 28, conducted: 21, postponed: 7, totalSpeakers: 15, newSpeakers: 4 },
      { id: 'd3', name: 'Cyber Security', planned: 28, conducted: 17, postponed: 11, totalSpeakers: 13, newSpeakers: 2 },
      { id: 'd4', name: 'Data Science', planned: 28, conducted: 19, postponed: 9, totalSpeakers: 12, newSpeakers: 3 },
      { id: 'd5', name: 'Cloud Computing', planned: 28, conducted: 23, postponed: 5, totalSpeakers: 12, newSpeakers: 2 },
      { id: 'd6', name: 'Embedded Systems', planned: 28, conducted: 17, postponed: 11, totalSpeakers: 10, newSpeakers: 1 }
    ]
  }
};

// -----------------------
// Utility helpers
// -----------------------
const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

function paginate(array, page = 1, pageSize = 5) {
  const start = (page - 1) * pageSize;
  return array.slice(start, start + pageSize);
}

// -----------------------
// Main Dashboard
// -----------------------
export default function WebinarDashboard() {
  return (
    <PhaseProvider>
      <DashboardShell />
    </PhaseProvider>
  );
}

function DashboardShell() {
  const { phases, selectedPhase, setSelectedPhase } = usePhase();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [view, setView] = useState('overview'); // overview, webinars, table, analytics
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'name', dir: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [collegeTheme, setCollegeTheme] = useState('default'); // default or college

  // When phase changes reset page
  useEffect(() => setPage(1), [selectedPhase, view]);
  const navigate = useNavigate(); 
  const phaseData = seedPhases[selectedPhase];

  // Derived totals
  const totals = useMemo(() => {
    const planned = phaseData.domains.reduce((s, d) => s + d.planned, 0);
    const conducted = phaseData.domains.reduce((s, d) => s + d.conducted, 0);
    const postponed = phaseData.domains.reduce((s, d) => s + d.postponed, 0);
    const totalSpeakers = phaseData.domains.reduce((s, d) => s + d.totalSpeakers, 0);
    const newSpeakers = phaseData.domains.reduce((s, d) => s + d.newSpeakers, 0);
    return { planned, conducted, postponed, totalSpeakers, newSpeakers };
  }, [phaseData]);

  // Table data (search + sort)
  const tableData = useMemo(() => {
    let arr = phaseData.domains.map(d => ({ ...d }));
    if (search.trim()) {
      const s = search.toLowerCase();
      arr = arr.filter(d => d.name.toLowerCase().includes(s));
    }
    arr.sort((a, b) => {
      const k = sortBy.key;
      const dir = sortBy.dir === 'asc' ? 1 : -1;
      if (a[k] < b[k]) return -1 * dir;
      if (a[k] > b[k]) return 1 * dir;
      return 0;
    });
    return arr;
  }, [phaseData, search, sortBy]);

  const paged = paginate(tableData, page, pageSize);
  const totalPages = Math.max(1, Math.ceil(tableData.length / pageSize));

  return (
    <div className={`wb-root ${collegeTheme === 'college' ? 'theme-college' : ''}`}>
      <main className="wb-main">
        <div className="form-header">
            <div className="icon-wrapper">
              <GraduationCap className="header-icon" />
            </div>
            <h1 className="form-title">Webinar Dashboard</h1>
          </div>
        <header className="wb-header">
          <div className="header-left">
            <p className="muted"> </p>
          </div>
          
          <div className="header-right">
              {/* Phase dropdown */}
              <select
                className="phase-select"
                value={selectedPhase}
                onChange={(e) => setSelectedPhase(e.target.value)}
              >
                {phases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {/* Existing search box */}
              <input
                className="search"
                placeholder="Search domains..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
        </header>
        <section className="wb-content">
          {view === 'overview' && (
            <div>
              
            <div>
              {/* <div className="controls-row">
                <button className="btn-primary" onClick={() => alert('Schedule flow here')}>Schedule Webinar</button>
                <button onClick={() => alert('Export CSV') } className="btn-ghost">Export</button>
              </div> */}
              <div className="webinars-header">
                <h3>Domain Webinars Overview</h3>
                <p className="muted">Manage and track webinars across different domains</p>
              </div>
              <div className="header-center2"> 
                <div className="stats-mini"> 
                  <div> 
                    <div className="muted">Planned</div> 
                    <div className="large">{totals.planned}</div> 
                    </div> 
                    <div> 
                      <div className="muted">Conducted</div> 
                      <div className="large">{totals.conducted}</div> 
                    </div> 
                    <div> 
                      <div className="muted">Postponed</div> 
                      <div className="large">{totals.postponed}
                    </div> 
                  </div> 
                  <div>
                    <div className="muted">Speakers</div> 
                    <div className="large">{totals.totalSpeakers} (+{totals.newSpeakers})</div> 
                  </div> 
                </div>
              </div>

              <div className="list-cards">
                {phaseData.domains.map((d, idx) => {
                  const progressPercentage = d.planned > 0 ? (d.conducted / d.planned) * 100 : 0;
                  return (
                    <div key={d.id} className="webinar-card">
                      <div className="webinar-card-header">
                        <div className="webinar-icon">🎓</div>
                        <h4>{d.name}</h4>
                        <div className="webinar-status">
                          <span className={`status-dot ${progressPercentage === 100 ? 'completed' : progressPercentage > 50 ? 'in-progress' : 'pending'}`}></span>
                        </div>
                      </div>
                      <div className="webinar-stats">
                        <div className="stat-item">
                          <span className="stat-label">Planned</span>
                          <span className="stat-value planned">{d.planned}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Conducted</span>
                          <span className="stat-value conducted">{d.conducted}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Postponed</span>
                          <span className="stat-value postponed">{d.postponed}</span>
                        </div>
                      </div>
                      <div className="webinar-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
                        </div>
                        <span className="progress-text">{Math.round(progressPercentage)}% Complete</span>
                      </div>
                      <div className="webinar-speakers">
                        <div className="speaker-info">
                          <span className="speaker-icon">👥</span>
                          <span>Total Speakers: {d.totalSpeakers}</span>
                          <span className="new-speakers">(+{d.newSpeakers} new)</span>
                        </div>
                      </div>
                      <div className="webinar-actions">
                        <button onClick={() => setSelectedDomain(d)} className="btn-primary small">View Details</button>
                        {/* <button onClick={() => alert('Schedule webinar for ' + d.name)} className="btn-ghost small">Schedule</button> */}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}
        </section>

        {/* Popup for domain details */}
        {selectedDomain && (
          <div className="modal-overlay" onClick={() => setSelectedDomain(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{selectedDomain.name}</h3>
                <div className="muted">Phase: {selectedPhase}</div>
              </div>
              <div className="modal-body">
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#4b3f91', fontSize: '1.2rem' }}>Progress Overview</h4>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${selectedDomain.planned > 0 ? (selectedDomain.conducted / selectedDomain.planned) * 100 : 0}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.9rem', color: '#6b7280' }}>
                    <span>Conducted: {selectedDomain.conducted}</span>
                    <span>Planned: {selectedDomain.planned}</span>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat">
                    <div className="label">Planned Webinars</div>
                    <div className="value" style={{ color: '#3b82f6' }}>{selectedDomain.planned}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Conducted Webinars</div>
                    <div className="value" style={{ color: '#10b981' }}>{selectedDomain.conducted}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Postponed Webinars</div>
                    <div className="value" style={{ color: '#f59e0b' }}>{selectedDomain.postponed}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Total Speakers</div>
                    <div className="value">{selectedDomain.totalSpeakers}</div>
                  </div>
                  <div className="stat">
                    <div className="label">New Speakers</div>
                    <div className="value">{selectedDomain.newSpeakers}</div>
                  </div>
                  <div className="stat">
                    <div className="label">Completion Rate</div>
                    <div className="value">{selectedDomain.planned > 0 ? Math.round((selectedDomain.conducted / selectedDomain.planned) * 100) : 0}%</div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => alert('Open manage speakers')}>Manage Speakers</button>
                  {/* <button className="btn-ghost" onClick={() => alert('Open schedule')}>Schedule Webinar</button> */}
                  <button className="btn-ghost" onClick={() => setSelectedDomain(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
<div className="quick-actions-section">
  <h3 className="qa-title">Quick Actions</h3>

  <div className="qa-grid">
  <div className="qa-card" onClick={() => navigate("/student-request")} style={{ cursor: "pointer" }}>
      <div className="qa-icon">📄</div>
      <h4 className="qa-heading">Student Request Form</h4>
      <span className="qa-tag">Request</span>
      <p className="qa-desc">
        Submit student requests for webinars, topics, domains and speaker preferences.
      </p>
    </div>
    <div className="qa-card" onClick={() => navigate("/webinar-events")} style={{ cursor: "pointer" }}>
        <div className="qa-icon">👩🏼‍🎓</div>
        <h4 className="qa-heading">Webinar Events</h4>
        <span className="qa-tag">view</span>
        <p className="qa-desc">
          Join our webinar event to learn, engage, and gain valuable insights from experts.
        </p>
    </div>
  <div className="qa-card" onClick={() => navigate("/speaker-assignment")} style={{ cursor: "pointer" }}>
      <div className="qa-icon">🧑‍🏫</div>
      <h4 className="qa-heading">Speaker Assignment Form</h4>
      <span className="qa-tag">Assignment</span>
      <p className="qa-desc">
        Assign speakers to webinars and manage availability, schedules and confirmations.
      </p>
    </div>
    <div className="qa-card" onClick={() => navigate("/webinar-details-upload")} style={{ cursor: "pointer" }}>
        <div className="qa-icon">🗂️</div>
        <h4 className="qa-heading">Webinar Details Upload</h4>
        <span className="qa-tag">Upload</span>
        <p className="qa-desc">
          Upload webinar materials, attendance, resources and summary documentation.
        </p>
    </div>
    <div className="qa-card" onClick={() => navigate("/requested-topic-approval")} style={{ cursor: "pointer" }}>
        <div className="qa-icon">✅</div>
        <h4 className="qa-heading">Requested Topic Approval</h4>
        <span className="qa-tag">Approval</span>
        <p className="qa-desc">
          Review and approve requested webinar topics from students and faculty.
        </p>
    </div>
  <div className="qa-card" onClick={() => navigate("/alumni-feedback")} style={{ cursor: "pointer" }}>
      <div className="qa-icon">🏫</div>
      <h4 className="qa-heading">Alumni Feedback Form</h4>
      <span className="qa-tag">Feedback</span>
      <p className="qa-desc">
        Collect and manage alumni feedback regarding sessions and overall engagement.
      </p>
    </div>
  <div className="qa-card" onClick={() => navigate("/student-feedback")} style={{ cursor: "pointer" }}>
      <div className="qa-icon">🎓</div>
      <h4 className="qa-heading">Student Feedback Form</h4>
      <span className="qa-tag">Feedback</span>
      <p className="qa-desc">
        Capture student experience, learning outcomes and effectiveness of webinars.
      </p>
    </div>

  </div>
</div>

        <footer className="wb-footer">
  <div className="footer-inner">

    <p className="footer-sub">
      Structured Analytics • Performance Tracking • Institutional Insights
    </p>

    <div className="footer-social">
      <a href="#" aria-label="Twitter">
        <i className="fab fa-twitter"></i> Twitter
      </a>
      <a href="#" aria-label="LinkedIn">
        <i className="fab fa-linkedin"></i> LinkedIn
      </a>
      <a href="#" aria-label="GitHub">
        <i className="fab fa-github"></i> GitHub
      </a>
    </div>

    <div className="footer-bottom">
      © 2024 All Rights Reserved • SDMCET Webinar Analytics
    </div>

  </div>
</footer>
          <p className="form-footer">Designed with 💜 for Alumni Network</p>

      </main>

    </div>
  );
}

// End of JSX file
