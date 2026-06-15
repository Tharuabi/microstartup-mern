import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../style/Funding.css';
import { useAuth } from '../context/AuthContext';

const sampleSchemes = [
  {
    id: 'nidhi-prayas',
    title: 'NIDHI-PRAYAS',
    type: 'Grant',
    amount: 'Up to ₹10 Lakhs',
    audience: 'Innovators / Students',
    eligibility: 'Prototype stage, hosted by recognized incubators',
    description: 'Supports innovators to convert ideas into prototypes via grant support and incubation mentoring.',
    url: 'https://nidhi-prayas.org/',
    tags: ['Grant','Student','Tech','Hardware'],
    agency: 'DST',
    deadline: '2025-10-31',
  },
  {
    id: 'tide-2-0',
    title: 'TIDE 2.0',
    type: 'Grant',
    amount: 'Up to ₹7 Lakhs (Prototype)',
    audience: 'Electronics/IT Startups',
    eligibility: 'Early-stage startups under MeitY incubators',
    description: 'Funding support for startups in electronics, IT and IoT through MeitY-recognized incubators.',
    url: 'https://www.meity.gov.in/tide-2.0',
    tags: ['Grant','Tech','IoT','Electronics'],
    agency: 'MeitY',
    deadline: '2025-12-15',
  },
  {
    id: 'startup-india-seed',
    title: 'Startup India Seed Fund',
    type: 'Funding',
    amount: 'Up to ₹50 Lakhs',
    audience: 'Early-stage Startups',
    eligibility: 'DPIIT recognized startup with traction/innovation',
    description: 'Provides financial assistance for proof of concept, prototype development, product trials and market entry.',
    url: 'https://www.startupindia.gov.in/content/sih/en/seed-fund.html',
    tags: ['Funding','Seed','Tech'],
    agency: 'Startup India',
    deadline: '2025-11-30',
  },
  {
    id: 'smart-india-hackathon',
    title: 'Smart India Hackathon',
    type: 'Competition',
    description: 'National innovation competition for solving real-world problems with awards, mentorship and visibility.',
    url: 'https://www.sih.gov.in/',
    tags: ['Competition','Student','Innovation'],
    agency: 'MoE Innovation Cell',
    deadline: '2025-09-10',
  },
  {
    id: 'biotechnology-ignition-grant',
    title: 'Biotechnology Ignition Grant (BIG)',
    type: 'Grant',
    description: 'Early-stage grant by BIRAC to support high-risk, discovery-led innovations with commercial potential.',
    url: 'https://birac.nic.in/big.php',
    tags: ['Grant','BioTech','Health'],
    agency: 'BIRAC',
    deadline: '2025-08-20',
  },
];

