import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  AlertCircle,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Message, GraphData, Attachment } from "../types";
import { chatWithGemini } from "../services/gemini";
import { GraphView } from "./GraphView";
import { cn } from "../lib/utils";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface ChatProps {
  onFilesUploaded?: (files: Attachment[]) => void;
}

export const Chat: React.FC<ChatProps> = ({ onFilesUploaded }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      content:
        "¡Hola! Soy el bot de Fisica. Estoy aquí para ayudarte con problemas de cinemática, dinámica, energía y más. ¿En qué puedo asistirte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const parseContent = (content: string) => {
    const graphRegex = /```json\s*([\s\S]*?)\s*```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = graphRegex.exec(content)) !== null) {
      // Add text before the JSON block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
        });
      }

      try {
        const jsonData = JSON.parse(match[1]);
        if (jsonData.type === "graph") {
          parts.push({ type: "graph", data: jsonData as GraphData });
        } else {
          parts.push({ type: "text", content: match[0] });
        }
      } catch (e) {
        parts.push({ type: "text", content: match[0] });
      }

      lastIndex = graphRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push({ type: "text", content: content.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: "text", content }];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();

      if (file.type.startsWith("image/")) {
        reader.onload = (event) => {
          const att = {
            name: file.name,
            type: file.type,
            data: event.target?.result as string,
          };
          setAttachments((prev) => [...prev, att]);
          onFilesUploaded?.([att]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          const att = {
            name: file.name,
            type: file.type,
            data: event.target?.result as string,
          };
          setAttachments((prev) => [...prev, att]);
          onFilesUploaded?.([att]);
        };
        reader.readAsText(file);
      }
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      const response = await chatWithGemini([...messages, userMessage]);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: response || "Lo siento, no pude procesar tu solicitud.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          content:
            "Hubo un error al conectar con el asistente. Por favor, intenta de nuevo.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="p-4 border-bottom border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100">Fisica Bot</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                Asistente Activo
              </span>
            </div>
          </div>
        </div>
        <div className="md:flex items-center gap-2 hidden">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-zinc-500 font-mono text-right">
            Gemini-3-flash-preview
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 lg:p-6 min-h-0">
        <div className="space-y-8">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-4",
                m.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === "user" ? "bg-zinc-800" : "bg-blue-600/20",
                )}
              >
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-zinc-400" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <div
                className={cn(
                  "flex flex-col max-w-[85%]",
                  m.role === "user" ? "items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-zinc-800 text-zinc-100 rounded-tr-none"
                      : "bg-zinc-900/50 border border-zinc-800 text-zinc-200 rounded-tl-none",
                  )}
                >
                  {parseContent(m.content).map((part, i) => (
                    <div key={i}>
                      {part.type === "text" ? (
                        <div className="markdown-body prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {part.content as string}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <GraphView graph={part.data as GraphData} />
                      )}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-zinc-600 mt-2 font-mono">
                  {m.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((att, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-lg text-xs text-zinc-300"
              >
                {att.type.startsWith("image/") ? (
                  <ImageIcon className="w-3 h-3" />
                ) : (
                  <FileText className="w-3 h-3" />
                )}
                <span className="max-w-[100px] truncate">{att.name}</span>
                <button
                  onClick={() => removeAttachment(i)}
                  className="hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="relative flex items-center gap-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,.txt,.md,.csv,.json"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-500 w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 p-0 rounded-xl"
          >
            <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu problema..."
            className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm text-zinc-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 sm:w-auto sm:px-4 flex-shrink-0 rounded-xl"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-4">
          <p className="text-[10px] text-zinc-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Verifica siempre los resultados numéricos.
          </p>
        </div>
      </div>
    </div>
  );
};
