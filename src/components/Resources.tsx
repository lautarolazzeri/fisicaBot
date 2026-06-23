import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  BookOpen,
  Database,
  FileText,
  Globe,
  GraduationCap,
  Search,
} from "lucide-react";
import { Attachment } from "../types";
import { Switch } from "./ui/switch";

interface ResourcesProps {
  files?: Attachment[];
  webSearchEnabled?: boolean;
  onToggleWebSearch?: (enabled: boolean) => void;
}

export const Resources: React.FC<ResourcesProps> = ({
  files = [],
  webSearchEnabled = false,
  onToggleWebSearch,
}) => {
  const defaultResources = [
    {
      title: "Física Universitaria",
      author: "Sears & Zemansky",
      type: "Libro",
    },
    {
      title: "Apuntes de Cátedra",
      author: "Estudiantes grupo 6",
      type: "Apunte",
    },
  ];

  const hasUploadedFiles = files.length > 0;
  const displayResources = hasUploadedFiles ? [] : defaultResources;

  return (
    <div className="space-y-6 mb-12">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          Búsqueda Avanzada
        </h3>

        <Card className="bg-blue-600/5 border-blue-500/20 shadow-none">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-2/3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Globe className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-100">
                  Búsqueda Web
                </p>
                <p className="text-[10px] text-zinc-500">
                  Complementar con info de internet
                </p>
              </div>
            </div>
            <Switch
              checked={webSearchEnabled}
              onCheckedChange={onToggleWebSearch}
              className="data-[state=checked]:bg-blue-600"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4 ">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          {hasUploadedFiles ? "Fuentes Activas" : "Recursos Base"}
        </h3>

        <div className="grid gap-3">
          {displayResources.map((res, i) => (
            <Card
              key={i}
              className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors shadow-none"
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 bg-zinc-800 rounded-lg shrink-0">
                  {res.type === "Libro" ? (
                    <GraduationCap className="w-4 h-4 text-orange-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {res.title}
                  </p>
                  <p className="text-[10px] text-zinc-500">{res.author}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {files.map((file, i) => (
            <Card
              key={`uploaded-${i}`}
              className="bg-blue-600/10 border-blue-500/30 hover:border-blue-500/50 transition-colors shadow-none"
            >
              <CardContent className="p-4 flex items-start gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg shrink-0">
                  <Database className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mt-1">
                    Fuente de Cátedra Activa
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-4 mb-12 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <p className="text-[10px] text-zinc-500 leading-relaxed italic">
          Tip: Carga tus propios apuntes en PDF para que el bot aprenda sobre tu
          cátedra específica.
        </p>
      </div>
    </div>
  );
};
