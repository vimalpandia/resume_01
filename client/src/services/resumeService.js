import { apiRequest } from './api';

export const resumeService = {
  async uploadAndParsePdf(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return apiRequest('/resumes/upload-parse', {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },

  async runAnalysis(analysisPayload) {
    return apiRequest('/resumes/analyze', {
      method: 'POST',
      body: analysisPayload,
    });
  },

  async matchJobDescription({ analysisId, resumeText, resumeSkills, jobDescription, targetJobTitle }) {
    return apiRequest('/resumes/match-jd', {
      method: 'POST',
      body: { analysisId, resumeText, resumeSkills, jobDescription, targetJobTitle },
    });
  },

  async getAiSuggestions({ analysisId, bullets, targetRole, jobDescription }) {
    return apiRequest('/resumes/ai-suggestions', {
      method: 'POST',
      body: { analysisId, bullets, targetRole, jobDescription },
    });
  },

  async getHistory() {
    return apiRequest('/resumes/history');
  },

  async getReport(id) {
    return apiRequest(`/resumes/report/${id}`);
  },

  async deleteReport(id) {
    return apiRequest(`/resumes/report/${id}`, {
      method: 'DELETE',
    });
  },

  async getHealth() {
    return apiRequest('/health');
  },
};
