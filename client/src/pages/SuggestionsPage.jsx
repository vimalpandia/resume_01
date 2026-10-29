import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  Check,
  Copy,
  ArrowRight,
  TrendingUp,
  Award,
  RefreshCw,
  Info,
  HelpCircle,
  Lightbulb,
  Cpu,
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { LoadingSpinner } from '../components/common/UIComponents';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';

export default function SuggestionsPage() {
  const { id } = useParams();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [customBullet, setCustomBullet] = useState('Worked on frontend website using React and CSS.');
  const [improvedBulletResult, setImprovedBulletResult] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [engineSource, setEngineSource] = useState('Rule-Based Engineering Heuristics');

  // Load report bullets if id is available
  useEffect(() => {
    if (id) {
      loadReportData(id);
    } else {
      loadInitialSuggestions();
    }
  }, [id]);

  const loadReportData = async (reportId) => {
    try {
      setLoading(true);
      const res = await resumeService.getReport(reportId);
      if (res.success && res.data) {
        setReport(res.data);
        if (res.data.aiSuggestions) {
          setImprovedBulletResult(res.data.aiSuggestions);
          setEngineSource(res.data.aiSuggestions.source || 'Rule-Based Heuristic Engine');
        }
      }
    } catch (err) {
      console.warn('Load report for suggestions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialSuggestions = async () => {
    try {
      setLoading(true);
      const res = await resumeService.getAiSuggestions({
        bullets: [customBullet],
        targetRole: 'Software Engineer',
      });
      if (res.success && res.data) {
        setImprovedBulletResult(res.data);
        setEngineSource(res.data.source || 'Rule-Based Heuristic Engine');
      }
    } catch (err) {
      console.warn('Initial suggestions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceCustomBullet = async () => {
    if (!customBullet || customBullet.trim().length < 8) {
      addToast('Please enter a bullet point to enhance.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await resumeService.getAiSuggestions({
        analysisId: report?._id,
        bullets: [customBullet],
        targetRole: report?.targetJob?.title || 'Software Engineer',
      });

      if (res.success && res.data) {
        setImprovedBulletResult(res.data);
        setEngineSource(res.data.source || 'Rule-Based Heuristic Engine');
        addToast('Bullet point upgraded using XYZ formula!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Error generating suggestions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    addToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const powerVerbCategories = [
    {
      title: 'Architecture & Design',
      verbs: ['Architected', 'Engineered', 'Conceptualized', 'Constructed', 'Designed'],
      example: 'Architected high-throughput message pipeline...',
    },
    {
      title: 'Performance & Optimization',
      verbs: ['Accelerated', 'Optimized', 'Streamlined', 'Scaled', 'Refactored'],
      example: 'Optimized PostgreSQL queries reducing latency by 45%...',
    },
    {
      title: 'Leadership & Initiative',
      verbs: ['Spearheaded', 'Championed', 'Orchestrated', 'Founded', 'Pioneered'],
      example: 'Spearheaded migration to microservices architecture...',
    },
    {
      title: 'Reliability & Testing',
      verbs: ['Automated', 'Standardized', 'Benchmarked', 'Remediated', 'Secured'],
      example: 'Automated CI/CD workflows cutting release cycle to 10m...',
    },
  ];

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
            <Sparkles className="w-4 h-4" />
            Bullet Point & Action Verb Enhancer
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Resume Suggestions & XYZ Formula
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300">
              <Cpu className="w-3.5 h-3.5 text-purple-500" />
              <span>{engineSource}</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upgrade passive bullet points into quantifiable engineering achievements following Google's XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].
          </p>
        </div>

        {/* Interactive Bullet Rewriter */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Interactive Bullet Point Enhancer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Type or paste a draft bullet point from your projects or work experience to generate an outcome-driven rewrite:
          </p>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                rows={3}
                value={customBullet}
                onChange={(e) => setCustomBullet(e.target.value)}
                placeholder="e.g. Worked on user authentication using JWT and Node.js..."
                className="w-full p-4 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCustomBullet('Built an ecommerce app with React and Node.js for college project.')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Preset: Frontend
                </button>
                <button
                  type="button"
                  onClick={() => setCustomBullet('Helped with backend database queries and fixed bugs.')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Preset: Backend
                </button>
                <button
                  type="button"
                  onClick={() => setCustomBullet('Did testing for our web application using Postman and Jest.')}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                >
                  Preset: Testing
                </button>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleEnhanceCustomBullet}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 shadow-md shadow-purple-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Optimizing...' : 'Enhance with XYZ Formula'}
              </button>
            </div>
          </div>
        </div>

        {/* Improved Bullet Results */}
        {improvedBulletResult && (
          <div className="space-y-6 mb-8">
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Before vs After Comparison (XYZ Formula)
              </h3>

              <div className="space-y-4">
                {improvedBulletResult.improvedBullets && improvedBulletResult.improvedBullets.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Before (Passive Draft)
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-through opacity-80">
                        {item.original}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          After (High-Impact Accomplishment)
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.improved, idx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {item.improved}
                      </p>
                    </div>

                    {item.keyImprovements && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.keyImprovements.map((imp, impIdx) => (
                          <span
                            key={impIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-sky-300 border border-brand-100 dark:border-brand-900/40"
                          >
                            ✓ {imp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Plain English Weakness Explanations */}
            {improvedBulletResult.weaknessExplanations && (
              <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Plain-English Weakness Explanations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {improvedBulletResult.weaknessExplanations.map((w, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white mb-1.5">{w.topic}</div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{w.explanation}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-brand-600 dark:text-sky-400 font-semibold">
                        Action: {w.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Categorized Power Action Verb Dictionary */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-500" />
            Engineering Power Action Verb Replacement Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Replace passive verbs like "worked on", "handled", or "did" with categorized engineering power verbs:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {powerVerbCategories.map((group, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
              >
                <div className="font-bold text-slate-900 dark:text-white mb-2">{group.title}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {group.verbs.map((verb, vIdx) => (
                    <span
                      key={vIdx}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-brand-700 dark:text-sky-300 font-semibold text-[11px] border border-slate-200 dark:border-slate-700"
                    >
                      {verb}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 italic">
                  e.g. "{group.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
