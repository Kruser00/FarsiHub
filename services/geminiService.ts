import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Category } from "../types";

// Initialize the client.
// Note: If the key is missing here, the API calls will fail with a clear message now.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Trend Discovery
export async function getTrendingTopic(category: Category): Promise<{ topic: string; context: string }> {
  // Switched to 2.0 Flash Exp for higher rate limits (solves 429 error)
  const modelId = "gemini-2.0-flash-exp";
  
  const prompt = `Find a currently trending, specific topic or news story in Iran regarding "${category}". 
  Return only the topic headline and a brief 1-sentence context.
  Do not hallucinate. Use Google Search to find real, recent trends.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            context: { type: Type.STRING }
          },
          required: ["topic", "context"]
        } as Schema
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return json;
  } catch (error: any) {
    console.error("Error fetching trend:", error);
    // Fallback to prevent crash, but log the specific error
    return { topic: `${category} News`, context: "General update" };
  }
}

// 2. Content Drafting
export async function generateBlogPostContent(topic: string, context: string, category: Category) {
  // Switched to 2.0 Flash Exp for higher rate limits (solves 429 error)
  const modelId = "gemini-2.0-flash-exp";

  const prompt = `Write a high-quality, engaging blog post in Farsi (Persian) about: "${topic}".
  Context: ${context}.
  Category: ${category}.
  
  Requirements:
  - Language: Persian (Farsi).
  - Tone: Professional, engaging, magazine-style.
  - Structure: Use HTML tags (<h2>, <h3>, <p>, <ul>, <li>).
  - SEO: Optimize for search engines.
  - Length: Detailed (approx 400-600 words).
  - Citations: If you use the search tool, include source URLs in the separate 'citations' array field.
  - Image Prompt: Create a detailed, highly visual, ENGLISH prompt for an AI image generator to create a photorealistic cover image for this article. Describe lighting, subject, and style (e.g. "Cinematic shot of..."). No text in the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy title in Farsi" },
            excerpt: { type: Type.STRING, description: "2 sentence summary for meta description" },
            content: { type: Type.STRING, description: "Full HTML content" },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            readTime: { type: Type.STRING, description: "e.g., '۵ دقیقه'" },
            citations: { type: Type.ARRAY, items: { type: Type.STRING } },
            imagePrompt: { type: Type.STRING, description: "Detailed image generation prompt in English" }
          },
          required: ["title", "excerpt", "content", "tags", "readTime", "imagePrompt"]
        } as Schema
      }
    });

    const result = JSON.parse(response.text || "{}");

    // Extract citations from grounding metadata if not explicitly returned in JSON
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls: string[] = [];
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) groundingUrls.push(chunk.web.uri);
      });
    }

    return {
      ...result,
      citations: Array.from(new Set([...(result.citations || []), ...groundingUrls]))
    };

  } catch (error: any) {
    console.error("Error generating content:", error);
    // CRITICAL FIX: Throw the ACTUAL error message so we can see it in the UI logs
    throw new Error(error.message || "Unknown API Error");
  }
}

// 3. Visuals Engine
export async function generatePostImage(imagePrompt: string, fallbackTopic: string): Promise<string> {
  // Keeping this as 2.5 flash image as it is the correct model for images
  const modelId = "gemini-2.5-flash-image";
  
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: imagePrompt,
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });
    
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return `https://picsum.photos/seed/${encodeURIComponent(fallbackTopic)}/800/450`;

  } catch (error) {
    console.error("Error generating image:", error);
    return `https://picsum.photos/seed/${Math.random()}/800/450`;
  }
}