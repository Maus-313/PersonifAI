import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const HARDCODED_FILE_URI = "https://generativelanguage.googleapis.com/v1beta/files/3z96vlgx6ijp";
  
  let message = "";
  try {
    const body = await req.json();
    message = body.message;
    const history = body.history || [];

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Initialize GoogleGenerativeAI client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Instantiate the gemini-2.5-flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare history context
    const context = history
      .map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');
    
    const systemPrompt = `You are PersonifAI, a personalized academic assistant for students.
Your goal is to help students break down complex tasks into manageable sub-steps.

FLOW:
1. If the user's task is vague, ask 1-2 clarifying questions (e.g., word count, rubric, level of detail).
2. Once the task is clear, provide a "Breakdown Preview". 

When providing a breakdown, you MUST include a JSON block at the end of your response following this structure:
{
  "type": "BREAKDOWN_PREVIEW",
  "title": "Main Task Title",
  "subject": "e.g., Biology, History, Computer Science",
  "priority": "high | medium | low",
  "subSteps": [
    { "type": "TEXT" | "VIDEO" | "REVISION", "title": "Substep Title", "content": "Instructional content or URL" }
  ]
}

Keep your conversational text brief and encouraging.`;

    const conversationPrompt = context 
      ? `${context}\nUser: ${message}\nAssistant:` 
      : `User: ${message}\nAssistant:`;

    // Construct request array containing system prompt, file definition, and conversational history/message
    const contents = [
      systemPrompt,
      {
        fileData: {
          fileUri: HARDCODED_FILE_URI,
          mimeType: "application/pdf",
        },
      },
      conversationPrompt,
    ];

    const result = await model.generateContent(contents);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Received empty response from Gemini");
    }

    return NextResponse.json({ content: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response from AI: " + error.message },
      { status: 500 }
    );
  }
}
