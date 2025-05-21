"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import ToggleSwitch from "@/app/ui/shared/ToggleSwitch";

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
  baseTitle: string; // Ændret fra title
  year: number;
  monthName?: string;
  showMonthlyData: boolean;
  onToggleDataView: () => void;
}

const ReusablePieChart: React.FC<ReusablePieChartProps> = ({
  data,
  baseTitle,
  year,
  monthName,
  showMonthlyData,
  onToggleDataView,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-4 text-gray-300">Ingen data at vise.</div>
    );
  }

  const dynamicTitle =
    showMonthlyData && monthName
      ? `${baseTitle} (${monthName} ${year})`
      : `${baseTitle} (${year})`;

  return (
    <div className="bg-gray-700 p-4 rounded shadow-md text-gray-300 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1"></div> {/* Spacer */}
        <h2 className="text-lg sm:text-xl font-bold text-center text-gray-100 flex-shrink-0 mx-2">
          {dynamicTitle}
        </h2>
        <div className="flex-1 flex justify-end">
          <ToggleSwitch
            isOn={showMonthlyData}
            handleToggle={onToggleDataView}
            size="sm"
          />
        </div>
      </div>
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
