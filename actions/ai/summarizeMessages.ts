"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type Message = {
  type: "user" | "bot";
  content: string;
};

export async function summarizeMessages(messages: Message[]) {
  try {
    // Convert messages to a string format
    const conversationText = messages
      .map((msg) => `${msg.type.toUpperCase()}: ${msg.content}`)
      .join("\n\n");

    // Prepare the prompt for Gemini
    const prompt = `Summarize the following conversation between a user and a maintenance bot. Focus on the main issues discussed, solutions proposed, and any actions taken or decisions made:

    ${conversationText}

    Summary:`;

    // Generate content using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return { success: "Summarized successfully!", summary };
  } catch (error) {
    console.error("Error summarizing messages:", error);
    return { error: "An error occurred while summarizing the conversation." };
  }
}
