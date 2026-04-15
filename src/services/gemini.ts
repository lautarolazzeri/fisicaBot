import { searchWeb } from "./webSearch";
import { getSystemPrompt } from "./prompt";
import { Message } from "../types";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithGemini(
  messages: Message[],
  webSearchEnabled: boolean,
) {
  try {
    let webContext = "";
    console.log("entre a gemini");
    console.log("webSearchEnabled:", webSearchEnabled);
    if (webSearchEnabled) {
      const lastUserMessage = messages[messages.length - 1]?.content;

      if (lastUserMessage) {
        console.log("voy a buscar en la web");
        webContext = await searchWeb(lastUserMessage);
      }
    }

    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    if (webSearchEnabled && webContext) {
      contents.unshift({
        role: "user",
        parts: [
          {
            text: `INFORMACIÓN EXTERNA (usar como complemento, no como fuente principal):\n${webContext}`,
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: getSystemPrompt(webSearchEnabled),
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
