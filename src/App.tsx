import { useState } from "react";
import { Chat } from "./components/Chat";
import { Resources } from "./components/Resources";
import { UserGuide } from "./components/UserGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/ui/tabs";
import { Atom, BookOpen, Star, Settings, Info } from "lucide-react";
import { Attachment } from "./types";

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);

  const handleFilesUploaded = (files: Attachment[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-blue-500/30">
      <aside className="w-80 border-r border-zinc-800 bg-zinc-900/30 flex flex-col lg:flex">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl  from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                FisicaBot <span className="text-blue-500">AI</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                Proyecto fisica 1
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-950 border border-zinc-800 p-1 mb-6">
              <TabsTrigger
                value="resources"
                className="text-xs text-white-400 data-[state=disabled]:bg-blue-600 data-[state=active]:bg-zinc-800"
              >
                <BookOpen className="w-3.5 h-3.5 mr-2" />
                Recursos
              </TabsTrigger>
              <TabsTrigger
                value="evaluation"
                className="text-xs text-white-400 text-shadow-indigo-300 "
              >
                <Info className="w-3.5 h-3.5 mr-2" />
                Guía de uso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resources" className="mt-0">
              <Resources files={uploadedFiles} />
            </TabsContent>

            <TabsContent value="evaluation" className="mt-0">
              <UserGuide />
            </TabsContent>
          </Tabs>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-4 lg:p-8 max-w-6xl mx-auto w-full">
        <div className="flex-1 min-h-0">
          <Chat onFilesUploaded={handleFilesUploaded} />
        </div>

        <footer className="mt-6 text-center">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium">
            Desarrollado para el Proyecto de Física • 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
