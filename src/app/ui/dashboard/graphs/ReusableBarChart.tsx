"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface BarChartDataItem {
  [key: string]: string | number; // Fleksibel datastruktur
}

interface BarInfo {
  key: string; // Datanøgle for denne søjle
  name: string; // Navn vist i legend/tooltip
  color: string; // Farve på søjlen
  yAxisId: "left" | "right"; // Hvilken Y-akse denne søjle tilhører
}

interface ReusableBarChartProps {
  data: BarChartDataItem[];
  title?: string;
  categoryKey: string; // Nøgle for kategorinavne på X-aksen
  bars: BarInfo[]; // Array af information for hver søjle-serie
  yAxisLabels?: { left?: string; right?: string }; // Valgfrie labels til Y-akserne
}

const ReusableBarChart: React.FC<ReusableBarChartProps> = ({
  data,
  title,
  categoryKey,
  bars,
  yAxisLabels,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-700 rounded shadow-md h-96 flex items-center justify-center text-gray-300">
        Ingen data at vise for søjlediagram.
      </div>
    );
  }

  return (
    <div className="bg-gray-700 p-4 rounded shadow-md text-gray-300 h-96">
      {title && (
        <h2 className="text-xl font-bold mb-4 text-center text-gray-100">
          {title}
        </h2>
      )}
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />{" "}
          <XAxis
            dataKey={categoryKey}
            stroke="#9CA3AF"
            tick={{ fill: "#9CA3AF" }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke={bars.find((b) => b.yAxisId === "left")?.color || "#8884d8"}
            label={{
              value: yAxisLabels?.left,
              angle: -90,
              position: "insideLeft",
              offset: -5,
              style: { textAnchor: "middle", fill: "#9CA3AF" },
            }}
            tick={{ fill: "#9CA3AF" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={bars.find((b) => b.yAxisId === "right")?.color || "#82ca9d"}
            label={{
              value: yAxisLabels?.right,
              angle: -90,
              position: "insideRight",
              offset: -5,
              style: { textAnchor: "middle", fill: "#9CA3AF" },
            }}
            tick={{ fill: "#9CA3AF" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#374151",
              border: "1px solid #4B5563",
              color: "#E5E7EB",
            }}
            itemStyle={{ color: "#E5E7EB" }}
            cursor={{ fill: "rgba(100, 116, 139, 0.3)" }}
          />
          <Legend wrapperStyle={{ color: "#D1D5DB" }} />
          {bars.map((barInfo) => (
            <Bar
              key={barInfo.key}
              dataKey={barInfo.key}
              fill={barInfo.color}
              name={barInfo.name}
              yAxisId={barInfo.yAxisId}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusableBarChart;
