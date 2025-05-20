"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF19A1",
  "#FF1919",
  "#FF8C19",
  "#19FF8C",
  "#19A1FF",
  "#1919FF",
  "#8C19FF",
  "#FF19FF",
];

interface PieChartDataItem {
  name: string;
  value: number;
}

interface ReusablePieChartProps {
  data: PieChartDataItem[];
  title?: string;
}

const ReusablePieChart: React.FC<ReusablePieChartProps> = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-300">Ingen data at vise.</div>
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
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#374151",
              border: "1px solid #4B5563",
              color: "#E5E7EB",
            }}
            itemStyle={{ color: "#E5E7EB" }}
          />
          <Legend wrapperStyle={{ color: "#D1D5DB" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusablePieChart;
