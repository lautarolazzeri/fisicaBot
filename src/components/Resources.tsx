import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/ui/card";
import { BookOpen, Database, FileText, GraduationCap } from "lucide-react";
import { Attachment } from "../types";

interface ResourcesProps {
  files?: Attachment[];
}

export const Resources: React.FC<ResourcesProps> = ({ files = [] }) => {
  const defaultResources = [
    {
      title: "Física Universitaria",
      author: "Sears & Zemansky",
      type: "Libro",
    },
    {
      title: "Mecanica para Ingenieros, Dinámica. 3ra Edición",
      author: "J.L Meriam",
      type: "Libro",
    },
    {
      title: "Guía de Ejercicios Resueltos",
      author: "Cátedra de Física I",
      type: "Guía",
    },
  ];

  const hasUploadedFiles = files.length > 0;
  const displayResources = hasUploadedFiles ? [] : defaultResources;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-blue-400" />
        {hasUploadedFiles ? "Fuentes Activas" : "Recursos de Entrenamiento"}
      </h3>

      <div className="grid gap-3">
        {displayResources.map((res, i) => (
          <Card
            key={i}
            className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                {res.type === "Libro" ? (
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                ) : (
                  <FileText className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">{res.title}</p>
                <p className="text-xs text-zinc-500">
                  {res.author} • {res.type}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {files.map((file, i) => (
          <Card
            key={`uploaded-${i}`}
            className="bg-blue-600/10 border-blue-500/30 hover:border-blue-500/50 transition-colors"
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Database className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">{file.name}</p>
                <p className="text-[10px] text-blue-400 uppercase tracking-wider font-bold mt-1">
                  Fuente de Cátedra Activa
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-300 leading-relaxed">
          {hasUploadedFiles
            ? "El asistente está utilizando prioritariamente la información de los archivos cargados para responder tus consultas."
            : "El asistente prioriza estos recursos para garantizar rigor académico y coherencia con el programa de estudio."}
        </p>
      </div>
    </div>
  );
};
