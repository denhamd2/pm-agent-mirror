import React, { useState } from 'react';
import './time-to-fill-recruiter-dashboard.css';

/**
 * Donezo-style task dashboard adapted for recruiter Time to Fill metrics.
 * Visual reference: https://cdn.dribbble.com/userupload/17730954/file/original-1ca571d72aed46b341defcb0bf9a18e1.png
 */

const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Triple stack heights (dark / light / stripe) per day — illustrative */
const WEEK_BARS: [number, number, number][] = [
  [28, 18, 12],
  [42, 32, 22],
  [35, 24, 16],
  [48, 20, 14],
  [38, 28, 20],
  [32, 22, 10],
  [24, 16, 8],
];

const REQ_ITEMS = [
  { title: 'Principal PM — HCM (JR-4790)', due: 'Due in 3 days', variant: 'a' as const },
  { title: 'Screening batch — Platform roles', due: 'Due tomorrow', variant: 'b' as const },
  { title: 'Offer packet — Sales Director', due: 'Due Friday', variant: 'c' as const },
];

const TEAM = [
  { name: 'Alex Morgan', task: 'JR-4821 · Panel scheduling', status: 'done' as const },
  { name: 'Sam Rivera', task: 'JR-4765 · HM feedback', status: 'prog' as const },
  { name: 'Casey Kim', task: 'JR-4752 · SLA escalation', status: 'pend' as const },
];

function NavIconHome() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

function NavIconCheck() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3 8-8" />
      <path d="M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function NavIconCal() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function NavIconChart() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}

function NavIconTeam() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function NavIconSettings() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function NavIconHelp() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
    </svg>
  );
}

function NavIconLogout() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

