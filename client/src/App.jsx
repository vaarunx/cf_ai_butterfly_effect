import { useState, useEffect } from 'react';
import { Sparkles, GitBranch, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tree, setTree] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTree();
    const interval = setInterval(fetchTree, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  const fetchTree = async () => {
    try {
      const res = await fetch('/api/timeline');
      if (res.ok) {
        const data = await res.json();
        // Sort by creation time to keep order stable
        setTree(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      }
    } catch (err) {
      console.error("Failed to fetch timeline", err);
    }
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: input }),
      });
      if (!res.ok) throw new Error("Simulation failed to start");
      setInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      // Keep loading true for a bit or until we see new nodes? 
      // Actually just reset it, the polling will show results.
      setLoading(false);
    }
  };

  // Organize nodes into a hierarchy for rendering
  const buildHierarchy = (nodes) => {
    const map = {};
    const roots = [];
    nodes.forEach(node => {
      map[node.id] = { ...node, children: [] };
    });
    nodes.forEach(node => {
      if (node.parentId && map[node.parentId]) {
        map[node.parentId].children.push(map[node.id]);
      } else {
        roots.push(map[node.id]);
      }
    });
    return roots;
  };

  const hierarchy = buildHierarchy(tree);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full ring-1 ring-purple-500/50 mb-4">
            <GitBranch className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent pb-2">
            The Butterfly Effect
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Change one event in history and watch the multiverse fracture. A recursive AI simulation engine.
          </p>
        </header>

        {/* Input Section */}
        <section className="max-w-2xl mx-auto">
          <form onSubmit={handleSimulate} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-xl p-2 ring-1 ring-slate-800 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What if..."
                className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 text-lg px-4 py-3"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="ml-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-transform active:scale-95"
              >
                {loading ? (
                  <Clock className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Diverge</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </form>
          {error && (
             <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-950/30 p-3 rounded-lg border border-red-900/50">
               <AlertCircle className="w-5 h-5" />
               <p>{error}</p>
             </div>
          )}
        </section>

        {/* Timeline Visualization */}
        <section className="relative">
          <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-2">
            <span className="bg-purple-500 w-2 h-8 rounded-full"></span>
            Detected Timelines
          </h2>
          
          <div className="space-y-8 pl-4">
            {hierarchy.map(root => (
              <TimelineBranch key={root.id} node={root} isRoot={true} />
            ))}
            {hierarchy.length === 0 && (
              <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl text-slate-600">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No divergences detected yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Recursive Component for Tree
function TimelineBranch({ node, isRoot = false }) {
  // Color coding based on year (depth)
  const getYearColor = (y) => {
    if (y === 0) return "border-purple-500 text-purple-200 bg-purple-500/10";
    if (y === 1) return "border-blue-500 text-blue-200 bg-blue-500/10";
    if (y === 10) return "border-cyan-500 text-cyan-200 bg-cyan-500/10";
    return "border-emerald-500 text-emerald-200 bg-emerald-500/10";
  };

  return (
    <div className={clsx("relative", !isRoot && "ml-8 mt-4 pl-8 border-l border-slate-800")}>
      {/* Connector Line for children */}
      {!isRoot && (
        <div className="absolute top-6 left-0 w-8 h-px bg-slate-800" />
      )}

      {/* Node Card */}
      <div className={clsx(
        "relative p-5 rounded-xl border backdrop-blur-sm transition-all hover:border-slate-600 hover:scale-[1.01]",
        getYearColor(node.year)
      )}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-widest opacity-70">
            {node.year === 0 ? "POINT OF DIVERGENCE" : `YEAR +${node.year}`}
          </span>
          <span className="text-xs text-slate-500">
             {node.createdBy === 'user' ? 'User' : 'AI'} • {new Date(node.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <p className="leading-relaxed text-sm md:text-base">
          {node.description}
        </p>
      </div>

      {/* Render Children (Recursively) */}
      {node.children && node.children.length > 0 && (
         <div className="relative">
           {node.children.map(child => (
             <TimelineBranch key={child.id} node={child} />
           ))}
         </div>
      )}
    </div>
  );
}

export default App;
