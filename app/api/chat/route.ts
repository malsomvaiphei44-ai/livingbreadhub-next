import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const latestMessage =
      messages?.[messages.length - 1]?.content || "Hello";

    const result = await model.generateContent(latestMessage);
    const response = await result.response;

    return Response.json({
      reply: response.text(),
    });
  } catch (error) {
    return Response.json(
      {
        reply: "AI is currently unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
