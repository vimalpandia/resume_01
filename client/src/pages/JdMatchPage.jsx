import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Copy,
  FileText,
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { ScoreBadge, LoadingSpinner } from '../components/common/UIComponents';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';
import { SAMPLE_JOBS } from '../utils/sampleData';

export default function JdMatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(id || '');
  const [jobTitle, setJobTitle] = useState('Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOBS[0].description);
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      setLoadingResumes(true);
      const res = await resumeService.getHistory();
      if (res.success && res.data) {
        setResumes(res.data);
        if (!selectedResumeId && res.data.length > 0) {
          setSelectedResumeId(res.data[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch resumes for JD match:', err.message);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleSelectJobPreset = (job) => {
    setJobTitle(job.title);
    setJobDescription(job.description);
    setMatchResult(null);
  };

  const handleRunMatch = async () => {
    if (!selectedResumeId) {
      addToast('Please select or upload a resume to match.', 'warning');
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      addToast('Please paste a substantial job description (minimum 20 characters).', 'warning');
      return;
    }

    setMatching(true);
    try {
      const res = await resumeService.matchJobDescription({
        analysisId: selectedResumeId,
        jobDescription,
        targetJobTitle: jobTitle,
      });

      if (res.success && res.data) {
        setMatchResult(res.data);
        addToast('Job description matching finished!', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Matching error', 'error');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
            <Briefcase className="w-4 h-4" />
            Semantic Alignment & Skill Gap Diagnostics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Job Description Matcher
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compare candidate skills against target employer job postings. Detect matched competencies, uncover critical missing skills, and calculate keyword coverage.
          </p>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Resume Selector */}
          <div className="bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Candidate Resume
            </label>

            {loadingResumes ? (
              <LoadingSpinner size="sm" message="Loading saved resumes..." />
            ) : resumes.length === 0 ? (
              <div className="text-xs text-slate-500">
                <p className="mb-3">No saved resumes found in your profile.</p>
                <Link
                  to="/upload"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 inline-block"
                >
                  Upload a Resume First
                </Link>
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.resumeTitle} ({r.atsScore}/100)
                  </option>
                ))}
              </select>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Only verified skills present in your uploaded resume are counted.
            </div>
          </div>

          {/* Job Presets */}
          <div className="lg:col-span-2 bg-white dark:bg-navy-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Quick Industry Job Templates
              </label>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_JOBS.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => handleSelectJobPreset(job)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      jobTitle === job.title
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {job.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Selected Role: <strong className="text-slate-900 dark:text-white">{jobTitle}</strong></span>
              <span>{SAMPLE_JOBS.length} CSE Placement Presets</span>
            </div>
          </div>
        </div>

        {/* Job Description Text Area */}
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Target Job Description (Paste or Customize)
          </label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job posting duties, required qualifications, and tech stack requirements..."
            className="w-full p-4 rounded-2xl text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
          />

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              {jobDescription.split(/\s+/).filter(Boolean).length} words • Distinguishes required vs preferred qualifications
            </span>

            <button
              type="button"
              disabled={matching || !selectedResumeId}
              onClick={handleRunMatch}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 to-brand-600 hover:from-sky-500 hover:to-brand-500 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {matching ? 'Analyzing Skill Overlap...' : 'Run Job Description Match'}
            </button>
          </div>
        </div>

        {/* Match Result Display */}
        {matchResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Score & Keyword Coverage Banner */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Target Role Alignment
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {jobTitle}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Job Description Skills Found: {matchResult.totalJdSkillsFound}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-slate-400">Match Score</div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                      {matchResult.matchScore}%
                    </div>
                  </div>

                  <div className="text-center border-l border-slate-200 dark:border-slate-800 pl-6">
                    <div className="text-xs font-semibold text-slate-400">Keyword Coverage</div>
                    <div className="text-3xl font-black text-brand-600 dark:text-sky-400">
                      {matchResult.keywordCoverage}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Matrix */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Matched Skills */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Verified Matched ({matchResult.matchedSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.matchedSkills && matchResult.matchedSkills.length > 0 ? (
                      matchResult.matchedSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-1"
                        >
                          {s.skill}
                          {s.frequency > 1 && (
                            <span className="text-[10px] opacity-75">({s.frequency}x)</span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No direct matches.</span>
                    )}
                  </div>
                </div>

                {/* Missing Required Skills */}
                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-300 mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>Missing Required ({matchResult.missingRequiredSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingRequiredSkills && matchResult.missingRequiredSkills.length > 0 ? (
                      matchResult.missingRequiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 text-xs font-semibold"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold">All required skills present!</span>
                    )}
                  </div>
                </div>

                {/* Missing Preferred Skills */}
                <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Missing Preferred ({matchResult.missingPreferredSkills?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {matchResult.missingPreferredSkills && matchResult.missingPreferredSkills.length > 0 ? (
                      matchResult.missingPreferredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 text-xs font-semibold"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None specified.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations & Project Framing Card */}
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                Strategic Tailoring Recommendations for this Role
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Specific modifications to boost your candidate match to the top bracket:
              </p>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                {matchResult.recommendations && matchResult.recommendations.map((rec, idx) => (
                  <li
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-sky-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
