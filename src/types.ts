export interface Attachment {
  name: string;
  type: string;
  data: string; // base64 or text
}

export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface GraphData {
  type: "graph";
  title: string;
  xAxis: string;
  yAxis: string;
  data: { x: number; y: number }[];
}

export interface SimulationData {
  type: "simulation";
  title: string;
  scenario:
    | "projectile"
    | "collision"
    | "freefall"
    | "inclined_plane"
    | "vertical_encounter";
  parameters: {
    v0?: number;
    angle?: number; // degrees
    mass1?: number;
    mass2?: number;
    v1?: number;
    v2?: number;
    height?: number;
    gravity?: number;
    friction?: number;
    bodies?: {
      name: string;
      y0: number; // height from ground
      v0: number; // positive is up
      color?: string;
    }[];
    [key: string]: any;
  };
}

export interface EvaluationMetric {
  id: string;
  name: string;
  comment: string;
  timestamp: Date;
}
