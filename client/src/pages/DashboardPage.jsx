import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  Briefcase,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Calendar,
  ExternalLink,
  Trash2,
  PlusCircle,
  BarChart3,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import Sidebar from '../components/common/Sidebar';
import { ScoreBadge, LoadingSpinner } from '../components/common/UIComponents';
import { resumeService } from '../services/resumeService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SAMPLE_RESUMES } from '../utils/sampleData';

export default function DashboardPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getHistory();
      if (res.success) {
        setHistory(res.data || []);
      }
    } catch (err) {
      console.warn('Dashboard fetch history:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete analysis "${title}"?`)) return;

    try {
      await resumeService.deleteReport(id);
      addToast('Analysis record deleted successfully', 'info');
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      addToast(err.message || 'Failed to delete record', 'error');
    }
  };

  // Quick load sample resume into backend for testing if user has no data yet
  const handleQuickLoadSample = async (sample) => {
    setActionLoading(true);
    try {
      const res = await resumeService.runAnalysis({
        resumeTitle: sample.title,
        originalFileName: sample.fileName,
        fileSize: 45000,
        rawText: sample.text,
        targetJobTitle: sample.role,
      });

      if (res.success && res.data) {
        addToast(`Loaded and analyzed "${sample.title}"!`, 'success');
        navigate(`/report/${res.data._id}`);
      }
    } catch (err) {
      addToast(err.message || 'Error analyzing sample', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Compute aggregate statistics
  const totalAnalyses = history.length;
  const latestScore = history[0]?.atsScore || 0;
  const averageScore = totalAnalyses > 0
    ? Math.round(history.reduce((acc, curr) => acc + curr.atsScore, 0) / totalAnalyses)
    : 0;

  // Prepare chart data (reverse chronological for progression line)
  const chartData = [...history].reverse().map((item, index) => ({
    name: `Scan #${index + 1}`,
    score: item.atsScore,
    title: item.resumeTitle,
    date: new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Candidate Command Center
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-200">{user?.name}</span>. Track your ATS readiness, job match accuracy, and historical metrics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New Resume
            </Link>
          </div>
        </div>

        {/* 4 Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
              <FileText className="w-4 h-4 text-brand-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalAnalyses}
            </div>
            <div className="text-xs text-slate-400 mt-1">Stored securely in your profile</div>
          </div>

          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Latest ATS Score</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {latestScore > 0 ? `${latestScore}/100` : '--'}
              </div>
              {latestScore > 0 && <ScoreBadge score={latestScore} size="sm" />}
            </div>
            <div className="text-xs text-slate-400 mt-1">Based on latest uploaded version</div>
          </div>

          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Average Score</span>
              <TrendingUp className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {averageScore > 0 ? `${averageScore}%` : '--'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Across all evaluated iterations</div>
          </div>

          <div className="bg-white dark:bg-navy-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Target Domain</span>
              <Briefcase className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-base font-bold text-slate-900 dark:text-white truncate">
              {user?.targetRole || 'Software Engineer'}
            </div>
            <div className="text-xs text-slate-400 mt-1">Configurable in Profile Settings</div>
          </div>
        </div>

        {/* Charts & Analytics Section */}
        {totalAnalyses > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-500" />
                  ATS Score Progress Trend
                </h3>
                <span className="text-xs font-medium text-slate-400">Score History</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#1e293b',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  Quick Actions
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Boost your recruitment readiness
                </p>

                <div className="space-y-3">
                  <Link
                    to="/upload"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium"
                  >
                    <UploadCloud className="w-5 h-5 text-brand-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Upload New PDF</div>
                      <div className="text-slate-400 text-[11px]">Inspect sections & extract text</div>
                    </div>
                  </Link>

                  <Link
                    to="/jd-match"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium"
                  >
                    <Briefcase className="w-5 h-5 text-sky-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Match Job Description</div>
                      <div className="text-slate-400 text-[11px]">Identify missing core skills</div>
                    </div>
                  </Link>

                  <Link
                    to="/suggestions"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium"
                  >
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Enhance Bullets (XYZ)</div>
                      <div className="text-slate-400 text-[11px]">Upgrade action verbs & metrics</div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Placement Target</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">85+ Benchmark</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Analysis Records Table */}
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Recent Resume Analyses
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Saved reports with comprehensive section breakdowns and scoring audits
              </p>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your analysis portfolio..." />
          ) : history.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                No Resumes Analyzed Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Upload your first engineering resume to trigger the 5-pillar ATS scoring algorithm, or test instantly with one of our sample CSE resumes:
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/upload"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-brand-600 hover:bg-brand-500 shadow"
                >
                  Upload My Resume (PDF)
                </Link>

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleQuickLoadSample(SAMPLE_RESUMES[0])}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  {actionLoading ? 'Analyzing...' : 'Load Sample SDE Resume'}
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Resume Title</th>
                    <th className="px-6 py-3.5">Target Role</th>
                    <th className="px-6 py-3.5">ATS Score</th>
                    <th className="px-6 py-3.5">Verified Skills</th>
                    <th className="px-6 py-3.5">Date Scanned</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {history.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                        <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                        <div>
                          <div className="font-bold">{record.resumeTitle}</div>
                          <div className="text-xs font-normal text-slate-400">{record.originalFileName}</div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {record.targetJob || 'Software Engineer'}
                      </td>

                      <td className="px-6 py-4">
                        <ScoreBadge score={record.atsScore} size="sm" />
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {record.skillsCount} Skills Detected
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(record.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => navigate(`/report/${record.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-sky-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/80 transition-colors"
                        >
                          View Report
                        </button>

                        <button
                          onClick={() => navigate(`/jd-match/${record.id}`)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          Match JD
                        </button>

                        <button
                          onClick={() => handleDelete(record.id, record.resumeTitle)}
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
