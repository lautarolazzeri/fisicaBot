import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/ui/card";
import { GraphData } from "@/src/types";

interface GraphViewProps {
  graph: GraphData;
}

export const GraphView: React.FC<GraphViewProps> = ({ graph }) => {
  return (
    <Card className="w-full my-4 bg-zinc-950 border-zinc-800 text-zinc-100 shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono uppercase tracking-wider text-zinc-400">
          {graph.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={graph.data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="x"
                label={{
                  value: graph.xAxis,
                  position: "insideBottomRight",
                  offset: -5,
                  fill: "#71717a",
                  fontSize: 12,
                }}
                stroke="#71717a"
                fontSize={12}
              />
              <YAxis
                label={{
                  value: graph.yAxis,
                  angle: -90,
                  position: "insideLeft",
                  fill: "#71717a",
                  fontSize: 12,
                }}
                stroke="#71717a"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#09090b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#f4f4f5" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="y"
                name={graph.yAxis.split(" ")[0]}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
