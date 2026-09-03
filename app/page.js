'use client';

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { repos, categories } from './data';
import './styles.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibility, setVisibility] = useState('all');
  const [selected, setSelected] = useState(null);
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const filtered = useMemo(() => repos.filter(r => {
    const matchesQuery = `${r.name} ${r.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === 'All' || r.category === category;
    const matchesVisibility = visibility === 'all' || r.visibility === visibility;
    return matchesQuery && matchesCategory && matchesVisibility;
  }), [query, category, visibility]);

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

  const counts = {
    total: repos.length,
    private: repos.filter(r => r.visibility === 'private').length,
    public: repos.filter(r => r.visibility === 'public').length,
    live: repos.filter(r => r.live).length
  };

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">EDU Apps Plus · TrevorE77</p>
          <h1>Repository Administration Hub</h1>
          <p className="subtitle">A searchable catalogue of your GitHub projects, grouped by purpose, with direct app, repository and README access.</p>
        </div>
        <a className="githubButton" href="https://github.com/trevore777" target="_blank" rel="noreferrer">Open GitHub profile ↗</a>
      </header>

      <section className="stats">
        <Stat label="Repositories" value={counts.total} />
        <Stat label="Private" value={counts.private} />
        <Stat label="Public" value={counts.public} />
        <Stat label="Known live apps" value={counts.live} />
      </section>

      <section className="controls">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search repositories or categories…" aria-label="Search repositories" />
        <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Filter by category">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={visibility} onChange={e => setVisibility(e.target.value)} aria-label="Filter by visibility">
          <option value="all">All visibility</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </section>

      <div className="resultLine">Showing <strong>{filtered.length}</strong> of {repos.length} repositories</div>

      <section className="grid">
        {filtered.map(repo => (
          <article className="card" key={repo.name}>
            <div className="cardTop">
              <span className="category">{repo.category}</span>
              <span className={`badge ${repo.visibility}`}>{repo.visibility}</span>
            </div>
            <h2>{repo.name}</h2>
            <div className="actions">
              {repo.live && <a className="primary" href={repo.live} target="_blank" rel="noreferrer">Open app ↗</a>}
              <a href={repo.repoUrl} target="_blank" rel="noreferrer">Repository ↗</a>
              <button onClick={() => openReadme(repo)}>Read README</button>
            </div>
          </article>
        ))}
      </section>

      {selected && (
        <div className="overlay" onMouseDown={() => setSelected(null)}>
          <section className="modal" onMouseDown={e => e.stopPropagation()}>
            <div className="modalHead">
              <div>
                <p className="eyebrow">README</p>
                <h2>{selected.name}</h2>
              </div>
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
    </main>
  );
}

function Stat({ label, value }) {
  return <div className="stat"><strong>{value}</strong><span>{label}</span></div>;
}
