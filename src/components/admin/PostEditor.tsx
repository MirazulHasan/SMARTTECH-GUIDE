"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Image as ImageIcon, X, Loader2, ChevronDown, Check, ArrowLeft, AlertCircle } from "lucide-react";
import Editor from "@monaco-editor/react";

interface PostEditorProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function PostEditor({ initialData, isEdit }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    categoryId: initialData?.categoryId || "",
    slug: initialData?.slug || "",
    published: initialData?.published || false,
    featured: initialData?.featured || false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const editorRef = useRef<any>(null);

  const insertTag = (tag: string, endTag: string = "", targetId: string = 'post-editor-textarea') => {
    if (targetId === 'post-editor-textarea' && editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (!model || !selection) return;

      const selected = model.getValueInRange(selection);
      const newText = tag + selected + endTag;

      editor.executeEdits("toolbar", [{
        range: selection,
        text: newText,
        forceMoveMarkers: true
      }]);

      setFormData(prev => ({ ...prev, content: editor.getValue() }));
      return;
    }

    const textarea = document.getElementById(targetId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const scrollPos = textarea.scrollTop;

    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);
    const newText = before + tag + selected + endTag + after;

    if (targetId === 'post-editor-textarea') {
      setFormData(prev => ({ ...prev, content: newText }));
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else if (targetId === 'post-title-input') {
      setFormData(prev => ({ ...prev, title: newText }));
    } else if (targetId === 'post-excerpt-input') {
      setFormData(prev => ({ ...prev, excerpt: newText }));
    }

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length + selected.length);
      textarea.scrollTop = scrollPos;
    }, 50);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setFormData({ ...formData, content: history[prevIndex] });
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setFormData({ ...formData, content: history[nextIndex] });
      setHistoryIndex(nextIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, targetId: string) => {
    const isMod = e.ctrlKey || e.metaKey;

    if (e.key === 'Tab' && targetId !== 'post-editor-textarea') {
      e.preventDefault();
      insertTag('  ', '', targetId);
    }

    if (e.key === 'Enter' && targetId !== 'post-editor-textarea') {
      const textarea = e.currentTarget as HTMLTextAreaElement;
      if (textarea && typeof textarea.selectionStart === 'number') {
        const start = textarea.selectionStart;
        const text = textarea.value;
        const before = text.substring(0, start);
        const lastLine = before.split('\n').pop() || '';
        const indentMatch = lastLine.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';

        if (indent.length > 0) {
          e.preventDefault();
          insertTag('\n' + indent, '', targetId);
        }
      }
    }

    if (targetId !== 'post-editor-textarea') {
      if (isMod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if (isMod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    }

    // Formatting
    if (isMod && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertTag('<strong>', '</strong>', targetId);
    }
    if (isMod && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertTag('<em>', '</em>', targetId);
    }
    if (isMod && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      insertTag('<u>', '</u>', targetId);
    }

    if (isMod && (e.key === '1' || e.key === '2' || e.key === '3')) {
      e.preventDefault();
      insertTag(`<h${e.key}>`, `</h${e.key}>`, targetId);
    }

    if ((e.key === ' ' || e.key === 'Enter') && targetId !== 'post-editor-textarea') {
      const newHistory = history.slice(0, historyIndex + 1);
      if (newHistory[newHistory.length - 1] !== formData.content) {
        newHistory.push(formData.title);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }

    // Quick Save
    if (isMod && e.key.toLowerCase() === 's') {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const hasChanges = () => {
    const original = {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      coverImage: initialData?.coverImage || "",
      categoryId: initialData?.categoryId || "",
      slug: initialData?.slug || "",
      published: initialData?.published || false,
      featured: initialData?.featured || false,
    };
    return JSON.stringify(formData) !== JSON.stringify(original);
  };

  const handleBackAction = () => {
    if (hasChanges()) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    // Initialize history with initial content
    if (formData.content && history.length === 0) {
      setHistory([formData.content]);
      setHistoryIndex(0);
    }
  }, [formData.content, history.length]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCats();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const result = await res.json();
      setFormData({ ...formData, coverImage: result.url });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // VALIDATION: Every section must be filled
    const requiredFields = [
      { key: "title", label: "Article Title" },
      { key: "content", label: "Article Content" },
      { key: "coverImage", label: "Cover Image" },
      { key: "categoryId", label: "Category" },
      { key: "slug", label: "URL Slug / Path" }
    ];

    const missing = requiredFields.filter(f => !formData[f.key as keyof typeof formData]);
    
    if (missing.length > 0) {
      setLoading(false);
      setErrorMsg(`⚠️ Gentle Reminder: Please fill out the following sections: ${missing.map(m => m.label).join(", ")}`);
      return;
    }

    try {
      const url = isEdit ? `/api/posts/${initialData.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      // Auto-generate excerpt if empty for better site display
      const submissionData = { ...formData };
      if (!submissionData.excerpt) {
        // Strip HTML and take first 150 chars
        submissionData.excerpt = formData.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...';
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        setSuccess(true);
        router.refresh(); 
        setTimeout(() => {
          setSuccess(false); 
          router.push("/admin");
        }, 2000);
      } else {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Failed to save post";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        }
        setErrorMsg(errorMessage);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setErrorMsg(err.message === "Failed to fetch" 
        ? "Network error: Connection to the server was lost or refused." 
        : `An unexpected error occurred: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
          <div className="glass p-8 rounded-3xl flex flex-col items-center animate-in zoom-in-50 duration-300 shadow-[0_0_50px_rgba(0,212,255,0.3)]">
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-[var(--font-space)]">Successfully Published</h2>
            <p className="text-[#64748b] mt-2 text-sm">Redirecting to posts list...</p>
          </div>
        </div>
      )}

      {showDiscardModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/60 backdrop-blur-md px-4">
          <div className="glass p-10 rounded-[2.5rem] max-w-md w-full animate-in zoom-in-95 duration-200 border border-white/10 shadow-[0_0_80px_rgba(239,68,68,0.15)]">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-400 flex items-center justify-center mb-8 mx-auto rotate-3">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold font-[var(--font-space)] text-center mb-3">Discard Changes?</h2>
            <p className="text-[#64748b] text-center mb-10 text-lg leading-relaxed">
              Your hard work on this article will be lost. This action cannot be undone.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowDiscardModal(false)}
                className="py-4 rounded-2xl bg-white/5 border border-white/5 font-bold hover:bg-white/10 transition-all"
              >
                Keep Editing
              </button>
              <button 
                onClick={() => router.push("/admin")}
                className="py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-[0_10px_30px_rgba(239,68,68,0.3)]"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <button 
          onClick={handleBackAction}
          className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00d4ff33] text-[#64748b] hover:text-[#00d4ff] transition-all"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold font-[var(--font-space)] uppercase tracking-widest">Back to Admin</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8 pb-32">
        {/* Primary Content Editor */}
        <div className="lg:col-span-2 space-y-8">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
              <X className="w-5 h-5 shrink-0" /> {errorMsg}
            </div>
          )}
          <div className="glass p-8 rounded-3xl space-y-6">
            {/* Title Area with Toolbar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-medium text-[#64748b] uppercase tracking-widest">Main Title (HTML Supported)</label>
              </div>
              <div className="bg-[#1e293b]/20 border border-white/5 rounded-3xl overflow-hidden flex flex-col focus-within:border-[#00d4ff] transition-all">
                <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
                    {[{ l: 'H1', t: '<h1>', e: '</h1>' }, { l: 'H2', t: '<h2>', e: '</h2>' }, { l: 'H3', t: '<h3>', e: '</h3>' }].map(b => (
                      <button key={b.l} type="button" onClick={() => insertTag(b.t, b.e, 'post-title-input')}
                        className="px-2 h-7 rounded border border-[#00f2ff33] text-[#00f2ff] hover:bg-[#00f2ff11] transition-all text-[10px] font-bold">
                        {b.l}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 border-r border-white/10">
                    {[{ l: 'B', t: '<strong>', e: '</strong>' }, { l: 'I', t: '<em>', e: '</em>' }, { l: 'U', t: '<u>', e: '</u>' }, { l: 'Color', t: '<span style="color: #00d4ff;">', e: '</span>' }].map(b => (
                      <button key={b.l} type="button" onClick={() => insertTag(b.t, b.e, 'post-title-input')}
                        className="px-2 h-7 rounded border border-[#00f2ff33] text-[#00f2ff] hover:bg-[#00f2ff11] transition-all text-[10px] font-bold">
                        {b.l}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 px-2">
                    {[{ l: 'Left', t: '<div style="text-align: left;">', e: '</div>' }, { l: 'Center', t: '<div style="text-align: center;">', e: '</div>' }, { l: 'Right', t: '<div style="text-align: right;">', e: '</div>' }, { l: 'Justify', t: '<div style="text-align: justify;">', e: '</div>' }].map(b => (
                      <button key={b.l} type="button" onClick={() => insertTag(b.t, b.e, 'post-title-input')}
                        className="px-2 h-7 rounded border border-[#00f2ff33] text-[#00f2ff] hover:bg-[#00f2ff11] transition-all text-[10px] font-bold">
                        {b.l}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  id="post-title-input"
                  className="w-full p-6 bg-transparent outline-none font-mono text-sm leading-relaxed text-[#00d4ff] placeholder:text-[#334155] min-h-[120px] resize-none whitespace-pre-wrap"
                  placeholder="Main Title (HTML Supported)..."
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, 'post-title-input')}
                />
              </div>
            </div>

            {/* Short Excerpt (HTML SUPPORTED) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-medium text-[#64748b] uppercase tracking-widest">Short Excerpt (HTML SUPPORTED)</label>
              </div>
              <div className="bg-[#1e293b]/20 border border-white/5 rounded-3xl overflow-hidden flex flex-col focus-within:border-[#00d4ff] transition-all">
                <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-1.5 px-2">
                    <button type="button" onClick={() => insertTag('<strong>', '</strong>', 'post-excerpt-input')}
                      className="w-10 h-8 flex items-center justify-center rounded border border-[#00f2ff33] text-[#00f2ff] hover:bg-[#00f2ff11] transition-all text-xs font-bold uppercase tracking-widest">
                      B
                    </button>
                    <button type="button" onClick={() => insertTag('<em>', '</em>', 'post-excerpt-input')}
                      className="w-10 h-8 flex items-center justify-center rounded border border-[#00f2ff33] text-[#00f2ff] hover:bg-[#00f2ff11] transition-all text-xs font-bold uppercase tracking-widest">
                      I
                    </button>
                    <button type="button" onClick={() => insertTag('<a href="', '" target="_blank">Link</a>', 'post-excerpt-input')}
                      className="px-4 h-8 flex items-center justify-center rounded border border-[#00f2ff33] text-[#00f2ff] hover:bg-[#00f2ff11] transition-all text-xs font-bold uppercase tracking-[0.1em]">
                      Link
                    </button>
                  </div>
                </div>
                <textarea
                  id="post-excerpt-input"
                  className="w-full p-6 bg-transparent outline-none font-mono text-sm leading-relaxed text-[#00d4ff] placeholder:text-[#334155] min-h-[140px] resize-none whitespace-pre-wrap"
                  placeholder="A short punchy summary that hooks the reader..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, 'post-excerpt-input')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-medium text-[#64748b] uppercase tracking-widest">Post Content (Professional HTML Editor)</label>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#00d4ff] uppercase tracking-tighter">Code Mode Active</span>
                </div>
              </div>

              <div className="bg-[#1e293b]/20 border border-white/5 rounded-3xl overflow-hidden flex flex-col focus-within:border-[#00d4ff] transition-all">
                {/* Enhanced Editor Toolbar */}
                <div className="flex flex-wrap content-start gap-2 p-3 bg-[#0a0f1e] border-b border-white/10 overflow-hidden">
                  {/* Typography */}
                  <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1 rounded border border-[#00d4ff33]">
                    <button type="button" onClick={handleUndo} className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-[10px] font-bold" title="Undo">↩</button>
                    <button type="button" onClick={handleRedo} className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-[10px] font-bold" title="Redo">↪</button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    {[{ l: 'B', t: '<strong>', e: '</strong>' }, { l: 'I', t: '<em>', e: '</em>' }, { l: 'U', t: '<u>', e: '</u>' }, { l: 'S', t: '<s>', e: '</s>' }].map(b => (
                      <button key={b.l} type="button" onClick={() => insertTag(b.t, b.e)}
                        className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold font-mono" title={b.l}>
                        {b.l}
                      </button>
                    ))}
                  </div>

                  {/* Alignment Group */}
                  <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1 rounded border border-[#00d4ff33]">
                    {[{ l: 'Left', t: '<div style="text-align: left;">\n', e: '\n</div>' }, { l: 'Center', t: '<div style="text-align: center;">\n', e: '\n</div>' }, { l: 'Right', t: '<div style="text-align: right;">\n', e: '\n</div>' }, { l: 'Justify', t: '<div style="text-align: justify;">\n', e: '\n</div>' }].map(b => (
                      <button key={b.l} type="button" onClick={() => insertTag(b.t, b.e)}
                        className="px-3 h-8 flex items-center justify-center rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold" title={b.l}>
                        {b.l}
                      </button>
                    ))}
                  </div>

                  {/* Headers Group */}
                  <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1 rounded border border-[#00d4ff33]">
                    {[{ l: 'H1', t: '<h1>', e: '</h1>' }, { l: 'H2', t: '<h2>', e: '</h2>' }, { l: 'H3', t: '<h3>', e: '</h3>' }, { l: 'P', t: '<p>', e: '</p>' }].map(b => (
                      <button key={b.l} type="button" onClick={() => insertTag(b.t, b.e)}
                        className="w-8 h-8 flex items-center justify-center rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold" title={b.l}>
                        {b.l}
                      </button>
                    ))}
                  </div>

                  {/* Media & Links */}
                  <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1 rounded border border-[#00d4ff33]">
                    <button type="button" onClick={() => insertTag('<a href="', '" target="_blank"></a>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">URL</button>
                    <button type="button" onClick={() => insertTag('<img src="', '" alt="Image" style="width: 100%; border-radius: 10px;" />')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold uppercase">Img</button>
                    <button type="button" onClick={() => insertTag('<iframe width="100%" height="400" src="', '" frameborder="0" allowfullscreen></iframe>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">Video</button>
                    <button type="button" onClick={() => insertTag('<div class="media-info" style="padding: 20px; background: rgba(0,212,255,0.05); border-left: 4px solid #00d4ff; margin: 20px 0;">\n  ', '\n</div>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">MediaInfo</button>
                  </div>

                  {/* Advanced Blocks */}
                  <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1 rounded border border-[#00d4ff33]">
                    <button type="button" onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold uppercase">UL</button>
                    <button type="button" onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold uppercase">OL</button>
                    <button type="button" onClick={() => insertTag('<blockquote style="border-left: 3px solid #ffa500; padding: 10px 20px; font-style: italic; background: rgba(255,165,0,0.05); margin: 20px 0;">\n  ', '\n</blockquote>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">Quote</button>
                    <button type="button" onClick={() => insertTag('<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 30px 0;" />\n', '')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold uppercase">HR</button>
                  </div>

                  {/* Fun Tags */}
                  <div className="flex items-center gap-1 bg-[#1e293b]/50 p-1 rounded border border-[#00d4ff33]">
                    <button type="button" onClick={() => insertTag('<details><summary style="cursor: pointer; color: #00d4ff; font-weight: bold;">Spoiler - Click to reveal</summary><div style="padding: 15px; background: rgba(255,255,255,0.02); margin-top: 10px;">\n  ', '\n</div></details>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">Spoiler</button>
                    <button type="button" onClick={() => insertTag('<marquee scrollamount="5" style="color: #00d4ff; font-weight: bold;">', '</marquee>')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">Marquee</button>
                    <button type="button" onClick={() => insertTag('<table style="width:100%; border-collapse: collapse;" border="1">\n  <tr>\n    <th style="padding: 8px;">Header</th>\n  </tr>\n  <tr>\n    <td style="padding: 8px;">Data</td>\n  </tr>\n</table>\n', '')} className="px-3 h-8 rounded border border-transparent hover:border-[#00d4ff33] text-[#00d4ff] hover:bg-[#00d4ff11] transition-all text-xs font-bold">Table</button>
                  </div>

                  {/* Dropdowns (Full Width Fill) */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full mt-2">
                    <select onChange={(e) => { if (e.target.value) { insertTag(`<span style="color: ${e.target.value};">`, '</span>'); e.target.value = ''; } }}
                      className="flex-1 h-10 bg-[#1e293b]/50 border border-[#00d4ff33] hover:border-[#00d4ff] rounded px-3 text-[#00d4ff] text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="">Font Color</option>
                      <option value="#ffffff">White</option>
                      <option value="#00d4ff">Cyber Blue</option>
                      <option value="#ffa500">Neon Orange</option>
                      <option value="#ff00ff">Hot Pink</option>
                      <option value="#00ff00">Matrix Green</option>
                      <option value="#ef4444">Red</option>
                      <option value="#eab308">Yellow</option>
                      <option value="#8b5cf6">Purple</option>
                    </select>

                    <select onChange={(e) => { if (e.target.value) { insertTag(`<span style="font-size: ${e.target.value};">`, '</span>'); e.target.value = ''; } }}
                      className="flex-1 h-10 bg-[#1e293b]/50 border border-[#00d4ff33] hover:border-[#00d4ff] rounded px-3 text-[#00d4ff] text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="">Font Size</option>
                      <option value="12px">Small (12px)</option>
                      <option value="14px">Base (14px)</option>
                      <option value="18px">Normal (18px)</option>
                      <option value="24px">Large (24px)</option>
                      <option value="32px">Huge (32px)</option>
                      <option value="48px">Epic (48px)</option>
                    </select>

                    <select onChange={(e) => { if (e.target.value) { insertTag(`<span style="font-family: ${e.target.value}, sans-serif;">`, '</span>'); e.target.value = ''; } }}
                      className="flex-1 h-10 bg-[#1e293b]/50 border border-[#00d4ff33] hover:border-[#00d4ff] rounded px-3 text-[#00d4ff] text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="">Font Family</option>
                      <option value="Arial">Arial</option>
                      <option value="'Courier New'">Courier New</option>
                      <option value="'Times New Roman'">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="'Outfit'">Outfit</option>
                      <option value="'Space Grotesk'">Space</option>
                    </select>

                    <select onChange={(e) => { if (e.target.value) { insertTag(`<div style="background-color: ${e.target.value}; padding: 10px; border-radius: 8px;">\n  `, '\n</div>'); e.target.value = ''; } }}
                      className="flex-1 h-10 bg-[#1e293b]/50 border border-[#00d4ff33] hover:border-[#00d4ff] rounded px-3 text-[#00d4ff] text-xs font-bold outline-none cursor-pointer transition-all">
                      <option value="">BG Color</option>
                      <option value="rgba(0, 212, 255, 0.1)">Blue Highlight</option>
                      <option value="rgba(255, 165, 0, 0.1)">Orange Highlight</option>
                      <option value="rgba(0, 255, 0, 0.1)">Green Highlight</option>
                      <option value="rgba(255, 255, 255, 0.05)">Subtle Gray</option>
                      <option value="#000000">Solid Black</option>
                    </select>
                  </div>
                </div>

                <div onKeyDown={(e) => handleKeyDown(e, 'post-editor-textarea')} className="h-[600px] w-full border-t border-white/5 relative">
                  <Editor
                    height="100%"
                    language="html"
                    theme="vs-dark"
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val || '' })}
                    onMount={(editor, monaco) => {
                      editorRef.current = editor;

                      // Custom theme to match site background
                      monaco.editor.defineTheme('site-theme', {
                        base: 'vs-dark',
                        inherit: true,
                        rules: [],
                        colors: {
                          'editor.background': '#0a0f1e',
                        }
                      });
                      monaco.editor.setTheme('site-theme');
                    }}
                    options={{
                      minimap: { enabled: false },
                      wordWrap: "on",
                      padding: { top: 24 },
                      fontSize: 14,
                      fontFamily: 'monospace',
                      formatOnType: true,
                      formatOnPaste: true,
                      guides: { indentation: true },
                      renderLineHighlight: "all",
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Sidebar */}
        <div className="space-y-8">
          <div className="space-y-8">
            {/* Cover Image Upload Card (Now at Top) */}
            <div className="glass p-8 rounded-3xl space-y-6">
              <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Cover Image</h3>

              <div className="relative group cursor-pointer aspect-[16/10] bg-[#1e293b]/20 border-2 border-dashed border-white/5 rounded-2xl overflow-hidden hover:border-[#00d4ff33] transition-all text-center flex flex-col items-center justify-center">
                {formData.coverImage ? (
                  <>
                    <img src={formData.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button type="button" onClick={() => setFormData({ ...formData, coverImage: "" })} className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center hover:bg-red-500 transition-colors pointer-events-auto"><X className="w-5 h-5" /></button>
                    </div>
                  </>
                ) : (
                  <div className="p-10">
                    {uploading ? (
                      <Loader2 className="w-10 h-10 animate-spin text-[#00d4ff] mx-auto" />
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-[#64748b] mx-auto mb-4" />
                        <p className="text-sm font-medium text-[#64748b] leading-tight">Drag and drop or<br /><span className="text-[#00d4ff] underline">click to upload</span></p>
                      </>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </div>

              <div className="space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/10 w-full"></div>
                  <span className="bg-[#0b1220] px-3 text-[10px] font-bold text-[#64748b] uppercase absolute">IMAGE SOURCE</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#64748b] px-1 uppercase tracking-widest">Image URL (Upload or Paste)</label>
                  <input
                    type="url"
                    className="w-full bg-[#1e293b]/20 border border-white/5 rounded-xl py-3 px-4 text-xs outline-none focus:border-[#00d4ff] transition-all text-[#00d4ff] font-mono placeholder:text-[#334155]"
                    placeholder="https://example.com/image.jpg"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                </div>

                {formData.coverImage && (
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-green-400 px-1">
                    <Check className="w-3 h-3" /> Image set successfully
                  </div>
                )}
              </div>
            </div>

            {/* Category Pick Card */}
            <div className="glass p-8 rounded-3xl space-y-6">
              <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Category</h3>
              <div className="relative group">
                <select
                  className="w-full appearance-none bg-[#1e293b]/20 border border-white/5 rounded-2xl py-4 px-6 outline-none focus:border-[#00d4ff] transition-all cursor-pointer"
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="" disabled className="bg-[#0a0f1e]">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="bg-[#0a0f1e] text-white py-2">{cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none group-focus-within:text-[#00d4ff]" />
              </div>
            </div>

            <div className="glass p-8 rounded-3xl space-y-6">
              <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Article Link</h3>
              
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-widest">URL Slug / Path</label>
                <div className="flex items-center bg-muted/10 border border-foreground/5 rounded-xl px-4 py-3 gap-2">
                  <span className="text-[10px] text-muted-foreground font-mono">/blog/</span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-sm outline-none text-[#00d4ff] font-mono placeholder:text-[#334155]"
                    placeholder="my-custom-path"
                    value={formData.slug}
                    onChange={(e) => {
                      const val = e.target.value.toLowerCase()
                        .replace(/[^a-z0-9-]/g, '-')
                        .replace(/-+/g, '-');
                      setFormData({ ...formData, slug: val });
                    }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground px-1 italic leading-tight">
                  * Defines the page address. Only letters, numbers, and dashes.
                </p>
              </div>
            </div>

            {/* Publish/Status Card (Now at Bottom) */}
            <div className="glass p-8 rounded-3xl space-y-6">
              <h3 className="font-bold border-b border-white/5 pb-4 mb-2">Visibility & Status</h3>

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer select-none"
                onClick={() => setFormData({ ...formData, published: !formData.published })}>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Published</span>
                  <span className="text-[10px] text-[#64748b] uppercase tracking-widest">Visible to public</span>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-all ${formData.published ? 'bg-[#00d4ff]' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.published ? 'left-7' : 'left-1'}`} />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer select-none"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Featured Post</span>
                  <span className="text-[10px] text-[#64748b] uppercase tracking-widest">Pinned to hero</span>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-all ${formData.featured ? 'bg-[#ffa500]' : 'bg-gray-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.featured ? 'left-7' : 'left-1'}`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00d4ff] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00c4ef] transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isEdit ? "Update Article" : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
