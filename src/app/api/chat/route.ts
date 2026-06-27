import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

// Individual Course File URIs
const CSE1008_THEORY_OF_COMPUTATION_URI = "https://generativelanguage.googleapis.com/v1beta/files/g4y8noyzv2ji";
const CSE3008_ML_COMBINED_STUDY_GUIDE_URI = "https://generativelanguage.googleapis.com/v1beta/files/lgudu6q4om2u";
const ECE2002_COA_COMBINED_STUDY_GUIDE_URI = "https://generativelanguage.googleapis.com/v1beta/files/l2phoysy4bgw";
const ENG1002_EFFECTIVE_ENGLISH_URI = "https://generativelanguage.googleapis.com/v1beta/files/s6k81cykfy87";

// Course URIs Mapping
const COURSE_URIS: Record<string, string> = {
  "CSE1008_THEORY_OF_COMPUTATION": CSE1008_THEORY_OF_COMPUTATION_URI,
  "CSE3008_ML_COMBINED_STUDY_GUIDE": CSE3008_ML_COMBINED_STUDY_GUIDE_URI,
  "ECE2002_COA_COMBINED_STUDY_GUIDE": ECE2002_COA_COMBINED_STUDY_GUIDE_URI,
  "ENG1002_EFFECTIVE_ENGLISH": ENG1002_EFFECTIVE_ENGLISH_URI,
};

export async function POST(req: Request) {
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

For "VIDEO" type subSteps, the "content" field MUST contain one or more valid YouTube URLs (e.g., https://www.youtube.com/watch?v=...) relevant to the sub-step topic, optionally preceded by a brief description. Do not put plain text without a URL in the "content" field of a VIDEO step.

Keep your conversational text brief and encouraging.`;

    const conversationPrompt = context 
      ? `${context}\nUser: ${message}\nAssistant:` 
      : `User: ${message}\nAssistant:`;

    // Detect which course the user is interacting with based on keywords in the message or chat history
    let selectedFileUri = ENG1002_EFFECTIVE_ENGLISH_URI; // Default fallback
    const contextUpper = `${context} ${message}`.toUpperCase();

    if (contextUpper.includes("CSE1008") || contextUpper.includes("THEORY OF COMPUTATION") || contextUpper.includes("TOC")) {
      selectedFileUri = CSE1008_THEORY_OF_COMPUTATION_URI;
    } else if (contextUpper.includes("CSE3008") || contextUpper.includes("MACHINE LEARNING") || contextUpper.includes("ML")) {
      selectedFileUri = CSE3008_ML_COMBINED_STUDY_GUIDE_URI;
    } else if (contextUpper.includes("ECE2002") || contextUpper.includes("COA") || contextUpper.includes("COMPUTER ORGANIZATION")) {
      selectedFileUri = ECE2002_COA_COMBINED_STUDY_GUIDE_URI;
    } else if (contextUpper.includes("ENG1002") || contextUpper.includes("ENGLISH")) {
      selectedFileUri = ENG1002_EFFECTIVE_ENGLISH_URI;
    }

    // Construct request array containing system prompt, selected file, and conversation context
    const contents = [
      systemPrompt,
      {
        fileData: {
          fileUri: selectedFileUri,
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
    console.error("Gemini API Error:", error, "\nCause:", error?.cause || error?.message);
    return NextResponse.json(
      { error: "Failed to fetch response from AI: " + error.message },
      { status: 500 }
    );
  }
}