function PlIcon({ variant }: { variant: 'a' | 'b' | 'c' }) {
  if (variant === 'a') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    );
  }
  if (variant === 'b') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function BarChartBlock() {
  const [tip, setTip] = useState<number | null>(1);
  return (
    <div className="ttf-card">
      <div className="ttf-card-h">Req pipeline (weekly)</div>
      <div className="ttf-card-sub">Volume by stage — closed, active, pending</div>
      <div className="ttf-bars">
        {WEEK.map((label, i) => {
          const [hDark, hLight, hStripe] = WEEK_BARS[i];
          const max = 160;
          const showTip = tip === i && i === 1;
          return (
            <div key={label + String(i)} className="ttf-bar-group">
              <div className="ttf-bar-wrap-pos" onMouseEnter={() => setTip(i)} onMouseLeave={() => setTip(null)}>
                {showTip ? <div className="ttf-tooltip">74%</div> : null}
                <div className="ttf-bar-stack" style={{ height: max }}>
                  <div className="ttf-bar-seg ttf-bar-seg--dark" style={{ height: `${(hDark / 100) * max}px` }} title="Filled" />
                  <div className="ttf-bar-seg ttf-bar-seg--light" style={{ height: `${(hLight / 100) * max}px` }} title="Active" />
                  <div className="ttf-bar-seg ttf-bar-seg--stripe" style={{ height: `${(hStripe / 100) * max}px` }} title="Pending" />
                </div>
              </div>
              <span className="ttf-bar-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SemicircleGauge() {
  const arc = 'M 40 100 A 70 70 0 0 1 180 100';
  return (
    <div className="ttf-card">
      <div className="ttf-card-h">Fill progress</div>
      <div className="ttf-card-sub">Quarter hiring goal — reqs with accepted offer</div>
      <div className="ttf-gauge-wrap">
        <svg className="ttf-gauge-svg" viewBox="0 0 220 118" aria-hidden>
          <defs>
            <pattern id="ttfStripePat" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
              <rect width="4" height="8" fill="#d1d5db" />
              <rect x="4" width="4" height="8" fill="#f3f4f6" />
            </pattern>
          </defs>
          <path d={arc} pathLength="100" fill="none" stroke="#e5e7eb" strokeWidth="26" strokeLinecap="round" />
          <path
            d={arc}
            pathLength="100"
            fill="none"
            stroke="#86efac"
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray="38 100"
          />
          <path
            d={arc}
            pathLength="100"
            fill="none"
            stroke="#14532d"
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray="28 100"
            strokeDashoffset="-38"
          />
          <path
            d={arc}
            pathLength="100"
            fill="none"
            stroke="url(#ttfStripePat)"
            strokeWidth="26"
            strokeLinecap="round"
            strokeDasharray="34 100"
            strokeDashoffset="-66"
          />
        </svg>
        <div className="ttf-gauge-center">
          <div className="ttf-gauge-pct">41%</div>
          <div className="ttf-gauge-label">Roles filled this quarter</div>
        </div>
        <div className="ttf-gauge-legend">
          <span>
            <i style={{ background: '#86efac' }} /> Filled
          </span>
          <span>
            <i style={{ background: '#14532d' }} /> In progress
          </span>
          <span>
            <i style={{ background: 'repeating-linear-gradient(-45deg,#d1d5db,#d1d5db 2px,#f3f4f6 2px,#f3f4f6 4px)' }} /> Pending
          </span>
        </div>
      </div>
    </div>
  );
}

export const TimeToFillRecruiterDashboard: React.FC = () => {
  const [q, setQ] = useState('');

  return (
    <div className="ttf-root">
      <div className="ttf-layout">
        <aside className="ttf-sidebar" aria-label="Main navigation">
          <div className="ttf-brand">
            <div className="ttf-brand-mark" aria-hidden />
            <span className="ttf-brand-name">Donezo</span>
          </div>

          <div className="ttf-nav-section">Menu</div>
          <button type="button" className="ttf-snav ttf-snav--active">
            <NavIconHome />
            Dashboard
          </button>
          <button type="button" className="ttf-snav">
            <NavIconCheck />
            Tasks
            <span className="ttf-nav-badge">12+</span>
          </button>
          <button type="button" className="ttf-snav">
            <NavIconCal />
            Calendar
          </button>
          <button type="button" className="ttf-snav">
            <NavIconChart />
            Analytics
          </button>
          <button type="button" className="ttf-snav">
            <NavIconTeam />
            Team
          </button>

          <div className="ttf-nav-section">General</div>
          <button type="button" className="ttf-snav">
            <NavIconSettings />
            Settings
          </button>
          <button type="button" className="ttf-snav">
            <NavIconHelp />
            Help
          </button>
          <button type="button" className="ttf-snav">
            <NavIconLogout />
            Logout
          </button>

          <div className="ttf-promo">
            <div className="ttf-promo-card">
              <div className="ttf-promo-title">Download our mobile app for easy tracking</div>
              <button type="button" className="ttf-promo-btn">
                Download
              </button>
            </div>
          </div>
        </aside>

        <div className="ttf-panel-outer">
          <header className="ttf-topbar">
            <div className="ttf-search-center">
              <div className="ttf-search-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input placeholder="Search anything here..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
                <kbd className="ttf-kbd">⌘ F</kbd>
              </div>
            </div>
            <div className="ttf-topbar-right">
              <button type="button" className="ttf-icon-circle" aria-label="Messages">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </button>
              <button type="button" className="ttf-icon-circle" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </button>
              <div className="ttf-user-block">
                <div className="ttf-user-avatar" aria-hidden />
                <div>
                  <div className="ttf-user-name">Totok Michael</div>
                  <div className="ttf-user-email">totokmichael@gmail.com</div>
                </div>
              </div>
            </div>
          </header>

          <div className="ttf-title-row">
            <div>
              <h1 className="ttf-page-title">Dashboard</h1>
              <p className="ttf-page-sub">Time to fill &amp; open requisitions — sample recruiter metrics</p>
            </div>
            <div className="ttf-title-actions">
              <button type="button" className="btn-dn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add requisition
              </button>
              <button type="button" className="btn-dn-outline">
                Import data
              </button>
            </div>
          </div>

          <div className="ttf-kpis">
            <div className="ttf-kpi ttf-kpi--hero">
              <div className="ttf-kpi-arrow" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
              <div className="ttf-kpi-label">Open roles</div>
              <div className="ttf-kpi-value">24</div>
              <span className="ttf-kpi-badge">↑ Increased from last month</span>
            </div>
            <div className="ttf-kpi">
              <div className="ttf-kpi-label">Avg. time to fill</div>
              <div className="ttf-kpi-value" style={{ fontSize: 32 }}>
                34d
              </div>
              <div className="ttf-kpi-trend">↓ 4 days vs last quarter</div>
            </div>
            <div className="ttf-kpi">
              <div className="ttf-kpi-label">Active candidates</div>
              <div className="ttf-kpi-value" style={{ fontSize: 32 }}>
                186
              </div>
              <div className="ttf-kpi-trend">+12 this week</div>
            </div>
            <div className="ttf-kpi">
              <div className="ttf-kpi-label">Over 30 days</div>
              <div className="ttf-kpi-value" style={{ fontSize: 32 }}>
                2
              </div>
              <div className="ttf-kpi-trend ttf-kpi-trend--muted">On discuss</div>
            </div>
          </div>

          <div className="ttf-mid">
            <BarChartBlock />

            <div className="ttf-card">
              <div className="ttf-card-h">Reminders</div>
              <div className="ttf-card-sub">Next on your calendar</div>
              <p className="ttf-remind-meta">Today · 2:00 PM — 3:30 PM</p>
              <div className="ttf-remind-title">Hiring manager sync — Arc Company</div>
              <p className="ttf-remind-meta">Discuss JR-4821 pipeline and interview panel for the senior recruiter role.</p>
              <button type="button" className="ttf-remind-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" />
                </svg>
                Start meeting
              </button>
            </div>

            <div className="ttf-card">
              <div className="ttf-pl-head">
                <div className="ttf-card-h" style={{ margin: 0 }}>
                  Requisitions
                </div>
                <button type="button" className="btn-new-small">
                  + New
                </button>
              </div>
              {REQ_ITEMS.map((item) => (
                <div key={item.title} className="ttf-pl-item">
                  <div className={`ttf-pl-icon ttf-pl-icon--${item.variant}`}>
                    <PlIcon variant={item.variant} />
                  </div>
                  <div>
                    <div className="ttf-pl-name">{item.title}</div>
                    <div className="ttf-pl-due">{item.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ttf-bot">
            <div className="ttf-card">
              <div className="ttf-card-h">Recruiter collaboration</div>
              <div className="ttf-card-sub">Who is working what</div>
              {TEAM.map((m) => (
                <div key={m.name} className="ttf-team-row">
                  <div className="ttf-team-av" aria-hidden />
                  <div className="ttf-team-info">
                    <div className="ttf-team-name">{m.name}</div>
                    <div className="ttf-team-task">{m.task}</div>
                  </div>
                  <span
                    className={
                      m.status === 'done'
                        ? 'pill-status pill-status--done'
                        : m.status === 'prog'
                          ? 'pill-status pill-status--prog'
                          : 'pill-status pill-status--pend'
                    }
                  >
                    {m.status === 'done' ? 'Completed' : m.status === 'prog' ? 'In progress' : 'Pending'}
                  </span>
                </div>
              ))}
              <button type="button" className="btn-add-member">
                + Add member
              </button>
            </div>

            <SemicircleGauge />

            <div className="ttf-tracker">
              <div className="ttf-tracker-inner">
                <div className="ttf-tracker-h">Time tracker</div>
                <div className="ttf-tracker-time">01:24:08</div>
                <div className="ttf-tracker-controls">
                  <button type="button" className="ttf-track-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    Pause
                  </button>
                  <button type="button" className="ttf-track-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="ttf-foot">
            Visual reference:{' '}
            <a href="https://cdn.dribbble.com/userupload/17730954/file/original-1ca571d72aed46b341defcb0bf9a18e1.png" target="_blank" rel="noreferrer">
              Donezo task dashboard (Dribbble)
            </a>
            . Colours and layout follow that asset; recruiter labels replace generic project copy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeToFillRecruiterDashboard;
