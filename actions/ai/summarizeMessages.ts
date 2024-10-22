"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type Message = {
  type: "user" | "bot";
  content: string;
};

// Function to clean the response text
function cleanResponseText(text: string): string {
  // Remove the markdown code block syntax
  return text.replace(/```json\n|\n```/g, "").trim();
}

export async function summarizeMessages(messages: Message[]) {
  try {
    // Convert messages to a string format
    const conversationText = messages
      .map((msg) => `${msg.type.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    // Prepare the prompt for Gemini
    const prompt = `Summarize the following conversation between a user and a maintenance bot. Also, priority level (Low, Medium or High) to the issue based on severity and urgency. Focus on the main issues discussed, solutions proposed, and any actions taken or decisions made:

    ${conversationText}

    Provide the result as a JSON object with the following structure:
    {
      "summary": "A concise summary of the main issues, solutions, and actions",
      "description: "A short description of the issue",
      "priority": "The overall priority (Low, Medium, or High) based on the most severe issue"
    }`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = cleanResponseText(response.text());

    const data = JSON.parse(responseText);

    return { success: "Summarized successfully!", data };
  } catch (error) {
    console.error("Error summarizing messages:", error);
    return { error: "An error occurred while summarizing the conversation." };
  }
}
