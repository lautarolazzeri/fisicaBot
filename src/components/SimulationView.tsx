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
  const [key, setKey] = useState(0);
  const [worldWidth, setWorldWidth] = useState(600);
  const bodiesRef = useRef<Matter.Body[]>([]);
  const ropeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scaleRef = useRef<number>(10);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;

    // Evitar que objetos apoyados en superficies caigan verticalmente (braking)
    Matter.Events.on(engine, "beforeUpdate", () => {
      bodiesRef.current.forEach((body) => {
        if (body.label === "box") {
          if (body.velocity.y > 0) {
            Matter.Body.setVelocity(body, {
              x: body.velocity.x,
              y: 0,
            });
          }
        }
      });
    });

    engine.gravity.y =
      data.parameters.gravity !== undefined ? data.parameters.gravity / 9.8 : 1;

    let scale = 5;
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
      const scaleY = (screenHeight * 0.8) / maxHeight;
      scale = Math.min(scaleY, 20);
      if (scale < 0.5) scale = 0.5;

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
        background: "#09090b",
      },
    });
    renderRef.current = render;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    bodiesRef.current = [];
    // Pasar computedWidth para que setupScenario tenga el ancho real
    setupScenario(engine, data, scale, computedWidth, screenHeight);

    Matter.Render.run(render);

    return () => {
      (engine as any)._ropeActive = false;
      if ((engine as any)._ropeAnimFrame) {
        cancelAnimationFrame((engine as any)._ropeAnimFrame);
      }
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [data, key]);

  useEffect(() => {
    const engine = engineRef.current;
    const runner = runnerRef.current;

    if (!engine || !runner) return;

    if (isPlaying) {
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
      case "braking": {
        const acceleration = sim.parameters.acceleration || -3;
        if (bodies[0]) {
          Matter.Body.setVelocity(bodies[0], { x: acceleration, y: 0 });
        }
        break;
      }
      case "friction": {
        const force = sim.parameters.force || 10;
        if (bodies[0]) {
          Matter.Body.applyForce(bodies[0], bodies[0].position, {
            x: force / 1000,
            y: 0,
          });
        }
        break;
      }
      case "pulley": {
        const state = (engineRef.current as any)._pulleyState;
        if (state) state.activate();
        bodiesRef.current = [];
        break;
      }
      case "inclined_plane": {
        const state = (engineRef.current as any)._inclinedState;
        if (state) state.activate();
        bodiesRef.current = [];
        break;
      }
    }

    // Limpiar para no re-aplicar en cada pause/play
    // (excepto inclined_plane y pulley que ya limpian arriba)
    if (sim.scenario !== "inclined_plane" && sim.scenario !== "pulley") {
      bodiesRef.current = [];
    }
  };

  const setupScenario = (
    engine: Matter.Engine,
    sim: SimulationData,
    scale: number,
    width: number, // ← recibe el ancho real del canvas
    height: number, // ← recibe la altura real del canvas
  ) => {
    const { world } = engine;

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
          inertia: Infinity,
          render: { fillStyle: "#3b82f6" },
        });
        const body2 = Matter.Bodies.rectangle(400, height - 35, 40, 40, {
          mass: m2,
          restitution: 1,
          friction: 0,
          frictionAir: 0,
          frictionStatic: 0,
          inertia: Infinity,
          render: { fillStyle: "#ef4444" },
        });
        bodiesRef.current = [body1, body2];
        Matter.World.add(world, [body1, body2]);
        break;
      }

      case "braking": {
        const vehicle = Matter.Bodies.rectangle(
          width / 2,
          height - 40,
          220,
          40,
          {
            isStatic: false,
            friction: 0.8,
            frictionStatic: 0.8,
            label: "truck",
            render: { fillStyle: "#27272a" },
          },
        );
        const box = Matter.Bodies.rectangle(width / 2, height - 80, 50, 50, {
          mass: sim.parameters.mass || 5,
          friction: sim.parameters.friction || 0.3,
          frictionStatic: sim.parameters.friction || 0.3,
          label: "box",
          render: { fillStyle: "#3b82f6" },
        });
        Matter.Body.setVelocity(box, { x: 0, y: 0 });
        Matter.World.add(world, [vehicle, box]);
        bodiesRef.current = [vehicle, box];
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
        const angleDeg = sim.parameters.angle || 30;
        const angle = angleDeg * (Math.PI / 180);
        const mu = sim.parameters.friction || 0;
        const g = sim.parameters.gravity || 9.8;

        // Gravedad desactivada — movimiento 100% manual
        engine.gravity.y = 0;
        engine.gravity.x = 0;

        const planeThickness = 16;
        const planeLength = width * 0.72;

        // El plano: extremo inferior en la esquina derecha, extremo superior a la izquierda.
        // En coordenadas de pantalla: Y crece hacia abajo.
        // El bloque desliza de izquierda-arriba (highX, highY) hacia derecha-abajo (lowX, lowY).
        const lowX = width * 0.88; // extremo inferior del plano (derecha)
        const lowY = height - 30; // cerca del suelo

        const highX = lowX - planeLength * Math.cos(angle); // extremo superior (izquierda)
        const highY = lowY - planeLength * Math.sin(angle); // más arriba

        // Centro geométrico del plano
        const planeCenterX = (highX + lowX) / 2;
        const planeCenterY = (highY + lowY) / 2;

        // En Matter.js, un rectángulo horizontal rotado con angle positivo
        // rota en sentido horario. Para que suba de izquierda a derecha: angle = +angle
        const plane = Matter.Bodies.rectangle(
          planeCenterX,
          planeCenterY,
          planeLength,
          planeThickness,
          {
            isStatic: true,
            angle: angle, // ← positivo: rota en sentido horario, sube de izq a der
            label: "inclined_plane",
            render: { fillStyle: "#3f3f46" },
          },
        );

        const blockSize = 34;

        // Dirección "cuesta abajo": de (highX,highY) hacia (lowX,lowY)
        const downX = Math.cos(angle); // componente X positiva (hacia la derecha)
        const downY = Math.sin(angle); // componente Y positiva (hacia abajo en pantalla)

        // Normal a la superficie del plano apuntando "hacia arriba" (fuera del plano)
        // Perpendicular a (downX, downY) rotada 90° antihorario:
        const normalX = -Math.sin(angle); // apunta hacia la izquierda
        const normalY = Math.cos(angle); // apunta hacia arriba en pantalla (Y negativo = arriba)
        // En pantalla Y+ es abajo, así que la normal hacia "arriba del plano" es (-sin, -cos)... pero
        // como queremos alejar el bloque de la superficie (hacia arriba-izquierda):
        // normalX = -sin(angle), normalY = -cos(angle)
        const nx = -Math.sin(angle);
        const ny = -Math.cos(angle);

        // Offset: centro del bloque a surfaceOffset píxeles de la superficie del plano
        const surfaceOffset = planeThickness / 2 + blockSize / 2 + 1;

        // Posición inicial: 20% desde el extremo superior
        const t0 = 0.2;
        let s = t0 * planeLength;

        // computePos: s=0 → extremo superior (highX,highY), s=planeLength → extremo inferior (lowX,lowY)
        const computePos = (dist: number) => ({
          x: highX + dist * downX + surfaceOffset * nx,
          y: highY + dist * downY + surfaceOffset * ny,
        });

        const initPos = computePos(s);

        const box = Matter.Bodies.rectangle(
          initPos.x,
          initPos.y,
          blockSize,
          blockSize,
          {
            isStatic: true,
            angle: angle, // ← mismo ángulo que el plano para que estén alineados
            collisionFilter: { mask: 0 },
            render: { fillStyle: "#3b82f6" },
            label: "inclined_box",
          },
        );

        let velocity = 0;
        let active = false;

        // Aceleración neta a lo largo del plano (positivo = cuesta abajo)
        const aNet = g * Math.sin(angle) - mu * g * Math.cos(angle);

        const PIXELS_PER_METER = 55;

        Matter.Events.on(engine, "beforeUpdate", (event: any) => {
          if (!active) return;

          const dt = event.delta / 1000;

          if (aNet <= 0) {
            // Rozamiento mayor que la componente gravitatoria → bloque en reposo
            active = false;
            return;
          }

          velocity += aNet * dt;
          s += velocity * PIXELS_PER_METER * dt;

          // Límite inferior: llegó al extremo bajo del plano
          if (s >= planeLength * 0.92) {
            s = planeLength * 0.92;
            velocity = 0;
            active = false;
          }

          const pos = computePos(s);
          Matter.Body.setPosition(box, pos);
        });

        (engine as any)._inclinedState = {
          activate: () => {
            active = true;
          },
          reset: () => {
            active = false;
            velocity = 0;
            s = t0 * planeLength;
            Matter.Body.setPosition(box, computePos(s));
            Matter.Body.setAngle(box, angle);
          },
        };

        Matter.World.add(world, [plane, box]);
        bodiesRef.current = [box];
        break;
      }

      case "pulley": {
        const m1 = Number(sim.parameters.mass1) || 5;
        const m2 = Number(sim.parameters.mass2) || 3;
        const mu = Number(sim.parameters.friction) || 0;
        const g = Number(sim.parameters.gravity) || 9.8;

        const tableY = height - 120;
        const blockSize = 46;
        const hangingSize = 42;
        const pulleyR = 22;

        const pulleyX = width * 0.72;
        const pulleyY = tableY - pulleyR;

        const blockStartX = width * 0.28;
        const blockY = tableY - blockSize / 2 - 1;
        const hangingStartY = pulleyY + pulleyR + hangingSize / 2 + 4;

        const table = Matter.Bodies.rectangle(
          width / 2,
          tableY,
          width * 0.65,
          18,
          { isStatic: true, render: { fillStyle: "#27272a" } },
        );
        const block = Matter.Bodies.rectangle(
          blockStartX,
          blockY,
          blockSize,
          blockSize,
          {
            isStatic: true,
            render: { fillStyle: "#3b82f6" },
            label: "pulley_block",
            collisionFilter: { mask: 0 },
          },
        );
        const pulleyBody = Matter.Bodies.circle(pulleyX, pulleyY, pulleyR, {
          isStatic: true,
          collisionFilter: { mask: 0 },
          render: { fillStyle: "#71717a" },
        });
        const hanging = Matter.Bodies.rectangle(
          pulleyX,
          hangingStartY,
          hangingSize,
          hangingSize,
          {
            isStatic: true,
            render: { fillStyle: "#ef4444" },
            label: "pulley_hanging",
            collisionFilter: { mask: 0 },
          },
        );

        const rawA = (m2 * g - mu * m1 * g) / (m1 + m2);
        const a = Math.max(0, rawA);

        let velocity = 0;
        let blockX = blockStartX;
        let hangingY = hangingStartY;
        let active = false;

        const MAX_BLOCK_X = pulleyX - blockSize / 2 - 4;
        const MAX_HANGING_Y = height - hangingSize / 2 - 10;
        const PIXELS_PER_METER = 40;

        (engine as any)._pulleyState = {
          activate: () => {
            active = true;
          },
          reset: () => {
            active = false;
            velocity = 0;
            blockX = blockStartX;
            hangingY = hangingStartY;
            Matter.Body.setPosition(block, { x: blockStartX, y: blockY });
            Matter.Body.setPosition(hanging, { x: pulleyX, y: hangingStartY });
          },
        };

        Matter.Events.on(engine, "beforeUpdate", (event: any) => {
          if (!active) return;
          const dt = event.delta / 1000;
          velocity += a * dt;
          blockX = Math.min(
            blockX + velocity * PIXELS_PER_METER * dt,
            MAX_BLOCK_X,
          );
          hangingY = Math.min(
            hangingY + velocity * PIXELS_PER_METER * dt,
            MAX_HANGING_Y,
          );
          if (blockX >= MAX_BLOCK_X || hangingY >= MAX_HANGING_Y) {
            velocity = 0;
            active = false;
          }
          Matter.Body.setPosition(block, { x: blockX, y: blockY });
          Matter.Body.setPosition(hanging, { x: pulleyX, y: hangingY });
        });

        const drawRope = () => {
          if (!(engine as any)._ropeActive) return;
          const canvas = ropeCanvasRef.current;
          if (!canvas) {
            (engine as any)._ropeAnimFrame = requestAnimationFrame(drawRope);
            return;
          }
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            (engine as any)._ropeAnimFrame = requestAnimationFrame(drawRope);
            return;
          }
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#d4d4d8";
          ctx.lineWidth = 2.5;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(block.position.x + blockSize / 2, block.position.y);
          ctx.lineTo(pulleyX, pulleyY);
          ctx.lineTo(pulleyX, hanging.position.y - hangingSize / 2);
          ctx.stroke();
          (engine as any)._ropeAnimFrame = requestAnimationFrame(drawRope);
        };

        (engine as any)._ropeActive = true;
        (engine as any)._ropeAnimFrame = requestAnimationFrame(drawRope);

        Matter.World.add(world, [table, block, pulleyBody, hanging]);
        bodiesRef.current = [block, hanging];
        break;
      }
    }
  };

  useEffect(() => {
    if (ropeCanvasRef.current) {
      ropeCanvasRef.current.width = worldWidth;
    }
  }, [worldWidth]);

  const handleToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    const pulleyState = (engineRef.current as any)?._pulleyState;
    if (pulleyState) pulleyState.reset();
    const inclinedState = (engineRef.current as any)?._inclinedState;
    if (inclinedState) inclinedState.reset();
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
          className="relative cursor-crosshair"
          style={{ width: worldWidth, height: 300 }}
        >
          <div
            ref={sceneRef}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <canvas
            ref={ropeCanvasRef}
            width={worldWidth}
            height={300}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          />
        </div>
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
