import { useState } from "react";
import { Chat } from "./components/Chat";
import { Resources } from "./components/Resources";
import { UserGuide } from "./components/UserGuide";
import { LandingPage } from "./components/LandingPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Button } from "./components/ui/button";
import { Atom, BookOpen, Star, Settings, Info, Menu } from "lucide-react";
import { Attachment } from "./types";

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  const [showChat, setShowChat] = useState(false);

  const handleFilesUploaded = (files: Attachment[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        <Tabs defaultValue="resources" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-950 border border-zinc-800 p-1 mb-6">
            <TabsTrigger
              value="resources"
              className="text-xs data-[state=active]:bg-zinc-800"
            >
              <BookOpen className="w-3.5 h-3.5 mr-2" />
              Recursos
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="text-xs data-[state=active]:bg-zinc-800"
            >
              <Star className="w-3.5 h-3.5 mr-2" />
              Guia de uso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-0">
            <Resources
              files={uploadedFiles}
              webSearchEnabled={webSearchEnabled}
              onToggleWebSearch={setWebSearchEnabled}
            />
          </TabsContent>

          <TabsContent value="evaluation" className="mt-0">
            <UserGuide />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  if (!showChat) {
    return <LandingPage onStartChat={() => setShowChat(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <aside className="w-80 border-r border-zinc-800 bg-zinc-900/30 flex flex-col hidden lg:flex shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setShowChat(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight group-hover:text-blue-400 transition-colors">
                PhyTutor <span className="text-blue-500">AI</span>
              </h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">
                Mecánica Clásica
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-6">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="p-4 border-b border-zinc-800 bg-zinc-900/30 flex lg:hidden items-center justify-between shrink-0">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowChat(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold">Fisica Bot</h1>
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-zinc-950 border-zinc-800"
                >
                  <Menu className="w-5 h-5 text-zinc-400" />
                </Button>
              }
            />
            <SheetContent
              side="left"
              className="bg-zinc-950 border-zinc-800 text-zinc-100 w-80 p-6"
            >
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-zinc-100 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-blue-500" />
                  Fisica Bot
                </SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        {/* Chat Container */}
        <div className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto w-full flex flex-col min-h-0">
          <Chat
            onFilesUploaded={handleFilesUploaded}
            webSearchEnabled={webSearchEnabled}
          />

          <footer className="mt-4 text-center shrink-0">
            <button
              onClick={() => setShowChat(false)}
              className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium hover:text-blue-500 transition-colors"
            >
              Volver al Inicio • Proyecto de Física • 2026
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}