function SchemeItem({ scheme, isOpen, onToggle, onPreview, isBookmarked, onToggleBookmark }) {
  const typeIcon = (t) => {
    const x = (t||'').toLowerCase();
    if (x === 'grant') return '💰';
    if (x === 'funding') return '🏦';
    if (x === 'competition') return '🏆';
    if (x === 'mentoring') return '🧠';
    if (x === 'announcement') return '📢';
    return '💡';
  };
  const daysLeft = (deadline) => {
    if (!deadline) return null;
    const d = new Date(deadline).getTime();
    if (Number.isNaN(d)) return null;
    const diff = d - Date.now();
    return Math.ceil(diff / (1000*60*60*24));
  };
  const dleft = daysLeft(scheme.deadline);
  const typeClass = `type-${(scheme.type||'').toLowerCase()}`;
  return (
    <div className={`fs-card ${isOpen ? 'open' : ''} ${typeClass}`}>
      <button className="fs-header" onClick={onToggle} aria-expanded={isOpen} aria-controls={`panel-${scheme.id}`}>
        <div className="fs-heading">
          <div className="fs-icon">{typeIcon(scheme.type)}</div>
          <div className="fs-title">{scheme.title}</div>
        </div>
        <div className="fs-header-meta">
          {scheme.amount && <span className="fs-amount">{scheme.amount}</span>}
          {scheme.type && <span className={`fs-type-badge ${typeClass}`}>{scheme.type}</span>}
          {scheme.agency && <span className="fs-agency">{scheme.agency}</span>}
          {dleft !== null && (
            <span className={`fs-deadline ${dleft<=7?'soon':dleft<=30?'near':'later'}`}>Closes in {dleft}d</span>
          )}
        </div>
        <svg className="fs-chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.2l3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4z" fill="currentColor"/>
        </svg>
      </button>
      {isOpen && (
        <div id={`panel-${scheme.id}`} className="fs-panel">
          <div className="fs-desc">{scheme.description}</div>
          <div className="fs-meta"><span className="fs-label">Type:</span> {scheme.type || '—'}</div>
          {scheme.amount && (<div className="fs-meta"><span className="fs-label">Amount:</span> {scheme.amount}</div>)}
          {scheme.audience && (<div className="fs-meta"><span className="fs-label">Audience:</span> {scheme.audience}</div>)}
          {scheme.eligibility && (<div className="fs-meta"><span className="fs-label">Eligibility:</span> {scheme.eligibility}</div>)}
          {scheme.agency && (<div className="fs-meta"><span className="fs-label">Agency:</span> {scheme.agency}</div>)}
          {scheme.deadline && (<div className="fs-meta"><span className="fs-label">Deadline:</span> {new Date(scheme.deadline).toDateString()}</div>)}
          {Array.isArray(scheme.tags) && scheme.tags.length>0 && (
            <div className="fs-r-tags">{scheme.tags.map((t,i)=>(<span key={i} className="fs-badge">{t}</span>))}</div>
          )}
          <div className="panel-actions">
            <a className="fs-apply" href={scheme.url} target="_blank" rel="noopener noreferrer">Apply Now</a>
            <button className="fs-secondary" onClick={()=>onPreview?.(scheme)}>Preview</button>
            <button className={`fs-secondary ${isBookmarked?'saved':''}`} onClick={onToggleBookmark}>{isBookmarked?'Saved':'Save'}</button>
            <NotifyMeButton scheme={scheme} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function FundingSchemes() {
  const { user } = useAuth?.() || {};
  const [openIds, setOpenIds] = useState(() => new Set());
  const [schemes, setSchemes] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [activeTab, setActiveTab] = useState('schemes'); // schemes | resources | tools
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const bookmarksKey = 'msx_scheme_bookmarks';
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(bookmarksKey)) || {}; } catch { return {}; }
  });
  const prefsKey = 'msx_user_prefs';
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(prefsKey)) || null; } catch { return null; }
  });
  const [showPrefs, setShowPrefs] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const params = {};
        if (typeFilter !== 'all') params.type = typeFilter;
        if (search.trim()) params.search = search.trim();
        if (sort) params.sort = sort;
        const res = await axios.get('/api/schemes', { params });
        if (mounted && Array.isArray(res.data)) {
          setSchemes(res.data);
        }
      } catch {
        // fallback to static data
        if (mounted) setSchemes(sampleSchemes);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [typeFilter, search, sort]);

  useEffect(() => {
    if (user && !prefs) setShowPrefs(true);
  }, [user, prefs]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const visible = useMemo(() => {
    const s = (search || '').toLowerCase();
    const list = schemes.length ? schemes : sampleSchemes;
    return list
      .filter(sc => (typeFilter === 'all' || (sc.type || '').toLowerCase() === typeFilter.toLowerCase()))
      .filter(sc => (sectorFilter === 'all' || (sc.tags||[]).map(t=>t.toLowerCase()).includes(sectorFilter.toLowerCase())))
      .filter(sc => audienceFilter === 'all' || (sc.audience || '').toLowerCase().includes(audienceFilter.toLowerCase()))
      .filter(sc => !s || `${sc.title} ${sc.description} ${(sc.tags||[]).join(' ')} ${(sc.audience||'')}`.toLowerCase().includes(s))
      .sort((a,b) => {
        if (sort === 'deadline') {
          const ad = a.deadline ? new Date(a.deadline).getTime() : Infinity;
          const bd = b.deadline ? new Date(b.deadline).getTime() : Infinity;
          return ad - bd;
        }
        const at = new Date(a.dateAdded || a.createdAt || 0).getTime();
        const bt = new Date(b.dateAdded || b.createdAt || 0).getTime();
        return bt - at; // latest first
      });
  }, [schemes, typeFilter, audienceFilter, search, sort, sectorFilter]);

  const stats = useMemo(() => {
    const total = visible.length;
    const grants = visible.filter(v => (v.type||'').toLowerCase() === 'grant').length;
    const closingSoon = visible.filter(v => {
      if (!v.deadline) return false; const d=new Date(v.deadline).getTime(); if (Number.isNaN(d)) return false; const days=(d-Date.now())/(1000*60*60*24); return days<=30; }).length;
    return { total, grants, closingSoon };
  }, [visible]);

  const recommended = useMemo(() => {
    if (!schemes.length && !sampleSchemes.length) return [];
    const source = schemes.length ? schemes : sampleSchemes;
    if (!prefs) return [];
    const tagsWanted = [];
    if (prefs.stage === 'Student') tagsWanted.push('Student');
    if (prefs.stage === 'Women') tagsWanted.push('Women');
    if (prefs.industry) tagsWanted.push(prefs.industry);
    if (prefs.industry === 'AI') tagsWanted.push('Tech','AI');
    const loc = (prefs.location||'').toLowerCase();
    const scored = source.map(s => {
      let score = 0;
      const tags = (s.tags||[]).map(t=>String(t).toLowerCase());
      tagsWanted.forEach(t => { if (tags.includes(String(t).toLowerCase())) score += 3; });
      if (prefs.stage && (s.audience||'').toLowerCase().includes(prefs.stage.toLowerCase())) score += 2;
      if (loc && (s.description||'').toLowerCase().includes(loc)) score += 1;
      if (s.deadline) score += 0.5; // prefer with deadlines
      return { s, score };
    }).sort((a,b)=>b.score-a.score).map(x=>x.s);
    return scored.slice(0, 6);
  }, [schemes, prefs]);

  const savePrefs = (next) => {
    setPrefs(next);
    try { localStorage.setItem(prefsKey, JSON.stringify(next)); } catch {}
    setShowPrefs(false);
  };

  const toggleBookmark = (id, title) => {
    setBookmarks(prev => {
      const next = { ...(prev||{}) };
      next[id] = !next[id];
      try { localStorage.setItem(bookmarksKey, JSON.stringify(next)); } catch {}
      if (next[id]) try { localStorage.setItem('msx_last_saved_scheme', title || id); } catch {}
      return next;
    });
  };

  return (
    <div className="fs-page">
      <div className="fs-hero">
        <h1>Startup Funding & Resources</h1>
        <p>Find grants, funds and learn from incubators and curated toolkits. Built to feel like Startup India.</p>
      </div>

      {/* Tabs */}
      <div className="fs-tabs">
        <button className={`fs-tab ${activeTab === 'schemes' ? 'active' : ''}`} onClick={() => setActiveTab('schemes')}>Funding Schemes</button>
        <button className={`fs-tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>Incubators & Startup Resources</button>
        <button className={`fs-tab ${activeTab === 'tools' ? 'active' : ''}`} onClick={() => setActiveTab('tools')}>Founder Tools</button>
      </div>

      {activeTab === 'schemes' ? (
        <>
          {user && (
            <div className="fs-reco">
              <div className="fs-reco-head">
                <div>
                  <div className="reco-title">Recommended for you</div>
                  <div className="reco-sub">Based on your profile preferences</div>
                </div>
                <button className="fs-secondary" onClick={()=>setShowPrefs(true)}>
                  {prefs ? 'Edit Preferences' : 'Set Preferences'}
                </button>
              </div>
              {recommended.length>0 ? (
                <div className="fs-reco-grid">
                  {recommended.map((scheme)=> (
                    <div key={`rec-${scheme.id||scheme._id}`} className={`fs-r-card`}> 
                      <div className="fs-r-title">{scheme.title}</div>
                      <div className="fs-r-meta">{scheme.agency || scheme.type}</div>
                      <div className="fs-r-tags" style={{marginTop:6}}>
                        {scheme.amount && <span className="fs-badge">{scheme.amount}</span>}
                        {scheme.type && <span className="fs-badge">{scheme.type}</span>}
                        {(scheme.tags||[]).slice(0,3).map((t,i)=>(<span key={i} className="fs-badge">{t}</span>))}
                      </div>
                      <div className="reco-actions">
                        <a className="fs-apply" href={scheme.url} target="_blank" rel="noopener noreferrer">Apply</a>
                        <button className="fs-secondary" onClick={()=>setOpenIds(prev=> new Set(prev).add(scheme.id||scheme._id))}>Open</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="fs-empty" style={{marginTop:8}}>
                  <div className="empty-title">No recommendations yet</div>
                  <div className="empty-sub">Set your preferences to get personalized results.</div>
                </div>
              )}
            </div>
          )}
          <div className="fs-statbar">
            <div className="fs-stat"><div className="st-num">{stats.total}</div><div className="st-label">Total Schemes</div></div>
            <div className="fs-stat"><div className="st-num">{stats.grants}</div><div className="st-label">Grants</div></div>
            <div className="fs-stat"><div className="st-num">{stats.closingSoon}</div><div className="st-label">Closing ≤30d</div></div>
          </div>
            <div className="fs-toolbar sticky">
            <div className="fs-toolbar-row">
              <input
                className="fs-input"
                placeholder="Search by keyword (e.g., Seed, AI, Student)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          <select className="fs-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="Grant">Grant</option>
                <option value="Funding">Funding</option>
                <option value="Competition">Competition</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Announcement">Announcement</option>
              </select>
          <select className="fs-select" value={audienceFilter} onChange={(e) => setAudienceFilter(e.target.value)}>
            <option value="all">All Audience</option>
            <option value="Student">Student</option>
            <option value="Women">Women</option>
            <option value="Tech">Tech</option>
            <option value="Early-stage">Early-stage</option>
          </select>
              <select className="fs-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="deadline">Deadline</option>
              </select>
            </div>
            <div className="fs-chips">
              <span className="chips-label">Quick Filters:</span>
              {['Grant','Funding','Competition'].map(t => (
                <button key={t} className={`fs-chip ${typeFilter===t?'active':''}`} onClick={()=>setTypeFilter(typeFilter===t?'all':t)}>{t}</button>
              ))}
              {['AI','BioTech','Electronics','Student'].map(sec => (
                <button key={sec} className={`fs-chip ${sectorFilter===sec?'active':''}`} onClick={()=>setSectorFilter(sectorFilter===sec?'all':sec)}>{sec}</button>
              ))}
            </div>
          </div>
          <div className="fs-container cards">
            {loading ? (
              [1,2,3,4].map((k)=>(
                <div key={k} className="fs-skel-card">
                  <div className="skel-line w-60" />
                  <div className="skel-line w-40" />
                  <div className="skel-line w-80" />
                </div>
              ))
            ) : (
              visible.length === 0 ? (
                <div className="fs-empty">
                  <div className="empty-title">No schemes found</div>
                  <div className="empty-sub">Try adjusting filters or keywords.</div>
                  <button className="fs-secondary" onClick={()=>{ setSearch(''); setTypeFilter('all'); setAudienceFilter('all'); setSectorFilter('all'); }}>Clear filters</button>
                </div>
              ) : (
                visible.map((scheme) => (
                  <SchemeItem
                    key={scheme.id || scheme._id}
                    scheme={scheme}
                    isOpen={openIds.has(scheme.id || scheme._id)}
                    onToggle={() => toggle(scheme.id || scheme._id)}
                    onPreview={(s)=>setPreview(s)}
                    isBookmarked={!!bookmarks[scheme.id || scheme._id]}
                    onToggleBookmark={()=>toggleBookmark(scheme.id || scheme._id, scheme.title)}
                  />
                ))
              )
            )}
          </div>
          <Modal open={!!preview} title={preview?.title || 'Scheme'} onClose={()=>setPreview(null)}>
            {preview && (
              <div>
                <p className="modal-text">{preview.description}</p>
                <div className="fs-r-tags" style={{ marginBottom: 8 }}>
                  {preview.type && <span className="fs-type-badge">{preview.type}</span>}
                  {preview.amount && <span className="fs-amount">{preview.amount}</span>}
                  {preview.agency && <span className="fs-agency">{preview.agency}</span>}
                  {preview.deadline && <span className="fs-deadline">{new Date(preview.deadline).toDateString()}</span>}
                </div>
                {Array.isArray(preview.tags) && preview.tags.length>0 && (
                  <div className="fs-r-tags">{preview.tags.map((t,i)=>(<span key={i} className="fs-badge">{t}</span>))}</div>
                )}
                <div className="modal-actions" style={{ marginTop: 10 }}>
                  <a className="fs-apply" href={preview.url} target="_blank" rel="noopener noreferrer">Apply Now</a>
                  <button className="fs-secondary" onClick={()=>toggleBookmark(preview.id || preview._id, preview.title)}>{bookmarks[preview?.id || preview?._id] ? 'Saved' : 'Save'}</button>
                </div>
              </div>
            )}
          </Modal>
          <Modal open={showPrefs} title="Your funding preferences" onClose={()=>setShowPrefs(false)}>
            <div className="tool-body">
              <label className="tool-label">Stage</label>
              <div className="tool-row">
                {['Student','Founder','Women'].map(opt=> (
                  <button key={opt} className={`fs-chip ${prefs?.stage===opt?'active':''}`} onClick={()=>setPrefs(prev=>({...prev, stage: opt}))}>{opt}</button>
                ))}
              </div>
              <label className="tool-label">Industry</label>
              <div className="tool-row" style={{flexWrap:'wrap'}}>
                {['AI','BioTech','Health','Fintech','Edtech','IoT','Electronics'].map(opt=> (
                  <button key={opt} className={`fs-chip ${prefs?.industry===opt?'active':''}`} onClick={()=>setPrefs(prev=>({...prev, industry: opt}))}>{opt}</button>
                ))}
              </div>
              <label className="tool-label">Location (optional)</label>
              <input className="fs-input" placeholder="e.g., Chennai" value={prefs?.location||''} onChange={(e)=>setPrefs(prev=>({...prev, location: e.target.value}))} />
              <div className="modal-actions">
                <button className="fs-secondary" onClick={()=>{ setPrefs(null); try{localStorage.removeItem(prefsKey);}catch{}; setShowPrefs(false);} }>Clear</button>
                <button className="fs-apply" onClick={()=>savePrefs(prefs || {})}>Save</button>
              </div>
            </div>
          </Modal>
        </>
      ) : activeTab === 'resources' ? (
        <ResourcesSection />
      ) : (
        <FounderTools />
      )}
    </div>
  );
}

// ---- Incubators & Resources Section ----
function ResourcesSection() {
  const [incubators, setIncubators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('latest');
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (location.trim()) params.location = location.trim();
        if (sort) params.sort = sort;
        const res = await axios.get('/api/incubators', { params });
        if (mounted && Array.isArray(res.data)) setIncubators(res.data);
      } catch {
        if (mounted) setIncubators([
          { _id: 'thub', icon: '🏢', name: 'T-Hub', location: 'Hyderabad', focus: ['Mentorship','Workspace','Investor Connect'], url: 'https://t-hub.co/' },
          { _id: 'iitm', icon: '🎓', name: 'IIT Madras Incubation Cell', location: 'Chennai', focus: ['Mentorship','Labs','Funding'], url: 'https://www.incubation.iitm.ac.in/' },
          { _id: 'nsrcel', icon: '📈', name: 'NSRCEL (IIM Bangalore)', location: 'Bengaluru', focus: ['Mentorship','Programs','Networking'], url: 'https://www.nsrcel.org/' },
        ]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [search, location, sort]);
  const toolkits = [
    { id: 'pitch', icon: '📘', title: 'Pitch Deck Templates', desc: 'Clean templates to tell your story and metrics.', url: 'https://www.canva.com/presentations/templates/pitch-deck/' },
    { id: 'mvp', icon: '🔧', title: 'MVP Guide', desc: 'Plan, scope and ship a minimum viable product.', url: 'https://www.productplan.com/learn/minimum-viable-product/' },
    { id: 'elearn', icon: '🧠', title: 'Govt e‑Learning for Startups', desc: 'MOOCs and courses curated for entrepreneurs.', url: 'https://www.startupindia.gov.in/content/sih/en/learning-development.html' },
    { id: 'video', icon: '🎥', title: 'Founder Talks & Playlists', desc: 'Watch inside the page.', url: 'https://www.youtube.com/embed/2a8-QqF5J1k' },
  ];
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div className="fs-resources">
      <section className="fs-section">
        <div className="fs-section-head">
          <h2>Startup Incubators</h2>
          <p>Apply to top incubators for mentorship, workspace, and funding support.</p>
        </div>
        <div className="fs-r-toolbar">
          <input className="fs-input" placeholder="Search incubators (e.g., labs, funding)" value={search} onChange={(e)=>setSearch(e.target.value)} />
          <input className="fs-input" placeholder="Location (e.g., Hyderabad)" value={location} onChange={(e)=>setLocation(e.target.value)} />
          <select className="fs-select" value={sort} onChange={(e)=>setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="fs-grid">
          {loading ? (
            [1,2,3,4].map(k => (
              <div key={k} className="fs-skel-card">
                <div className="skel-line w-60" />
                <div className="skel-line w-40" />
                <div className="skel-line w-80" />
              </div>
            ))
          ) : incubators.length === 0 ? (
            <div className="fs-empty">
              <div className="empty-title">No incubators found</div>
              <div className="empty-sub">Try a different keyword or location.</div>
              <button className="fs-secondary" onClick={()=>{ setSearch(''); setLocation(''); setSort('latest'); }}>Clear</button>
            </div>
          ) : (
            incubators.map((inc) => (
              <div key={inc._id || inc.id} className="fs-r-card">
                <div className="fs-r-icon">{inc.icon || '🏢'}</div>
                <div className="fs-r-title">{inc.name}</div>
                <div className="fs-r-meta">📍 {inc.location}</div>
                <div className="fs-r-tags">
                  {(inc.focus || inc.support || []).map((s, i) => (
                    <span key={i} className="fs-badge">{s}</span>
                  ))}
                </div>
                <a className="fs-apply" href={inc.url} target="_blank" rel="noopener noreferrer">Visit Website</a>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="fs-section">
        <div className="fs-section-head">
          <h2>Startup Toolkits & Learning</h2>
          <p>Curated guides, templates and video learning to move faster.</p>
        </div>
        <div className="fs-grid fs-grid-tools">
          {toolkits.map((t) => (
            t.id === 'video' ? (
              <button key={t.id} className="fs-tool" onClick={()=>setVideoOpen(true)}>
                <div className="fs-tool-icon">{t.icon}</div>
                <div className="fs-tool-title">{t.title}</div>
                <div className="fs-tool-desc">{t.desc}</div>
              </button>
            ) : (
              <a key={t.id} className="fs-tool" href={t.url} target="_blank" rel="noopener noreferrer">
                <div className="fs-tool-icon">{t.icon}</div>
                <div className="fs-tool-title">{t.title}</div>
                <div className="fs-tool-desc">{t.desc}</div>
              </a>
            )
          ))}
        </div>
        <Modal open={videoOpen} title="Founder Talks – Playlist" onClose={()=>setVideoOpen(false)}>
          <div style={{ position:'relative', paddingTop:'56.25%' }}>
            <iframe
              src={toolkits.find(t=>t.id==='video')?.url + '?rel=0'}
              title="Founder Talks"
              style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', border:0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </Modal>
      </section>
    </div>
  );
}

// ---- Founder Tools: validators, checklist, events, stories, timeline ----
function FounderTools() {
  return (
    <div className="fs-tools">
      <div className="fs-grid-2">
        <IdeaValidator />
        <PitchAnalyzer />
      </div>
      <div className="fs-grid-2">
        <DocumentChecklist />
        <EventsList />
      </div>
      <SuccessStories />
      <RoadmapTimeline />
    </div>
  );
}

function IdeaValidator() {
  const [answers, setAnswers] = useState({ problem: 'yes', users: '', competitors: '', unique: '' });
  const [result, setResult] = useState(null);
  const onChange = (e) => setAnswers({ ...answers, [e.target.name]: e.target.value });
  const validate = () => {
    let score = 0; const notes = [];
    if (answers.problem === 'yes') { score += 25; } else { notes.push('Clearly define the real problem to solve.'); }
    if (answers.users.trim().length >= 10) { score += 25; } else { notes.push('Specify your primary users and where to find them.'); }
    if (answers.competitors.trim().length >= 5) { score += 20; } else { notes.push('List 2–3 competing products to benchmark.'); }
    if (answers.unique.trim().length >= 10) { score += 30; } else { notes.push('Write 1–2 lines on what makes you different.'); }
    setResult({ score, notes });
  };
  return (
    <div className="fs-card tool">
      <div className="tool-head">🧠 Startup Idea Validator</div>
      <div className="tool-body">
        <label className="tool-label">Is your idea solving a real-world problem?</label>
        <div className="tool-row">
          <label><input type="radio" name="problem" value="yes" checked={answers.problem==='yes'} onChange={onChange}/> Yes</label>
          <label><input type="radio" name="problem" value="no" checked={answers.problem==='no'} onChange={onChange}/> No / Not sure</label>
        </div>
        <label className="tool-label">Who are your primary users/customers?</label>
        <input className="fs-input" name="users" value={answers.users} onChange={onChange} placeholder="e.g., College students preparing for exams" />
        <label className="tool-label">Known competitors</label>
        <input className="fs-input" name="competitors" value={answers.competitors} onChange={onChange} placeholder="e.g., App X, Website Y" />
        <label className="tool-label">What’s unique about your solution?</label>
        <textarea className="fs-input" rows={3} name="unique" value={answers.unique} onChange={onChange} placeholder="e.g., AI-first approach with offline mode" />
        <button className="fs-apply" onClick={validate}>Validate Idea</button>
        {result && (
          <div className="tool-result">
            <div className="tool-score">Score: {result.score}/100</div>
            {result.notes.length > 0 && (
              <ul className="tool-notes">
                {result.notes.map((n, i) => <li key={i}>• {n}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PitchAnalyzer() {
  const [text, setText] = useState('');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const downloadPdf = async () => {
    const content = `Pitch Analyzer Feedback\n\n${tips.map((t,i)=>`${i+1}. ${t}`).join('\n')}`;
    try {
      const mod = await import('jspdf');
      const { jsPDF } = mod;
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text('Investor Pitch Feedback', 14, 16);
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(content, 180);
      doc.text(lines, 14, 26);
      doc.save('pitch-feedback.pdf');
    } catch {
      // Fallback: download as .txt
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'pitch-feedback.txt'; a.click(); URL.revokeObjectURL(url);
    }
  };
  const analyzeLocal = (t) => {
    const out = [];
    if (t.length < 120) out.push('Add more details; aim for 3–5 concise sentences.');
    if (!/problem|pain|issue/i.test(t)) out.push('State the problem/pain clearly.');
    if (!/solution|we\s+build|we\s+offer/i.test(t)) out.push('Describe the solution in one line.');
    if (!/market|users|customers|TAM|SAM|SOM/i.test(t)) out.push('Mention target users/market.');
    if (!/traction|revenue|growth|users\b/i.test(t)) out.push('Add a traction proof (users, growth or revenue).');
    if (!/ask|raise|fund|plan/i.test(t)) out.push('Add an ask or next milestone.');
    return out.length ? out : ['Looks clear. Consider a 90‑sec demo video link.'];
  };
  const onAnalyze = async () => {
    if (!text.trim()) { setTips(['Paste your 3–5 sentence pitch.']); return; }
    setLoading(true);
    try {
      const prompt = `You are a startup pitch coach. Review this 3-5 sentence pitch and list 4 crisp improvement tips.\n\nPitch:\n${text}`;
      const res = await axios.post('/api/chat', { message: prompt });
      const reply = res?.data?.reply || '';
      const lines = reply.split(/\n+/).filter(Boolean).slice(0,6);
      setTips(lines.length ? lines : analyzeLocal(text));
    } catch {
      setTips(analyzeLocal(text));
    } finally { setLoading(false); }
  };
  return (
    <div className="fs-card tool">
      <div className="tool-head">📊 Investor Pitch Analyzer</div>
      <div className="tool-body">
        <textarea className="fs-input" rows={6} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste your 3–5 sentence pitch here" />
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button className="fs-apply" onClick={onAnalyze} disabled={loading}>{loading ? 'Analyzing...' : 'Analyze Pitch'}</button>
          {tips.length>0 && (
            <button className="fs-secondary" onClick={downloadPdf}>Download Feedback</button>
          )}
        </div>
        {tips.length>0 && (
          <ul className="tool-notes" style={{ marginTop: 8 }}>
            {tips.map((t,i)=>(<li key={i}>• {t}</li>))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DocumentChecklist() {
  const key = 'msx_doc_checklist';
  const items = [
    'Pitch Deck','MVP Plan','Founder Profile','Financial Projection','Govt Registration (Startup India, GST)'
  ];
  const [checked, setChecked] = useState(()=>{
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
  });
  const toggle = (label) => setChecked(prev=>{ const next={...prev, [label]: !prev[label]}; localStorage.setItem(key, JSON.stringify(next)); return next; });
  return (
    <div id="doc-checklist" className="fs-card tool">
      <div className="tool-head">📂 Startup Document Checklist</div>
      <div className="tool-body">
        {items.map((label)=>(
          <label key={label} className="check-row">
            <input type="checkbox" checked={!!checked[label]} onChange={()=>toggle(label)} /> {label}
          </label>
        ))}
      </div>
    </div>
  );
}

function EventsList() {
  const events = [
    { id:'e1', icon:'🎥', title:'Zero-to-One MVP Workshop', date:'Sat 10:00 IST', url:'https://www.f6s.com/programs' },
    { id:'e2', icon:'📢', title:'Startup India – Funding 101', date:'Wed 19:00 IST', url:'https://www.startupindia.gov.in/' },
  ];
  const [rsvp, setRsvp] = useState(null);
  const [email, setEmail] = useState('');
  const doRsvp = async () => {
    if (!rsvp) return;
    try { await axios.post('/api/notify', { email, topic: 'event', meta: { id: rsvp.id, title: rsvp.title } }); setRsvp(null); setEmail(''); alert('RSVP confirmed! We will remind you.'); } catch { alert('Failed. Please try again.'); }
  };
  return (
    <div className="fs-card tool">
      <div className="tool-head">📺 Live Webinars & Events</div>
      <div className="tool-body">
        {events.map(e => (
          <div key={e.id} className="event-row" style={{ gap: 8 }}>
            <a className="ev-ic" href={e.url} target="_blank" rel="noopener noreferrer" title="Open details">{e.icon}</a>
            <span className="ev-title" style={{ flex:1 }}>{e.title}</span>
            <span className="ev-date">{e.date}</span>
            <button className="fs-apply" onClick={()=>setRsvp(e)}>RSVP</button>
          </div>
        ))}
      </div>
      <Modal open={!!rsvp} title={rsvp?.title || 'RSVP'} onClose={()=>setRsvp(null)}>
        <p className="modal-text">Enter your email and we’ll remind you before the event.</p>
        <input className="fs-input" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div className="modal-actions">
          <button className="fs-apply" onClick={doRsvp}>Save my seat</button>
        </div>
      </Modal>
    </div>
  );
}

function SuccessStories() {
  const stories = [
    { id:'s1', name:'Zerodha', logo:'https://upload.wikimedia.org/wikipedia/commons/2/2c/Zerodha_logo.svg',
      line:'Bootstrapped fintech scaled with product-first approach.',
      body:`Zerodha grew without external funding by obsessing over customer experience, low fees, and a reliable platform.\n\nKey takeaways:\n- Focus on reliability and trust in regulated markets\n- Word-of-mouth can beat ad spend when the product clicks\n- Monetize with transparent pricing` },
    { id:'s2', name:'boAt', logo:'https://upload.wikimedia.org/wikipedia/commons/3/35/BoAt_Logo.png',
      line:'Brand-led D2C growth with community and pricing moat.',
      body:`boAt built a strong brand with community, influencers, and aspirational design at affordable pricing.\n\nKey takeaways:\n- Nail positioning for your target persona\n- Use creator economy for efficient CAC\n- Launch fast, iterate colors and SKUs` },
    { id:'s3', name:'Mamaearth', logo:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Mamaearth_logo.png',
      line:'Trust, certifications and influencer-led scale.',
      body:`Mamaearth leveraged trust (toxin-free, certifications) plus influencer content to win parents.\n\nKey takeaways:\n- Proof (certs/reviews) reduces friction\n- Content-led education drives intent\n- Expand from hero product to lines` },
  ];
  const [open, setOpen] = useState(null);
  return (
    <section className="fs-stories">
      <h3>📌 Startup Success Stories</h3>
      <div className="fs-grid">
        {stories.map(s => (
          <div key={s.id} className="story-card">
            <div className="story-front">
              <img className="story-logo" src={s.logo} alt={s.name} onError={(e)=>{e.currentTarget.style.display='none'}} />
              <div className="fs-r-title">{s.name}</div>
              <div className="fs-tool-desc">{s.line}</div>
              <button className="fs-apply" onClick={()=>setOpen(s)}>Learn from this journey</button>
            </div>
          </div>
        ))}
      </div>
      <Modal open={!!open} title={open?.name} onClose={()=>setOpen(null)}>
        <p style={{ whiteSpace:'pre-wrap' }}>{open?.body}</p>
      </Modal>
    </section>
  );
}

function RoadmapTimeline() {
  const activeKey = 'msx_roadmap_active';
  const topicsKey = 'msx_roadmap_topics';
  const steps = [
    { ic:'🧠', label:'Idea', desc:'Define the core problem and who faces it. Capture 1‑2 use cases and success criteria.', linkText:'Idea tips', link:'https://www.ycombinator.com/library/4p-how-to-get-startup-ideas', topics:[
      { name:'Write problem statement (1–2 lines)', tag:'core' },
      { name:'Define target persona', tag:'research' },
      { name:'List success metric', tag:'core' },
    ]},
    { ic:'📃', label:'Research', desc:'Talk to 10–20 target users. Map alternatives and pricing. Identify must‑have vs nice‑to‑have.', linkText:'Customer discovery', link:'https://www.strategyzer.com/library/customer-development', topics:[
      { name:'Interview 10 users', tag:'research' },
      { name:'Competitive scan (3 players)', tag:'research' },
      { name:'Willingness-to-pay notes', tag:'research' },
    ]},
    { ic:'🛠', label:'MVP', desc:'Ship a minimum set of features solving one job. Measure activation and weekly retention.', linkText:'MVP guide', link:'https://www.productplan.com/learn/minimum-viable-product/', topics:[
      { name:'Scope MVP (3 bullets)', tag:'build' },
      { name:'Implement core flow', tag:'build' },
      { name:'Define activation metric', tag:'core' },
    ]},
    { ic:'📣', label:'Marketing', desc:'Pick 1–2 channels. Create a landing page, run small tests, iterate messaging.', linkText:'Go‑to‑market', link:'https://www.reforge.com/blog/go-to-market', topics:[
      { name:'Landing page + waitlist', tag:'marketing' },
      { name:'Choose 1 channel to test', tag:'marketing' },
      { name:'Draft 3 ad/messages', tag:'marketing' },
    ]},
    { ic:'💰', label:'Funding', desc:'Prepare a crisp deck, record a 90‑sec demo. Line up warm intros and small pilot customers.', linkText:'Pitch templates', link:'https://www.canva.com/presentations/templates/pitch-deck/', topics:[
      { name:'10‑slide deck', tag:'core' },
      { name:'90‑sec demo video', tag:'build' },
      { name:'List 5 warm intros', tag:'marketing' },
    ]},
  ];

  const [active, setActive] = useState(() => {
    try { const i = Number(localStorage.getItem(activeKey)); return Number.isFinite(i)? Math.min(Math.max(i,0), steps.length-1) : 0; } catch { return 0; }
  });
  const [topicsDone, setTopicsDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(topicsKey)) || {}; } catch { return {}; }
  });

  const onPick = (i) => { setActive(i); try { localStorage.setItem(activeKey, String(i)); } catch {} };
  const toggleTopic = (stepIndex, topicIndex) => {
    setTopicsDone(prev => {
      const current = { ...(prev || {}) };
      const step = current[stepIndex] || {};
      const next = { ...current, [stepIndex]: { ...step, [topicIndex]: !step[topicIndex] } };
      try { localStorage.setItem(topicsKey, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const current = steps[active];
  const doneCount = Object.values(topicsDone[active] || {}).filter(Boolean).length;
  const totalCount = current.topics.length;
  const pct = totalCount ? (doneCount / totalCount) * 100 : 0;

  const scrollChecklist = () => {
    const el = document.getElementById('doc-checklist');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [tipsOpen, setTipsOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const tipsText = `Quick tips for ${current.label}:\n- Keep it simple\n- Measure one core metric\n- Talk to users weekly`;
  const copy = async (text) => { try { await navigator.clipboard.writeText(text); } catch {} };
  const download = (filename, text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="fs-roadmap">
      <h3>🧭 Startup Roadmap</h3>
      <div className="rm-rail">
        <div className="rm-nodes">
          <div className="rm-connector" />
          {steps.map((s,i)=> (
            <div key={i} className={`rm-node ${i===active?'active':''}`} onClick={()=>onPick(i)}>
              <div className="rm-dot" title={s.label} />
              <div className="rm-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="rm-panel">
        <div className="rm-title">{current.ic} {current.label}</div>
        <div className="rm-desc">{current.desc}</div>
        <div className="rm-meta">
          <div className="rm-progress" style={{ flex: 1 }}>
            <div className="rm-progress-bar" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ marginLeft: 8, fontWeight: 700 }}>{Math.round(pct)}%</div>
        </div>
        <div className="rm-topics">
          {current.topics.map((t, idx) => {
            const done = !!(topicsDone[active] && topicsDone[active][idx]);
            return (
              <div key={idx} className="rm-topic">
                <div className="rm-left">
                  <button className={`rm-check ${done? 'done':''}`} onClick={()=>toggleTopic(active, idx)}>{done ? '✓' : ''}</button>
                  <div className="rm-name">{t.name}</div>
                </div>
                <div className="rm-right">
                  <span className={`rm-tag ${t.tag}`}>{t.tag.charAt(0).toUpperCase()+t.tag.slice(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="panel-actions" style={{ marginTop: 10 }}>
          <button className="fs-apply" onClick={()=>setTipsOpen(true)}>{current.linkText}</button>
          <button className="fs-apply" onClick={()=>setCheckOpen(true)}>Open Checklist</button>
        </div>
      </div>
      <Modal open={tipsOpen} title={`${current.label} – Tips`} onClose={()=>setTipsOpen(false)}>
        <p className="modal-text">{current.desc}</p>
        <p className="modal-text">{tipsText}</p>
        <div className="modal-actions">
          <button className="fs-apply" onClick={()=>copy(`${current.desc}\n\n${tipsText}`)}>Copy</button>
          <button className="fs-apply" onClick={()=>download(`${current.label}-tips.txt`, `${current.desc}\n\n${tipsText}`)}>Download</button>
          <a className="fs-apply" href={current.link} target="_blank" rel="noopener noreferrer">Open Guide</a>
        </div>
      </Modal>
      <Modal open={checkOpen} title="Startup Checklist" onClose={()=>setCheckOpen(false)}>
        <ul className="tool-notes">
          <li>Pitch Deck (10–12 slides)</li>
          <li>MVP Plan (scope, success metric)</li>
          <li>Founder Profile (bio, roles)</li>
          <li>Financial Projection (12–18 months)</li>
          <li>Govt Registration (Startup India, GST)</li>
        </ul>
        <div className="modal-actions">
          <button className="fs-apply" onClick={()=>copy('Pitch Deck\nMVP Plan\nFounder Profile\nFinancial Projection\nGovt Registration')}>Copy</button>
          <button className="fs-apply" onClick={()=>download('startup-checklist.txt','Pitch Deck\nMVP Plan\nFounder Profile\nFinancial Projection\nGovt Registration')}>Download</button>
          <button className="fs-apply" onClick={scrollChecklist}>Go to Checklist</button>
        </div>
      </Modal>
    </section>
  );
}

// Generic Modal
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fs-modal-overlay" onClick={onClose}>
      <div className="fs-modal" onClick={e=>e.stopPropagation()}>
        <div className="fs-modal-head">
          <div className="fs-modal-title">{title}</div>
          <button className="fs-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="fs-modal-body">{children}</div>
      </div>
    </div>
  );
}

function NotifyMeButton({ scheme }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const submit = async () => {
    try { await axios.post('/api/notify', { email, topic: 'scheme', meta: { id: scheme.id || scheme._id, title: scheme.title } }); setOpen(false); setEmail(''); alert('Subscribed! We will notify you.'); } catch { alert('Failed. Please try again.'); }
  };
  return (
    <>
      <button className="fs-apply" onClick={()=>setOpen(true)}>Notify Me</button>
      <Modal open={open} title="Get notified" onClose={()=>setOpen(false)}>
        <p className="modal-text">Enter your email to receive updates for {scheme.title}.</p>
        <input className="fs-input" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div className="modal-actions">
          <button className="fs-apply" onClick={submit}>Subscribe</button>
        </div>
      </Modal>
    </>
  );
}


