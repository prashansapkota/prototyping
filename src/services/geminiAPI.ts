const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export const callGeminiAPI = async (prompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return 'Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.';
  }

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GeminiResponse = await response.json();
    
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    } else {
      return 'Could not get analysis from Gemini.';
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Error calling Gemini API. Please check your connection and API key.';
  }
};
