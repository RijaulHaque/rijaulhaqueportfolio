import { useState, useEffect, useRef, useCallback } from 'react';
import { Calendar, NotebookPen, ThumbsUp, ThumbsDown, Share2, Eye, X, ChevronLeft, ChevronRight, Play, Languages, Loader2 } from 'lucide-react';
import journalData from '../data/journal.json';

/* ── Selection Translator ────────────────────────────── */
// Wraps children; any text selected inside triggers a translate bubble.
function SelectionTranslator({ children }) {
  const containerRef = useRef(null);
  const [bubble, setBubble]   = useState(null); // { x, y, text }
  const [result, setResult]   = useState(null); // translated string
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const dismiss = useCallback(() => {
    setBubble(null); setResult(null); setError(null);
  }, []);

  useEffect(() => {
    const onMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) { dismiss(); return; }

      // Only trigger if selection is inside our container
      const range = sel.getRangeAt(0);
      if (!containerRef.current?.contains(range.commonAncestorContainer)) return;

      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setBubble({
        // Position relative to the container so it scrolls with it
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top  - containerRect.top  - 12, // 12px above selection
        text: sel.toString().trim(),
      });
      setResult(null);
      setError(null);
    };

    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [dismiss]);

  const translate = async () => {
    if (!bubble) return;
    setLoading(true); setError(null);
    try {
      // MyMemory free API — 5 000 chars/day, no key needed
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(bubble.text)}&langpair=as|en`;
      const res  = await fetch(url);
      const data = await res.json();
      const tx   = data?.responseData?.translatedText;
      if (tx) setResult(tx);
      else setError('No translation found.');
    } catch {
      setError('Translation failed. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {children}

      {/* Floating bubble */}
      {bubble && (
        <div
          className="absolute z-50 flex flex-col items-center"
          style={{
            left:      bubble.x,
            top:       bubble.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {/* Arrow tip */}
          <div
            className="w-3 h-3 rotate-45 bg-primary absolute -bottom-1.5 left-1/2 -translate-x-1/2"
            style={{ zIndex: -1 }}
          />

          <div className="bg-primary text-primary-foreground rounded-none shadow-[4px_4px_0px_var(--shadow-color)] min-w-[220px] max-w-[320px] border-2 border-primary">
            {/* Bubble header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-primary-foreground/20">
              <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest">
                <Languages size={13} /> Translate
              </span>
              <button onClick={dismiss} className="hover:opacity-70 transition-opacity">
                <X size={14} />
              </button>
            </div>

            {/* Selected text preview */}
            <div className="px-3 py-2 text-sm font-semibold italic border-b border-primary-foreground/20 truncate opacity-80">
              "{bubble.text.length > 40 ? bubble.text.slice(0, 40) + '…' : bubble.text}"
            </div>

            {/* Translation result or action */}
            <div className="px-3 py-2">
              {!result && !loading && !error && (
                <button
                  onClick={translate}
                  className="w-full text-sm font-bold py-1.5 border border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  Translate → English
                </button>
              )}
              {loading && (
                <div className="flex items-center gap-2 text-sm font-semibold py-1">
                  <Loader2 size={14} className="animate-spin" /> Translating…
                </div>
              )}
              {result && (
                <p className="text-sm font-bold leading-snug py-1">{result}</p>
              )}
              {error && (
                <p className="text-xs text-red-300 font-semibold py-1">{error}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Storage helpers ──────────────────────────────────────── */
const getLS = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const setLS = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

/* ── Admin Mode Editor ───────────────────────────────── */
function AdminEditor({ onCancel, onSuccess }) {
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({ title: '', tags: '', content: '', media: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/add-journal-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to publish');

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMediaField = () => {
    setFormData(prev => ({ 
      ...prev, 
      media: [...prev.media, { type: 'image', src: '', caption: '' }] 
    }));
  };

  return (
    <div className="bg-card border-4 border-primary p-6 md:p-10 mb-12 shadow-[8px_8px_0px_var(--shadow-color)] animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-8 border-b-2 border-primary pb-4">
        <h2 className="text-3xl font-extrabold uppercase text-primary">New Journal Entry</h2>
        <button onClick={onCancel} className="text-primary hover:text-red-500 transition-colors"><X size={28} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">Admin Password</label>
          <input 
            type="password" 
            required 
            className="w-full bg-background border-2 border-primary p-3 font-bold focus:shadow-[4px_4px_0px_var(--primary-color)] outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Title</label>
            <input 
              required 
              className="w-full bg-background border-2 border-primary p-3 font-bold uppercase"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Tags (Comma separated)</label>
            <input 
              className="w-full bg-background border-2 border-primary p-3 font-bold"
              placeholder="AI, Research, Personal"
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">Content</label>
          <textarea 
            required 
            rows={6}
            className="w-full bg-background border-2 border-primary p-3 font-bold leading-relaxed"
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div className="border-t-2 border-primary/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold uppercase tracking-wider">Media Attachments (Optional URLs)</label>
            <button 
              type="button"
              onClick={addMediaField}
              className="px-4 py-1.5 border-2 border-primary bg-primary text-primary-foreground font-extrabold text-xs uppercase hover:opacity-80 transition-opacity"
            >
              + Add Media
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.media.map((m, i) => (
              <div key={i} className="flex flex-wrap gap-4 p-4 border-2 border-primary/20 bg-primary/5">
                <select 
                  className="bg-background border-2 border-primary p-2 font-bold text-xs"
                  value={m.type}
                  onChange={e => {
                    const next = [...formData.media];
                    next[i].type = e.target.value;
                    setFormData({...formData, media: next});
                  }}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
                <input 
                  placeholder="Source URL (https://...)"
                  className="flex-1 bg-background border-2 border-primary p-2 font-bold text-xs min-w-[200px]"
                  value={m.src}
                  onChange={e => {
                    const next = [...formData.media];
                    next[i].src = e.target.value;
                    setFormData({...formData, media: next});
                  }}
                />
                <button 
                  type="button"
                  onClick={() => {
                    const next = formData.media.filter((_, idx) => idx !== i);
                    setFormData({...formData, media: next});
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 p-4 text-red-500 font-bold flex items-center gap-3">
            <X size={20} /> {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-4 font-black text-xl uppercase tracking-[0.2em] shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] active:translate-y-0 disabled:opacity-50 transition-all"
        >
          {loading ? 'Publishing via GitHub...' : 'Publish to Journal'}
        </button>
      </form>
    </div>
  );
}

/* ── Lightweight lightbox ────────────────────────────────── */
function Lightbox({ items, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const item = items[idx];
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 hover:text-primary transition-colors"><X size={32} /></button>
      {items.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white p-3 hover:text-primary transition-colors"><ChevronLeft size={36} /></button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-12 text-white p-3 hover:text-primary transition-colors"><ChevronRight size={36} /></button>
        </>
      )}
      <div className="max-w-4xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
        {item.type === 'video'
          ? <video src={item.src} controls className="max-h-[80vh] mx-auto rounded" />
          : <img src={item.src} alt={item.caption || ''} className="max-h-[80vh] mx-auto object-contain" />}
        {item.caption && <p className="text-center text-white/70 text-sm mt-3 font-semibold">{item.caption}</p>}
        <p className="text-center text-white/40 text-xs mt-1">{idx + 1} / {items.length}</p>
      </div>
    </div>
  );
}

/* ── Single journal entry card ───────────────────────────── */
/* ── Single journal entry card ───────────────────────────── */
function JournalEntry({ entry }) {
  const key = `journal_${entry.id}`;

  /* Views — increment once per browser session per entry */
  const [views, setViews] = useState(() => getLS(`${key}_views`, 0));
  useEffect(() => {
    const seen = sessionStorage.getItem(`${key}_seen`);
    if (!seen) {
      const next = views + 1;
      setViews(next);
      setLS(`${key}_views`, next);
      sessionStorage.setItem(`${key}_seen`, '1');
    }
  }, []);

  /* Likes / Dislikes */
  const [vote, setVote] = useState(() => getLS(`${key}_vote`, null)); 
  const [likes, setLikes] = useState(() => getLS(`${key}_likes`, 0));
  const [dislikes, setDislikes] = useState(() => getLS(`${key}_dislikes`, 0));

  const handleVote = (type) => {
    let newLikes = likes, newDislikes = dislikes, newVote = vote;
    if (vote === type) {
      if (type === 'like') newLikes--;
      else newDislikes--;
      newVote = null;
    } else {
      if (vote === 'like') newLikes--;
      if (vote === 'dislike') newDislikes--;
      if (type === 'like') newLikes++;
      else newDislikes++;
      newVote = type;
    }
    setLikes(newLikes); setDislikes(newDislikes); setVote(newVote);
    setLS(`${key}_likes`, newLikes); setLS(`${key}_dislikes`, newDislikes); setLS(`${key}_vote`, newVote);
  };

  /* Share */
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    const url = `${window.location.origin}/journal#entry-${entry.id}`;
    const text = `"${entry.title}" — Rijaul Haque's Journal`;
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* Media lightbox */
  const [lightbox, setLightbox] = useState(null);
  const media = entry.media || [];

  return (
    <div id={`entry-${entry.id}`} className="relative pl-8 md:pl-12">
      {/* Timeline Dot */}
      <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full border-[3px] border-primary bg-background" />

      <div className="bg-secondary border-2 border-primary p-8 shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all">

        {/* Header row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center text-sm font-bold text-primary border border-primary px-3 py-1 bg-card">
            <Calendar size={16} className="mr-2" />
            {entry.date}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-primary/60">
            <Eye size={15} />
            <span>{views} {views === 1 ? 'view' : 'views'}</span>
          </div>
          <div className="flex flex-wrap gap-2 ml-auto">
            {entry.tags.map(tag => (
              <span key={tag} className="text-xs font-extrabold text-primary/60 uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
        </div>

        <SelectionTranslator>
          {/* Title */}
          <h3 className="text-2xl font-extrabold mb-4 text-primary uppercase">{entry.title}</h3>
        
          {/* Content */}
          <p className="text-primary/80 leading-relaxed font-semibold text-justify text-lg mb-6">
            {entry.content}
          </p>
        
          {/* ── NEW: Stylized Author & Metadata Block ── */}
          {(entry.author || entry.location) && (
            <div className="mb-6 flex flex-wrap gap-4 items-center py-3 border-y-2 border-primary/10 bg-primary/5 px-4">
              {entry.author && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-primary/40">Author</span>
                  <span className="text-sm font-black text-primary uppercase">{entry.author}</span>
                </div>
              )}
              {entry.location && (
                <div className="flex items-center gap-2 border-l-2 border-primary/20 pl-4">
                  <span className="text-[10px] font-black uppercase tracking-tighter text-primary/40">Location</span>
                  <span className="text-sm font-bold text-primary/70">{entry.location}</span>
                </div>
              )}
            </div>
          )}
        </SelectionTranslator>
        
        {/* ── External Resource Link (As a Button) ── */}
        {entry.external_resource && (
          <div className="mb-8">
            <a 
              href={entry.external_resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary bg-primary text-primary-foreground font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <Share2 size={14} />
              {entry.external_resource.label || 'Read Reference'}
            </a>
          </div>
        )}

        {/* ── NEW: External Resource Link ────────────────── */}
        {entry.external_resource && (
          <div className="mb-8">
            <a 
              href={entry.external_resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary bg-primary text-primary-foreground font-black uppercase text-xs tracking-wider shadow-[4px_4px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <Share2 size={14} />
              {entry.external_resource.label || 'Read Reference'}
            </a>
          </div>
        )}

        {/* ── Media gallery ──────────────────────────────── */}
        {media.length > 0 && (
          <div className={`grid gap-3 mb-6 ${media.length === 1 ? 'grid-cols-1' : media.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {media.map((item, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="relative overflow-hidden border-2 border-primary aspect-video group/thumb"
              >
                {item.type === 'video'
                  ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <video src={item.src} className="w-full h-full object-cover opacity-70" />
                      <Play size={36} className="absolute text-white drop-shadow-lg" />
                    </div>
                  )
                  : <img src={item.src} alt={item.caption || `media-${i}`} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300" />
                }
              </button>
            ))}
          </div>
        )}

        {/* ── Action bar ─────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-4 border-t border-primary/20">
          <button
            onClick={() => handleVote('like')}
            className={`flex items-center gap-2 px-4 py-2 border-2 font-bold text-sm transition-all active:translate-y-0.5
              ${vote === 'like'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-primary text-primary hover:bg-primary/10'}`}
          >
            <ThumbsUp size={16} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => handleVote('dislike')}
            className={`flex items-center gap-2 px-4 py-2 border-2 font-bold text-sm transition-all active:translate-y-0.5
              ${vote === 'dislike'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-primary text-primary hover:bg-primary/10'}`}
          >
            <ThumbsDown size={16} />
            <span>{dislikes}</span>
          </button>

          <button
            onClick={handleShare}
            className="ml-auto flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary font-bold text-sm hover:bg-primary/10 transition-all active:translate-y-0.5"
          >
            <Share2 size={16} />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox items={media} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
/* ── Page ────────────────────────────────────────────────── */
export default function DailyJournal() {
  const [showAdminForm, setShowAdminForm] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-16 space-y-12 py-16">

      <div className="border-b-2 border-primary pb-4">
        <div className="flex items-center gap-4 mb-4">
          <NotebookPen className="text-primary flex-shrink-0" size={40} />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest uppercase text-primary">
            Daily Journal
          </h1>
        </div>
        <p className="text-xl text-primary/80 font-semibold italic">
          My personal log of thoughts, learnings, and progress throughout my journey in tech.
        </p>
      </div>

      {/* Admin Mode Toggle (Hidden Key or Icon) */}
      <div className="flex justify-end -mt-8">
        <button 
          onClick={() => setShowAdminForm(true)}
          className="opacity-10 hover:opacity-100 transition-opacity p-2 text-primary"
          title="Admin Writing Mode"
        >
          <NotebookPen size={16} />
        </button>
      </div>

      {showAdminForm && (
        <AdminEditor 
          onCancel={() => setShowAdminForm(false)} 
          onSuccess={() => {
            setShowAdminForm(false);
            alert('Success! Your entry was committed to GitHub. Redploy is starting... Check back in about a minute.');
          }}
        />
      )}

      <div className="relative border-l-2 border-primary ml-4 md:ml-0 space-y-12 pt-8">
        {journalData.map((entry) => (
          <JournalEntry key={entry.id} entry={entry} />
        ))}
      </div>

    </div>
  );
}
