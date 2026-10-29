import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  Mail,
  Phone,
  Link2,
  GitBranch,
  Globe,
  FolderPlus,
  RefreshCw,
  Info,
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import { LoadingSpinner } from '../components/common/UIComponents';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';
import { SAMPLE_RESUMES } from '../utils/sampleData';

export default function UploadPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('sections');

  // Form fields for analysis
  const [resumeTitle, setResumeTitle] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState('');

  const validateFile = (file) => {
    if (!file) return 'No file selected.';
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      return 'Invalid file type. Please upload a PDF document (.pdf).';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds the 5MB limit. Please upload a smaller PDF resume.';
    }
    if (file.size < 50) {
      return 'The selected file is empty or corrupted.';
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = async (file) => {
    setErrorMessage('');
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      addToast(validationError, 'error');
      return;
    }

    setSelectedFile(file);
    setResumeTitle(file.name.replace(/\.pdf$/i, ''));
    setParsing(true);

    try {
      const res = await resumeService.uploadAndParsePdf(file);
      if (res.success && res.data) {
        setParseResult(res.data);
        addToast('Resume parsed successfully! Review the extracted sections below.', 'success');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to parse resume.');
      addToast(err.message || 'PDF parse error', 'error');
      setParseResult(null);
    } finally {
      setParsing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // One-click sample loader for instant review
  const handleLoadSample = async (sample) => {
    setErrorMessage('');
    setParsing(true);
    setSelectedFile({ name: sample.fileName, size: 45000 });
    setResumeTitle(sample.title);
    setTargetJobTitle(sample.role);

    try {
      // Simulate parser response with sample data
      const contact = {
        name: sample.text.split('\n')[0].trim(),
        email: (sample.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [''])[0],
        phone: '+91 9876543210',
        linkedin: 'https://linkedin.com/in/adityasharma-dev',
        github: 'https://github.com/adityasharma-code',
      };

      setParseResult({
        fileName: sample.fileName,
        fileSize: 45000,
        wordCount: sample.text.split(/\s+/).length,
        rawText: sample.text,
        extractedSections: {
          contact,
          summary: 'Software engineering student with full-stack capabilities.',
          skills: {
            technical: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'],
            categories: {
              frontend: ['React', 'TypeScript'],
              backend: ['Node.js'],
              databases: ['MongoDB', 'PostgreSQL'],
            },
          },
          bullets: [
            'Architected high-throughput payment settlement microservice using Node.js and Redis, reducing latency by 42%.',
            'Built responsive, accessible merchant dashboard in React and Tailwind CSS.',
            'Automated CI/CD pipeline using GitHub Actions and Docker.',
          ],
        },
      });
      addToast(`Loaded ${sample.title} for testing`, 'info');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setParsing(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!parseResult || !parseResult.rawText) {
      addToast('Please upload and extract a resume first.', 'warning');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await resumeService.runAnalysis({
        resumeTitle: resumeTitle || 'Engineering Resume',
        originalFileName: selectedFile?.name || 'resume.pdf',
        fileSize: selectedFile?.size || 1024,
        rawText: parseResult.rawText,
        extractedSections: parseResult.extractedSections,
        targetJobTitle,
        jobDescription,
      });

      if (res.success && res.data) {
        addToast('ATS Compatibility Analysis Complete!', 'success');
        navigate(`/report/${res.data._id}`);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Analysis calculation failed.');
      addToast(err.message || 'Analysis error', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex bg-slate-50 dark:bg-navy-950 min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-sky-400 mb-1">
            <UploadCloud className="w-4 h-4" />
            Resume Ingestion & Section Parsing
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Upload & Parse Resume
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload your PDF resume to extract text, identify key sections, verify contact links, and run the 5-pillar ATS compatibility evaluation.
          </p>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900 hover:border-brand-400 dark:hover:border-slate-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedFile ? selectedFile.name : 'Choose a PDF resume or drag & drop here'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            Supported format: PDF only • Maximum file size: 5 MB • Text-based documents
          </p>

          {selectedFile && !errorMessage && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ready for analysis ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        {/* Quick Testing Preset Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-400">Quick Test Presets:</span>
          {SAMPLE_RESUMES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-400 dark:hover:border-sky-400 transition-colors shadow-sm font-medium"
            >
              {sample.title.split('-')[0]}
            </button>
          ))}
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <div className="font-bold text-sm mb-0.5">Resume Extraction Notice</div>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Parsing Loader */}
        {parsing && <LoadingSpinner message="Extracting text and identifying resume sections..." />}

        {/* Extracted Information Review Card */}
        {parseResult && !parsing && (
          <div className="mt-8 bg-white dark:bg-navy-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Text Extraction Verified
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Extracted Resume Sections
                </h3>
                <p className="text-xs text-slate-400">
                  Word Count: {parseResult.wordCount} words • Clean text layout
                </p>
              </div>

              {/* Tabs */}
              <div className="flex rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('sections')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'sections'
                      ? 'bg-white dark:bg-navy-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Structured Sections
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('skills')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'skills'
                      ? 'bg-white dark:bg-navy-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Detected Skills
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'raw'
                      ? 'bg-white dark:bg-navy-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Raw Text
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'sections' && (
                <div className="space-y-6">
                  {/* Contact Summary */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Contact Details Detected
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-brand-500" />
                        <span className="truncate">{parseResult.extractedSections?.contact?.email || 'Missing Email'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-500" />
                        <span className="truncate">{parseResult.extractedSections?.contact?.phone || 'Missing Phone'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-sky-500" />
                        <span className="truncate">{parseResult.extractedSections?.contact?.linkedin || 'Missing LinkedIn'}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-purple-500" />
                        <span className="truncate">{parseResult.extractedSections?.contact?.github || 'Missing GitHub'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample Bullets Extracted */}
                  {parseResult.extractedSections?.bullets?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Extracted Experience & Project Bullets ({parseResult.extractedSections.bullets.length})
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                        {parseResult.extractedSections.bullets.slice(0, 5).map((bullet, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5"
                          >
                            <span className="text-brand-500 font-bold">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Verified Technical Taxonomy Skills ({parseResult.extractedSections?.skills?.technical?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(parseResult.extractedSections?.skills?.technical || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-sky-300 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'raw' && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Raw Extracted Text Stream
                  </h4>
                  <pre className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300 font-mono text-xs max-h-64 overflow-y-auto whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                    {parseResult.rawText}
                  </pre>
                </div>
              )}

              {/* Analysis Configuration Form */}
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                  Configure Analysis Profile
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Resume Title / Candidate Name
                    </label>
                    <input
                      type="text"
                      value={resumeTitle}
                      onChange={(e) => setResumeTitle(e.target.value)}
                      placeholder="e.g. Aditya Sharma - FullStack Resume"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Target Role
                    </label>
                    <select
                      value={targetJobTitle}
                      onChange={(e) => setTargetJobTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                      <option value="Frontend React Developer">Frontend React Developer</option>
                      <option value="Backend Systems Engineer">Backend Systems Engineer</option>
                      <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                      <option value="Data Scientist / AI Engineer">Data Scientist / AI Engineer</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Optional Job Description (Enables instant skill overlap matching)
                  </label>
                  <textarea
                    rows={3}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job requirements or duties here (optional)..."
                    className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="button"
                  disabled={analyzing}
                  onClick={handleRunAnalysis}
                  className="w-full py-4 px-6 rounded-2xl font-extrabold text-base text-white bg-gradient-to-r from-brand-600 via-sky-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-xl shadow-brand-500/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {analyzing ? 'Executing 5-Pillar ATS Scoring Engine...' : 'Run Complete ATS Compatibility Analysis'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
