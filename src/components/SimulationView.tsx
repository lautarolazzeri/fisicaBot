import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { SimulationData } from "../types";
import { Play, RotateCcw, Pause } from "lucide-react";
import { Button } from "./ui/button";

interface SimulationViewProps {
  data: SimulationData;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ data }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine>(Matter.Engine.create());
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // For resetting the simulation
  const [worldWidth, setWorldWidth] = useState(600);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const scaleRef = useRef<number>(10);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Reset components for new key
    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Default gravity from parameters or standard
    engine.gravity.y =
      data.parameters.gravity !== undefined ? data.parameters.gravity / 9.8 : 1;

    // Calculate dynamic scale based on scenario
    let scale = 5; // Default pixels per meter
    const containerWidth = sceneRef.current.parentElement?.clientWidth || 600;
    const screenHeight = 300;
    let computedWidth = containerWidth;

    if (
      data.scenario === "projectile" ||
      data.scenario === "vertical_encounter"
    ) {
      let maxDist = 50;
      let maxHeight = 50;

      if (data.scenario === "projectile") {
        const v0 = data.parameters.v0 || 10;
        const angle = (data.parameters.angle || 45) * (Math.PI / 180);
        const g = data.parameters.gravity || 9.8;
        maxDist = (Math.pow(v0, 2) * Math.sin(2 * angle)) / g + 20;
        maxHeight = Math.pow(v0 * Math.sin(angle), 2) / (2 * g) + 20;
      } else if (data.scenario === "vertical_encounter") {
        maxHeight =
          Math.max(
            ...(data.parameters.bodies?.map(
              (b) => b.y0 + Math.pow(b.v0, 2) / 19.6,
            ) || [20]),
          ) + 10;
        maxDist = 20;
      }

      // To allow scrolling for long trajectories, we can set a preferred scale
      // but still respect the height of the container
      const scaleY = (screenHeight * 0.8) / maxHeight;

      // We'll use a scale that is good for visibility but allows the canvas to expand horizontally
      // If the trajectory fits naturally, scale will be 20. If it's long, it will scroll.
      scale = Math.min(scaleY, 20);
      if (scale < 0.5) scale = 0.5;

      // Now compute the width needed for this scale
      computedWidth = Math.max(containerWidth, maxDist * scale + 100);
      setWorldWidth(computedWidth);
    } else {
      setWorldWidth(containerWidth);
    }

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: computedWidth,
        height: screenHeight,
        wireframes: false,
        background: "#09090b", // zinc-950
      },
    });
    renderRef.current = render;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Build scenario
    bodiesRef.current = [];
    setupScenario(engine, data, scale);

    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [data, key]);

  // Effect to handle play/pause
  useEffect(() => {
    const engine = engineRef.current;
    const runner = runnerRef.current;

    if (!engine || !runner) return;

    if (isPlaying) {
      // Apply initial velocities if it's the first time we press play
      if (bodiesRef.current.length > 0) {
        applyInitialVelocities(data);
      }
      Matter.Runner.run(runner, engine);
    } else {
      Matter.Runner.stop(runner);
    }
  }, [isPlaying]);

  const applyInitialVelocities = (sim: SimulationData) => {
    const bodies = bodiesRef.current;
    if (bodies.length === 0) return;

    switch (sim.scenario) {
      case "projectile": {
        const v0 = sim.parameters.v0 || 10;
        const angle = (sim.parameters.angle || 45) * (Math.PI / 180);
        Matter.Body.setVelocity(bodies[0], {
          x: v0 * Math.cos(angle),
          y: -v0 * Math.sin(angle),
        });
        break;
      }
      case "collision": {
        const v1 = sim.parameters.v1 || 5;
        const v2 = sim.parameters.v2 || 0;
        if (bodies[0]) Matter.Body.setVelocity(bodies[0], { x: v1, y: 0 });
        if (bodies[1]) Matter.Body.setVelocity(bodies[1], { x: v2, y: 0 });
        break;
      }
      case "vertical_encounter": {
        const configBodies = sim.parameters.bodies || [];
        configBodies.forEach((bodyConf, i) => {
          if (bodies[i]) {
            Matter.Body.setVelocity(bodies[i], { x: 0, y: -bodyConf.v0 });
          }
        });
        break;
      }
    }
    // Clear bodies ref so we don't re-apply on every pause/play
    bodiesRef.current = [];
  };

  const setupScenario = (
    engine: Matter.Engine,
    sim: SimulationData,
    scale: number,
  ) => {
    const { world } = engine;
    const sceneElement = sceneRef.current;
    const width = sceneElement ? sceneElement.offsetWidth : 600;
    const height = 300;

    // Ground
    const ground = Matter.Bodies.rectangle(
      width / 2,
      height + 20,
      width * 10,
      60,
      {
        isStatic: true,
        label: "ground",
        render: { fillStyle: "#27272a" },
      },
    );
    Matter.World.add(world, ground);

    switch (sim.scenario) {
      case "vertical_encounter": {
        const configBodies = sim.parameters.bodies || [];
        const bodies: Matter.Body[] = [];

        configBodies.forEach((bodyConf) => {
          const body = Matter.Bodies.circle(
            width / 2,
            height - bodyConf.y0 * scale - 20,
            15,
            {
              restitution: 0.5,
              render: { fillStyle: bodyConf.color || "#3b82f6" },
            },
          );
          bodies.push(body);
          Matter.World.add(world, body);
        });

        bodiesRef.current = bodies;
        break;
      }
      case "projectile": {
        // If it's a high speed throw, use a rectangle for 'javelin' effect
        const isJavelin = (sim.parameters.v0 || 0) > 15;
        const angle = (sim.parameters.angle || 45) * (Math.PI / 180);

        const ball = isJavelin
          ? Matter.Bodies.rectangle(50, height - 35, 40, 4, {
              restitution: 0.1,
              friction: 0.1,
              angle: -angle,
              label: "projectile",
              render: { fillStyle: "#3b82f6" },
            })
          : Matter.Bodies.circle(50, height - 35, 15, {
              restitution: 0.5,
              friction: 0.01,
              label: "projectile",
              render: { fillStyle: "#3b82f6" },
            });

        bodiesRef.current = [ball];
        Matter.World.add(world, ball);

        // Update orientation to match velocity
        Matter.Events.on(engine, "afterUpdate", () => {
          if (ball.velocity.x !== 0 || ball.velocity.y !== 0) {
            const vAngle = Math.atan2(ball.velocity.y, ball.velocity.x);
            Matter.Body.setAngle(ball, vAngle);
          }
        });
        break;
      }
      case "collision": {
        const m1 = sim.parameters.mass1 || 1;
        const m2 = sim.parameters.mass2 || 2;

        const body1 = Matter.Bodies.rectangle(100, height - 35, 40, 40, {
          mass: m1,
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0,
          inertia: Infinity, // Prevent rotation and jumping glitches
          render: { fillStyle: "#3b82f6" },
        });
        const body2 = Matter.Bodies.rectangle(400, height - 35, 40, 40, {
          mass: m2,
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0,
          inertia: Infinity, // Prevent rotation and jumping glitches
          render: { fillStyle: "#ef4444" },
        });

        bodiesRef.current = [body1, body2];
        Matter.World.add(world, [body1, body2]);
        break;
      }
      case "freefall": {
        const ball = Matter.Bodies.circle(width / 2, 50, 15, {
          restitution: 0.6,
          render: { fillStyle: "#3b82f6" },
        });
        Matter.World.add(world, ball);
        break;
      }
      case "inclined_plane": {
        const angle = (sim.parameters.angle || 30) * (Math.PI / 180);
        const plane = Matter.Bodies.rectangle(
          width / 2,
          height - 50,
          width * 0.8,
          20,
          {
            isStatic: true,
            angle: angle,
            render: { fillStyle: "#27272a" },
          },
        );

        const box = Matter.Bodies.rectangle(width * 0.2, height - 150, 30, 30, {
          friction: sim.parameters.friction || 0.1,
          angle: angle,
          render: { fillStyle: "#3b82f6" },
        });

        Matter.World.add(world, [plane, box]);
        break;
      }
    }
  };

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden my-4">
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
        <h4 className="text-sm font-bold text-zinc-200">{data.title}</h4>
        <div className="flex gap-2">
          <Button
            onClick={handleToggle}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={handleReset}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden w-full custom-scrollbar">
        <div
          ref={sceneRef}
          className="relative cursor-crosshair h-[300px]"
          style={{ width: worldWidth }}
        />
      </div>
      <div className="p-2 bg-zinc-950 text-[10px] text-zinc-500 font-mono text-center flex flex-wrap gap-x-4 justify-center">
        <span>Escenario: {data.scenario}</span>
        {Object.entries(data.parameters).map(([k, v]) => {
          if (k === "bodies") return null;
          const displayValue =
            typeof v === "object" ? JSON.stringify(v) : String(v);
          return (
            <span key={k}>
              {k}: {displayValue}
            </span>
          );
        })}
      </div>
    </div>
  );
};
