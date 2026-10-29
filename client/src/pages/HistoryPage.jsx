import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  FileText,
  Trash2,
  ExternalLink,
  Briefcase,
  Sparkles,
  Calendar,
  Clock,
  Filter,
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { ScoreBadge, LoadingSpinner } from '../components/common/UIComponents';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getHistory();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } catch (err) {
      console.warn('Failed to load history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Permanently delete analysis "${title}"?`)) return;

    try {
      await resumeService.deleteReport(id);
      addToast('Analysis record deleted', 'info');
      setHistory((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error');
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.resumeTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.targetJob?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedScoreFilter === 'ready') return item.atsScore >= 80;
    if (selectedScoreFilter === 'competitive') return item.atsScore >= 65 && item.atsScore < 80;
    if (selectedScoreFilter === 'needsWork') return item.atsScore < 65;

    return true;
  });

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-sky-400 mb-1">
              <History className="w-4 h-4" />
              Audit Portfolio & Version Control
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Analysis History
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review and compare your historical resume scans, track score improvements, and re-run job alignments.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20"
          >
            Upload New Resume
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white dark:bg-navy-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by resume title or role..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">Score Tier:</span>
            <select
              value={selectedScoreFilter}
              onChange={(e) => setSelectedScoreFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
            >
              <option value="all">All Scores</option>
              <option value="ready">ATS Ready (80+)</option>
              <option value="competitive">Competitive (65 - 79)</option>
              <option value="needsWork">Needs Work (&lt; 65)</option>
            </select>
          </div>
        </div>

        {/* Records Table Card */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {loading ? (
            <LoadingSpinner message="Loading historical analyses..." />
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center max-w-sm mx-auto">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                No Matching Records Found
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {searchTerm ? 'Try adjusting your search query.' : 'Upload a resume to begin tracking your history.'}
              </p>
              <Link
                to="/upload"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 inline-block shadow"
              >
                Scan New Resume
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Document Title</th>
                    <th className="px-6 py-3.5">Target Role</th>
                    <th className="px-6 py-3.5">ATS Score</th>
                    <th className="px-6 py-3.5">Tech Skills</th>
                    <th className="px-6 py-3.5">Scanned Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                          <div>
                            <div className="font-bold text-xs sm:text-sm">{item.resumeTitle}</div>
                            <div className="text-[11px] font-normal text-slate-400">{item.originalFileName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {item.targetJob || 'Software Engineer'}
                      </td>

                      <td className="px-6 py-4">
                        <ScoreBadge score={item.atsScore} size="sm" />
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.skillsCount} Skills
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/report/${item.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-sky-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/80 transition-colors"
                        >
                          View Report
                        </button>

                        <button
                          onClick={() => navigate(`/jd-match/${item.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          Match JD
                        </button>

                        <button
                          onClick={() => handleDelete(item.id, item.resumeTitle)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
