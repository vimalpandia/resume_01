import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Code2,
  Zap,
  BarChart3,
  Search,
  ChevronDown,
  Award,
  Layers,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ScoreBadge } from '../components/common/UIComponents';

export default function LandingPage() {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  // Interactive ATS Simulator state
  const [simProfile, setSimProfile] = useState('senior');
  const simData = {
    senior: {
      name: 'Full Stack Engineer (2+ Yrs)',
      score: 92,
      metrics: '8 quantifiable metrics found (e.g. 42% latency cut)',
      skills: '14 verified tech skills (React, Node, Redis, Docker, AWS)',
      verbs: 'Spearheaded, Architected, Automated, Engineered',
      status: 'ATS Ready',
    },
    college: {
      name: 'CSE Placement Candidate',
      score: 74,
      metrics: '3 metrics found. Needs more latency and scale figures.',
      skills: '8 tech skills (Java, Python, React, MySQL)',
      verbs: 'Developed, Built, Created',
      status: 'Competitive',
    },
    weak: {
      name: 'Draft Resume (Needs Work)',
      score: 38,
      metrics: '0 quantifiable outcomes found.',
      skills: '3 general tools listed without framework depth.',
      verbs: 'Worked on, helped, did',
      status: 'Needs Work',
    },
  }[simProfile];

  const handleDemoAccess = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  const faqs = [
    {
      q: 'How does the ATS Compatibility Engine calculate the 0-100 score?',
      a: 'The engine evaluates 5 weighted pillars: Section Completeness (20%), Content & Quantifiable Impact (25%), Technical Skills Relevance (20%), Readability & Word Count (20%), and Contact Information (15%). It operates with 100% deterministic transparency without random black-box guesses.',
    },
    {
      q: 'Does it work if I do not have a paid AI API key?',
      a: 'Yes, absolutely! The application includes a comprehensive built-in Heuristic Suggestion Engine that applies Google XYZ bullet formulas and power action verb mappings deterministically. When an external Gemini API key is configured, it unlocks live generative LLM suggestions.',
    },
    {
      q: 'How does Job Description Matching work?',
      a: 'Paste any job posting or pick one of our CSE industry templates. The system extracts required versus preferred technologies, performs semantic matching against your resume, computes keyword coverage %, and identifies missing skills you should address.',
    },
    {
      q: 'Are my uploaded resumes stored safely?',
      a: 'Yes. Files are processed securely in memory during parsing, and saved reports are strictly isolated by authenticated user IDs. Cross-user access is blocked at both the database and middleware layers.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-sky-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-sky-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Built for B.Tech CSE Placement Excellence & Portfolio Showcase</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.12]">
            Crack Your Dream Tech Offer with{' '}
            <span className="bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              Precision ATS Scoring
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload your PDF resume to receive a transparent 5-pillar ATS compatibility score, match against job descriptions, and transform weak bullets into high-impact engineering accomplishments.
          </p>

          {/* Call to Actions */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 text-base font-bold text-white bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Analyze My Resume Free
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleDemoAccess}
                  disabled={demoLoading}
                  className="w-full sm:w-auto px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  {demoLoading ? 'Starting Live Demo...' : '1-Click Reviewer Demo Login'}
                </button>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">100%</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Rule-Based Transparency</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-brand-600 dark:text-sky-400">180+</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Tech Taxonomy Skills</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">XYZ</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Impact Formula Enhancer</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">5 MB</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Secure In-Memory Parsing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ATS Simulator Card */}
      <section className="py-12 bg-slate-100/70 dark:bg-navy-900/50 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Interactive ATS Score Simulator
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              See how our 5-pillar scoring algorithm evaluates different candidate profiles in real time:
            </p>

            {/* Profile toggle pills */}
            <div className="inline-flex p-1 mt-4 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setSimProfile('senior')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  simProfile === 'senior'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Top SDE Candidate (92/100)
              </button>
              <button
                onClick={() => setSimProfile('college')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  simProfile === 'college'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Fresher CSE Student (74/100)
              </button>
              <button
                onClick={() => setSimProfile('weak')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  simProfile === 'weak'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Weak / Unquantified (38/100)
              </button>
            </div>
          </div>

          {/* Simulator Result Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 transition-all">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-sky-400">
                  Profile Simulation
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {simData.name}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Estimated Score</div>
                  <div className="text-3xl font-black text-slate-950 dark:text-white">{simData.score} / 100</div>
                </div>
                <ScoreBadge score={simData.score} size="lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-sm">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Measurable Impact
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{simData.metrics}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4 text-brand-500" />
                  Technical Stack
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{simData.skills}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Action Verbs Detected
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{simData.verbs}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Engineered Specifically for Technical Roles
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
            Most generic resume checkers only count buzzwords. Our system checks the exact engineering signals top tech recruiters and ATS parsers look for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-sky-400 flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Transparent 5-Pillar Scoring
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Clear mathematical breakdown covering section presence, impact metrics, action verbs, readability sweet spots, and professional links.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Job Description Matcher
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Paste target job descriptions to extract verified matches, uncover missing required skills, and calculate keyword alignment density.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              XYZ Formula Bullet Improver
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transform passive task lists ("worked on backend") into high-impact Google XYZ statements ("Architected microservice reducing latency by 42%").
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Scanned PDF Detection
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Safeguards against image-only or corrupt PDF exports that break ATS text extraction, offering instant guidance on text-based exports.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Persistent Analysis History
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track improvement trends over time across multiple revisions, compare target roles, and export printable ATS audit reports to PDF.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Zero-Exposure Privacy
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Resumes are parsed securely in memory. No documents are leaked or shared publicly, with full account and data deletion support.
            </p>
          </div>
        </div>
      </section>

      {/* Placement Portfolio Showcase Banner */}
      <section className="py-14 bg-gradient-to-r from-brand-900 via-navy-900 to-slate-950 text-white border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold">
                <Award className="w-4 h-4 text-sky-400" />
                Technical Interview Ready Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Designed for CSE Placement Portfolio
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Demonstrates clean full-stack engineering: pure functional ATS evaluation engine, adaptive repository persistence pattern, JWT authentication, and responsive theme architecture.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-sky-300">
                React 19 + Vite
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-300">
                Node.js + Express
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-amber-300">
                MongoDB / Mongoose
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono text-purple-300">
                Recharts Analytics
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-950 dark:text-white mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white dark:bg-navy-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span className="font-bold text-slate-900 dark:text-white">AI Resume Analyzer Pro</span>
            <span>— Placement Portfolio Edition</span>
          </div>

          <div className="text-center sm:text-right text-[11px] max-w-md text-slate-400">
            Disclaimer: Estimated ATS scores are calculated based on algorithmic heuristics and do not guarantee interview shortlisting by any commercial recruitment platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
