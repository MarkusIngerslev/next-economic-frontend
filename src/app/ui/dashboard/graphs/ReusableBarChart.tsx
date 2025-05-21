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
import ToggleSwitch from "@/app/ui/shared/ToggleSwitch";

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
  baseTitle: string; // Ændret fra title
  year: number;
  monthName?: string;
  showMonthlyData: boolean;
  onToggleDataView: () => void;
  categoryKey: string;
  bars: BarInfo[];
  yAxisLabels?: { left?: string; right?: string };
}

const ReusableBarChart: React.FC<ReusableBarChartProps> = ({
  data,
  baseTitle,
  year,
  monthName,
  showMonthlyData,
  onToggleDataView,
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
