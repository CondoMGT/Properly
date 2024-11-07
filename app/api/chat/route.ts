import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Define the Part types based on the library's expectations
interface TextPart {
  text: string;
}

interface InlineDataPart {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// Union type for all possible Part structures
type Part = TextPart | InlineDataPart;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const POST = async (req: NextRequest) => {
  const { prompt, image } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts: Part[] = [{ text: prompt }];

    if (image) {
      const [mimeType, base64Data] = image.split(",");
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType.split(":")[1].split(";")[0], // Extract MIME type from the data URL
        },
      });
    }

    const result = await model.generateContentStream(parts);
    // const response = result.response.text();

    // Create ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse("An error occurred while processing your request", {
      status: 500,
    });
  }
};
