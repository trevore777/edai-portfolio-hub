'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { repos, categories } from './data';
import './styles.css';

const STORAGE_KEY = 'trevore77-repository-admin-metadata-v1';
const statusOptions = ['Production', 'Development', 'Prototype', 'Paused', 'Superseded'];
const hostingOptions = ['AWS', 'Vercel', 'Local', 'Other'];
const databaseOptions = ['PostgreSQL', 'Neon', 'RDS', 'none'];
const priorityOptions = ['High', 'Normal', 'Low'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibility, setVisibility] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState({});
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMetadata(JSON.parse(saved));
    } catch {}
  }, []);

  function details(repo) {
    return {
      status: repo.status || 'Prototype',
      hosting: repo.hosting || 'Other',
      live: repo.live || '',
      database: repo.database || 'none',
      lastWorkedOn: repo.lastWorkedOn || '',
      notes: repo.notes || '',
      priority: repo.priority || 'Normal',
      ...(metadata[repo.name] || {})
    };
  }

  const enrichedRepos = useMemo(() => repos.map(repo => ({ ...repo, ...details(repo) })), [metadata]);

  const filtered = useMemo(() => enrichedRepos.filter(r => {
    const haystack = `${r.name} ${r.category} ${r.status} ${r.hosting} ${r.database} ${r.notes} ${r.priority}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    const matchesCategory = category === 'All' || r.category === category;
    const matchesVisibility = visibility === 'all' || r.visibility === visibility;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    return matchesQuery && matchesCategory && matchesVisibility && matchesStatus && matchesPriority;
  }), [enrichedRepos, query, category, visibility, statusFilter, priorityFilter]);

  async function openReadme(repo) {
    setSelected(repo);
    setReadme('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/readme?repo=${encodeURIComponent(repo.name)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'README could not be loaded.');
      setReadme(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(repo) {
    const current = details(repo);
    setEditing(repo);
    setEditForm({ ...current });
  }

  function saveEdit() {
    if (!editing || !editForm) return;
    const next = { ...metadata, [editing.name]: editForm };
    setMetadata(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEditing(null);
    setEditForm(null);
  }

  function clearLocalEdit() {
    if (!editing) return;
    const next = { ...metadata };
    delete next[editing.name];
    setMetadata(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEditing(null);
    setEditForm(null);
  }

  const counts = {
    total: repos.length,
    production: enrichedRepos.filter(r => r.status === 'Production').length,
    development: enrichedRepos.filter(r => r.status === 'Development').length,
    high: enrichedRepos.filter(r => r.priority === 'High').length
  };

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">EDU Apps Plus · TrevorE77</p>
          <h1>Repository Administration Hub</h1>
          <p className="subtitle">A searchable project control centre for your GitHub repositories, deployments, databases, priorities, notes and README files.</p>
        </div>
        <a className="githubButton" href="https://github.com/trevore777" target="_blank" rel="noreferrer">Open GitHub profile ↗</a>
      </header>

      <section className="stats">
        <Stat label="Repositories" value={counts.total} />
        <Stat label="Production" value={counts.production} />
        <Stat label="In development" value={counts.development} />
        <Stat label="High priority" value={counts.high} />
      </section>

      <section className="controls controlsExpanded">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search repositories, status, hosting, notes…" aria-label="Search repositories" />
        <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="all">All status</option>
          {statusOptions.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={visibility} onChange={e => setVisibility(e.target.value)} aria-label="Filter by visibility">
          <option value="all">All visibility</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} aria-label="Filter by priority">
          <option value="all">All priority</option>
          {priorityOptions.map(p => <option key={p}>{p}</option>)}
        </select>
      </section>

      <div className="resultLine">Showing <strong>{filtered.length}</strong> of {repos.length} repositories · edits are saved on this device</div>

      <section className="grid">
        {filtered.map(repo => (
          <article className={`card ${repo.priority === 'High' ? 'highPriority' : ''}`} key={repo.name}>
            <div className="cardTop">
              <span className="category">{repo.category}</span>
              <div className="topBadges">
                {repo.priority === 'High' && <span className="badge priority">Priority</span>}
                <span className={`badge ${repo.visibility}`}>{repo.visibility}</span>
              </div>
            </div>
            <h2>{repo.name}</h2>

            <div className="projectMeta">
              <Meta label="Status"><span className={`statusPill status-${slug(repo.status)}`}>{repo.status}</span></Meta>
              <Meta label="Hosting">{repo.hosting}</Meta>
              <Meta label="Database">{repo.database}</Meta>
              <Meta label="Last worked on">{repo.lastWorkedOn || 'Not recorded'}</Meta>
              <Meta label="Live URL" wide>{repo.live ? <a href={repo.live} target="_blank" rel="noreferrer">{cleanUrl(repo.live)} ↗</a> : <span className="muted">Not set</span>}</Meta>
              <Meta label="Notes / To-do" wide><span className={repo.notes ? '' : 'muted'}>{repo.notes || 'No notes yet'}</span></Meta>
            </div>

            <div className="actions">
              {repo.live && <a className="primary" href={repo.live} target="_blank" rel="noreferrer">Open app ↗</a>}
              <a href={repo.repoUrl} target="_blank" rel="noreferrer">Repository ↗</a>
              <button onClick={() => openReadme(repo)}>Read README</button>
              <button className="editButton" onClick={() => startEdit(repo)}>Edit details</button>
            </div>
          </article>
        ))}
      </section>

      {selected && (
        <div className="overlay" onMouseDown={() => setSelected(null)}>
          <section className="modal" onMouseDown={e => e.stopPropagation()}>
            <div className="modalHead">
              <div><p className="eyebrow">README</p><h2>{selected.name}</h2></div>
              <button className="close" onClick={() => setSelected(null)}>Close</button>
            </div>
            <div className="readme">
              {loading && <p>Loading README…</p>}
              {error && <div className="error"><p>{error}</p><a href={`${selected.repoUrl}#readme`} target="_blank" rel="noreferrer">Open README in GitHub ↗</a></div>}
              {!loading && !error && <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>}
            </div>
          </section>
        </div>
      )}

      {editing && editForm && (
        <div className="overlay" onMouseDown={() => setEditing(null)}>
          <section className="editModal" onMouseDown={e => e.stopPropagation()}>
            <div className="modalHead">
              <div><p className="eyebrow">Project administration</p><h2>{editing.name}</h2></div>
              <button className="close" onClick={() => setEditing(null)}>Close</button>
            </div>
            <div className="editBody">
              <label>Status<select value={editForm.status} onChange={e => setEditForm({...editForm,status:e.target.value})}>{statusOptions.map(v => <option key={v}>{v}</option>)}</select></label>
              <label>Hosting<select value={editForm.hosting} onChange={e => setEditForm({...editForm,hosting:e.target.value})}>{hostingOptions.map(v => <option key={v}>{v}</option>)}</select></label>
              <label>Database<select value={editForm.database} onChange={e => setEditForm({...editForm,database:e.target.value})}>{databaseOptions.map(v => <option key={v}>{v}</option>)}</select></label>
              <label>Priority<select value={editForm.priority} onChange={e => setEditForm({...editForm,priority:e.target.value})}>{priorityOptions.map(v => <option key={v}>{v}</option>)}</select></label>
              <label className="wideField">Live URL<input value={editForm.live} onChange={e => setEditForm({...editForm,live:e.target.value})} placeholder="https://…" /></label>
              <label>Last worked on<input type="date" value={editForm.lastWorkedOn} onChange={e => setEditForm({...editForm,lastWorkedOn:e.target.value})} /></label>
              <label className="wideField">Notes / To-do<textarea rows="5" value={editForm.notes} onChange={e => setEditForm({...editForm,notes:e.target.value})} placeholder="Next changes, deployment notes, issues, ideas…" /></label>
            </div>
            <div className="editActions">
              <button className="dangerButton" onClick={clearLocalEdit}>Reset to defaults</button>
              <div><button onClick={() => setEditing(null)}>Cancel</button><button className="saveButton" onClick={saveEdit}>Save details</button></div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }
function Meta({ label, children, wide = false }) { return <div className={`metaItem ${wide ? 'metaWide' : ''}`}><span className="metaLabel">{label}</span><div>{children}</div></div>; }
function slug(value='') { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
function cleanUrl(url='') { return url.replace(/^https?:\/\//, '').replace(/\/$/, ''); }
