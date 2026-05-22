import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt =
      body.messages?.[body.messages.length - 1]?.content || "";

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("AI RESPONSE:", response);

    return Response.json({
      reply:
        response.text ||
        "No response from AI.",
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return Response.json({
      reply:
        "AI is currently unavailable. Please try again.",
    });
  }
}
