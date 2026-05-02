import React, { useState } from "react";
import { InteractiveSimulationData } from "../../types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Maximize2, PlayCircle, RotateCcw } from "lucide-react";

interface InteractiveSimulationViewProps {
  data: InteractiveSimulationData;
}

export const InteractiveSimulationView: React.FC<
  InteractiveSimulationViewProps
> = ({ data }) => {
  const [resetKey, setResetKey] = useState(0);

  const handleRestart = () => {
    setResetKey((prev) => prev + 1);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-xl mt-4">
      <CardHeader className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-blue-400" />
          <CardTitle className="text-sm font-bold text-zinc-100">
            {data.title}
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="text-zinc-500 hover:text-blue-400 transition-colors p-1"
            title="Reiniciar Simulación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-black min-h-100">
        <iframe
          key={resetKey}
          srcDoc={data.html}
          title={data.title}
          className="w-full h-100 border-none"
          sandbox="allow-scripts"
        />
      </CardContent>
      <div className="p-2 bg-zinc-900 border-t border-zinc-800 flex justify-center">
        <p className="text-[10px] text-zinc-600 font-mono italic">
          Simulación Interactiva Generada por AI
        </p>
      </div>
    </Card>
  );
};
