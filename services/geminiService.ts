import { GoogleGenAI } from "@google/genai";

const getTravelAdvice = async (city: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Please set your API_KEY to unlock AI travel insights.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me 3 very short, punchy, exciting travel tips for visiting ${city}. Use emojis. Keep it under 50 words total.`,
    });
    return response.text || "Enjoy your trip!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI insights temporarily unavailable.";
  }
};

export const geminiService = {
  getTravelAdvice
};
