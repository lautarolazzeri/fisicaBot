import { searchWeb } from "./webSearch";
import { getSystemPrompt } from "./prompt";
import { Attachment, Message } from "../types";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithGemini(
  messages: Message[],
  webSearchEnabled: boolean,
  contextFiles: Attachment[] = [],
) {
  try {
    const contents = messages.map((m) => {
      const parts: any[] = [{ text: m.content || " " }];

      if (m.attachments) {
        m.attachments.forEach((att) => {
          if (att.type.startsWith("image/") || att.type === "application/pdf") {
            parts.push({
              inlineData: {
                mimeType: att.type,
                data: att.data.split(",")[1] || att.data,
              },
            });
          } else {
            parts[0].text += `\n\n[Archivo adjunto ${att.name}]:\n${att.data}`;
          }
        });
      }

      return {
        role: m.role,
        parts,
      };
    });

    // If there are context files, we can inject them into the first message or as a separate prefix
    if (contextFiles.length > 0) {
      let contextText = "\n\n[ARCHIVOS DE CONTEXTO / LIBROS CARGADOS]:\n";
      const contextParts: any[] = [];

      contextFiles.forEach((file) => {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          contextParts.push({
            inlineData: {
              mimeType: file.type,
              data: file.data.split(",")[1] || file.data,
            },
          });
          contextText += `- Imagen/PDF: ${file.name} (adjunto)\n`;
        } else {
          contextText += `- ${file.name}:\n${file.data}\n`;
        }
      });

      // Inject context into the user's first message or as a system prompt addition
      const firstUserMessage = contents.find((c) => c.role === "user");
      if (firstUserMessage) {
        firstUserMessage.parts[0].text =
          contextText + "\n" + (firstUserMessage.parts[0].text || "");
        contextParts.forEach((p) => firstUserMessage.parts.push(p));
      }
    }

    let webContext = "";
    if (webSearchEnabled) {
      const lastUserMessage = messages[messages.length - 1]?.content;
      if (lastUserMessage) {
        console.log("Realizando búsqueda web...");
        webContext = await searchWeb(lastUserMessage);
      }
    }

    if (webSearchEnabled && webContext) {
      // Inyectar contexto web como un mensaje del sistema/usuario al principio
      contents.unshift({
        role: "user",
        parts: [
          {
            text: `INFORMACIÓN EXTERNA (usar como complemento):\n${webContext}`,
          },
        ],
      });
      // Importante: No podemos tener dos mensajes seguidos de 'user' según la API de Gemini (dependiendo de la versión/SDK)
      // Pero usualmente se puede manejar agrupando. Para simplificar, lo añadimos al primer mensaje si existe.
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
