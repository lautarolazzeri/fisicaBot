import React from "react";
import { motion } from "motion/react";
import {
  Atom,
  Download,
  Users,
  MessageSquare,
  ArrowRight,
  Github,
  ExternalLink,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface LandingPageProps {
  onStartChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat }) => {
  const participants = [
    {
      name: "Lautaro Lazzeri",
      role: "Desarrollador",
      email: "lautyylazzerii@gmail.com",
    },
    {
      name: "Franco Riquelme",
      role: "Desarrollador",
      email: "riquelmefranco3119@gmail.com",
    },
    {
      name: "Aldana Nuñez",
      role: "Desarrollador",
      email: "aldanananinunez@gmail.com",
    },
    {
      name: "Damian Montastruc",
      role: "Desarrollador",
      email: "Damianliluo@gmail.com",
    },
    {
      name: "Sofia Sagripanti",
      role: "Desarrollador",
      email: "sofiasagripanti04@gmail.com",
    },
    {
      name: "Tomas De La Iglesia",
      role: "Desarrollador",
      email: "Tom2002bau@gmail.com",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none ">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-999 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Fisica <span className="text-blue-500">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-zinc-100 transition-colors">
              Sobre el Proyecto
            </a>
            <a
              href="#participants"
              className="hover:text-zinc-100 transition-colors"
            >
              Participantes
            </a>
            <a
              href="#download"
              className="hover:text-zinc-100 transition-colors"
            >
              Informe
            </a>
          </div>
          <Button
            onClick={onStartChat}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
          >
            Probar Chatbot
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div //para el efecto de entrada del texto
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-8 uppercase tracking-widest">
              <div className="w-3.5 h-3.5" />
              Proyecto de Física 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-500">
              Asistente de apoyo <br /> para
              <span className="text-blue-500"> Física Universitaria</span>
            </h1>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl leading-relaxed mb-12">
              Orientado a la resolución y comprensión de problemas de mecánica
              clásica, con explicaciones claras basadas en bibliografía
              académica.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={onStartChat}
                size="lg"
                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-full px-8 h-14 text-lg group"
              >
                Comenzar a Chatear
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-zinc-800 cursor-pointer bg-zinc-900/50 hover:bg-zinc-800 hover:text-zinc-200 rounded-full px-8 h-14 text-lg"
              >
                Ver Documentación
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features / About */}
      <section
        id="about"
        className="relative py-24 bg-zinc-900/30 border-y border-zinc-800/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-950/50 border-zinc-800 hover:border-blue-500/50 transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-zinc-200">
                  Chat Interactivo
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Interfaz que permite la resolución de problemas con soporte
                  para notación LaTeX y representación gráfica, facilitando la
                  comprensión de los conceptos involucrados.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950/50 border-zinc-800 hover:border-blue-500/50 transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-zinc-200">
                  Base de Conocimiento
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Desarrollado a partir de bibliografía clásica de Física, como
                  Sears-Zemansky, Serway y Resnick, garantizando un enfoque
                  consistente con los contenidos académicos.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-950/50 border-zinc-800 hover:border-blue-500/50 transition-colors group">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-zinc-200">
                  Enfoque Pedagógico
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  No solo da respuestas; explica el "porqué" y detecta errores
                  conceptuales en el planteo del usuario.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Participants Section */}
      <section id="participants" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Participantes del Proyecto
            </h2>
            <p className="text-zinc-500">
              El equipo detrás del desarrollo de Fisica Bot AI
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {participants.map((p, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl hover:-translate-y-2 ease-in-out duration-300 bg-zinc-900/50 border border-zinc-800 flex items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                  <Users className="w-8 h-8 text-zinc-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-100">{p.name}</h4>
                  <p className="text-blue-500 text-sm mb-2">{p.role}</p>
                  <p className="text-zinc-500 text-xs">{p.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="relative py-32 px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-8 tracking-tight">
            Informe técnico del proyecto
          </h2>
          <p className="text-blue-100 text-lg mb-12 leading-relaxed">
            Descarga el informe completo de la realización del chatbot, donde
            detallamos la arquitectura, el entrenamiento del modelo y los
            resultados obtenidos.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-zinc-100 rounded-full px-10 h-16 text-xl font-bold shadow-2xl shadow-blue-900/40"
          >
            <Download className="w-6 h-6 mr-3" />
            Descargar Informe (PDF)
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-zinc-800/50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Atom className="w-6 h-6 text-blue-500" />
            <span className="font-bold tracking-tight">Fisica Bot AI</span>
          </div>
          <p className="text-zinc-600 text-sm">© 2026 Proyecto de Física.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/lautarolazzeri/fisicaBot"
              className="text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
