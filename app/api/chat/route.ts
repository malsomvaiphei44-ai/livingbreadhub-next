import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages || [];

    const lastMessage =
      messages[messages.length - 1]?.content || "";

    const model = genAI.getGenerativeModel({
      model: "models/gemini-pro",
    });

    const result = await model.generateContent(lastMessage);

    const response = await result.response;

    const text = response.text();

    return Response.json({
      reply: text,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      reply:
        "AI is currently unavailable. Please try again.",
    });
  }
}
