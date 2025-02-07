import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", incidents: 400 },
  { name: "Feb", incidents: 300 },
  { name: "Mar", incidents: 200 },
  { name: "Apr", incidents: 278 },
  { name: "May", incidents: 189 },
  { name: "Jun", incidents: 239 },
];

export function HistoricalData() {
  return (
    <Card className="bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Historical Crime Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#495670" />
              <XAxis
                dataKey="name"
                stroke="#8892B0"
                tick={{ fill: "#8892B0" }}
              />
              <YAxis stroke="#8892B0" tick={{ fill: "#8892B0" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#112240",
                  border: "1px solid #495670",
                }}
                labelStyle={{ color: "#CCD6F6" }}
              />
              <Line
                type="monotone"
                dataKey="incidents"
                stroke="#64FFDA"
                strokeWidth={2}
                dot={{ fill: "#64FFDA" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}