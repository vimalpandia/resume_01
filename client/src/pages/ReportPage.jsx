import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Printer,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Check,
  ChevronRight,
  FileText,
  Calendar,
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { ScoreBadge, LoadingSpinner } from '../components/common/UIComponents';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await resumeService.getReport(id);
      if (res.success && res.data) {
        setReport(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <LoadingSpinner message="Generating comprehensive ATS audit report..." size="lg" />
        </main>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <main className="flex-1 p-8 max-w-3xl mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Report Not Found</h2>
          <p className="text-sm text-slate-500 mt-2 mb-6">{error || 'Unable to retrieve report details.'}</p>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-500"
          >
            Return to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  const { atsScore, scoreBreakdown, strengths, issues, suggestions, calculationExplanation, disclaimer } = report;

  const categories = [
    {
      key: 'sectionCompleteness',
      title: 'Section Completeness',
      score: scoreBreakdown?.sectionCompleteness?.score || 0,
      max: scoreBreakdown?.sectionCompleteness?.max || 20,
      details: scoreBreakdown?.sectionCompleteness?.details,
    },
    {
      key: 'contentAndImpact',
      title: 'Content & Quantifiable Impact',
      score: scoreBreakdown?.contentAndImpact?.score || 0,
      max: scoreBreakdown?.contentAndImpact?.max || 25,
      details: scoreBreakdown?.contentAndImpact?.details,
    },
    {
      key: 'skillsRelevance',
      title: 'Skills Relevance & Depth',
      score: scoreBreakdown?.skillsRelevance?.score || 0,
      max: scoreBreakdown?.skillsRelevance?.max || 20,
      details: scoreBreakdown?.skillsRelevance?.details,
    },
    {
      key: 'readability',
      title: 'Readability & Formatting',
      score: scoreBreakdown?.readability?.score || 0,
      max: scoreBreakdown?.readability?.max || 20,
      details: scoreBreakdown?.readability?.details,
    },
    {
      key: 'contactCompleteness',
      title: 'Contact & Professional Links',
      score: scoreBreakdown?.contactCompleteness?.score || 0,
      max: scoreBreakdown?.contactCompleteness?.max || 15,
      details: scoreBreakdown?.contactCompleteness?.details,
    },
  ];

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full print:p-0">
        {/* Top Header Actions (Hidden in Print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 no-print">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <Link to="/dashboard" className="hover:text-brand-500">Dashboard</Link>
              <span>/</span>
              <span>Audit Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {report.resumeTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              File: {report.originalFileName} • Evaluated for: <span className="font-semibold text-slate-700 dark:text-slate-300">{report.targetJob?.title || 'Software Engineer'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              Print / Save PDF
            </button>

            <Link
              to={`/jd-match/${report._id}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Match Job
            </Link>

            <Link
              to={`/suggestions/${report._id}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              AI Bullet Fixes
            </Link>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="space-y-6">
          {/* Main Score Hero Card */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl print-card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-sky-400">
                  Algorithmic Evaluation
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Overall ATS Compatibility Score
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg leading-relaxed">
                  Calculated using 5 recruitment dimensions and deterministic syntax heuristics.
                </p>
              </div>

              {/* Gauge Display */}
              <div className="flex items-center gap-5">
                <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-slate-50 dark:bg-slate-800 border-4 border-brand-500/30">
                  <div className="text-center">
                    <span className="text-3xl font-black text-slate-950 dark:text-white">
                      {atsScore}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      out of 100
                    </span>
                  </div>
                </div>

                <div>
                  <ScoreBadge score={atsScore} size="lg" />
                  <div className="text-[11px] text-slate-400 mt-2">
                    {atsScore >= 80 ? 'Placement Ready' : atsScore >= 65 ? 'Competitive Profile' : 'Needs Optimization'}
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Category Breakdown Progress Bars */}
            <div className="pt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pillar-by-Pillar Points Distribution
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const pct = Math.round((cat.score / cat.max) * 100);
                  return (
                    <div
                      key={cat.key}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                        <span>{cat.title}</span>
                        <span>
                          {cat.score} / {cat.max} pts ({pct}%)
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 80
                              ? 'bg-emerald-500'
                              : pct >= 60
                              ? 'bg-sky-500'
                              : pct >= 40
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                        {cat.details}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">Scoring Formulation:</strong> {calculationExplanation}
            </div>
          </div>

          {/* Strengths & Problems Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm print-card">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <h3>Detected Strengths ({strengths?.length || 0})</h3>
              </div>

              {strengths && strengths.length > 0 ? (
                <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  {strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No standout positive signals detected.</p>
              )}
            </div>

            {/* Problems Detected */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm print-card">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3>Problems & Vulnerabilities ({issues?.length || 0})</h3>
              </div>

              {issues && issues.length > 0 ? (
                <ul className="space-y-3 text-xs">
                  {issues.map((issue, idx) => {
                    const isCrit = issue.severity === 'critical';
                    const isWarn = issue.severity === 'warning';
                    return (
                      <li
                        key={idx}
                        className={`p-3 rounded-xl border ${
                          isCrit
                            ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                            : isWarn
                            ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                            : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold">{issue.message}</span>
                          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/30">
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90">{issue.suggestion}</p>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-emerald-500 font-semibold">Zero critical issues found! Outstanding structure.</p>
              )}
            </div>
          </div>

          {/* Prioritized Action Plan */}
          <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm print-card">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Prioritized Action Plan for Immediate Score Boost
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Implement these changes to jump to the top 10% percentile of candidate profiles:
            </p>

            <div className="space-y-3">
              {suggestions && suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        sug.priority === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : sug.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {sug.priority} Priority
                      </span>
                      <span className="font-semibold text-slate-400">{sug.category}</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{sug.message}</div>
                    <p className="text-slate-600 dark:text-slate-300">{sug.action}</p>
                  </div>

                  <Link
                    to={`/suggestions/${report._id}`}
                    className="shrink-0 px-3 py-1.5 rounded-xl font-bold text-xs text-brand-600 dark:text-sky-400 bg-brand-50 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-slate-700 flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>Improve Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Legal ATS Disclaimer Notice */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Official Disclaimer:</strong> {disclaimer}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
