import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Info } from "lucide-react";

export const UserGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
        <Info className="w-6 h-6 text-blue-400" />
        Guía de Uso
      </h2>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-200">Cómo Empezar</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400 space-y-3">
          <p>
            Para comenzar, simplemente escribe tu pregunta o problema de física
            en el chat. Puedes pedir explicaciones, resolver ejercicios, o
            incluso subir archivos con tus apuntes o problemas específicos.
          </p>
          <p>
            Ejemplo: "¿Cómo calculo la fuerza neta en un bloque en una
            pendiente?" o "Sube tu PDF de apuntes para que pueda ayudarte con
            tus dudas específicas."
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-lg text-zinc-200">
            Consejos para Mejores Resultados
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-zinc-400 space-y-3">
          <p>
            Para obtener respuestas más precisas, intenta ser lo más específico
            posible en tu pregunta. Si estás trabajando en un problema, incluye
            todos los datos relevantes y el contexto.
          </p>
          <p>
            Ejemplo: En lugar de preguntar "¿Cómo resuelvo este problema?", di
            "Tengo un bloque de 5 kg en una pendiente de 30 grados con un
            coeficiente de fricción de 0.2. ¿Cuál es la fuerza de fricción?"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
