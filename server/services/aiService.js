const SuggestionEngine = require('./suggestionEngine');

/**
 * AI Service with LLM Integration (Google Gemini) & Graceful Rule-Based Fallback
 */
class AiService {
  /**
   * Generate suggestions for resume bullets and job role alignment
   * @param {Object} params
   * @param {string[]} params.bullets
   * @param {string} params.targetRole
   * @param {string} params.jobDescription
   * @param {string} params.customApiKey
   */
  static async generateSuggestions({
    bullets = [],
    targetRole = 'Software Engineer',
    jobDescription = '',
    customApiKey = '',
  }) {
    const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

    // If no API key configured, use deterministic heuristic engine immediately
    if (!apiKey) {
      const fallbackResult = SuggestionEngine.generateComprehensiveSuggestions({
        bullets,
      });
      return {
        ...fallbackResult,
        isAIPowered: false,
        source: 'Rule-Based Heuristic Engine (Configure GEMINI_API_KEY in .env for LLM mode)',
      };
    }

    // Attempt Gemini API call
    try {
      const prompt = `
You are an expert technical recruiter and resume editor for top-tier software engineering placement drives.
Analyze these engineering resume bullets and target role:
Target Role: ${targetRole}
Job Description Excerpt: ${jobDescription.slice(0, 500) || 'General Full Stack CSE Role'}
Bullets to improve:
${JSON.stringify(bullets.slice(0, 5))}

CRITICAL RULES:
1. NEVER fabricate employment, companies, education, certifications, tools never used, or fake numbers.
2. Transform bullets using Google's XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
3. Use high-impact engineering verbs (Architected, Engineered, Automated, Optimized).
4. Explain weaknesses in plain, supportive language.

Return ONLY a valid JSON object matching this structure:
{
  "improvedBullets": [
    {
      "original": "original bullet text",
      "improved": "improved engineering bullet",
      "formula": "XYZ breakdown",
      "keyImprovements": ["improvement 1", "improvement 2"]
    }
  ],
  "weakVerbsFound": [
    {
      "verb": "weak verb",
      "alternatives": ["Alternative 1", "Alternative 2"]
    }
  ],
  "weaknessExplanations": [
    {
      "topic": "Topic",
      "explanation": "Simple explanation",
      "solution": "Actionable fix"
    }
  ],
  "projectAdvice": ["advice 1", "advice 2"]
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) {
        throw new Error('Empty response from AI service');
      }

      const parsed = JSON.parse(rawJson);
      return {
        ...parsed,
        isAIPowered: true,
        source: 'Google Gemini AI',
      };
    } catch (aiError) {
      console.warn(`[AI Service Fallback] Notice: ${aiError.message}. Using rule-based engine.`);
      const fallbackResult = SuggestionEngine.generateComprehensiveSuggestions({
        bullets,
      });
      return {
        ...fallbackResult,
        isAIPowered: false,
        source: `Rule-Based Heuristic Fallback (Notice: ${aiError.message})`,
      };
    }
  }
}

module.exports = AiService;
