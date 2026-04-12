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

export interface EvaluationMetric {
  id: string;
  name: string;
  score: number; // 0 to 5
  comment: string;
  timestamp: Date;
}
