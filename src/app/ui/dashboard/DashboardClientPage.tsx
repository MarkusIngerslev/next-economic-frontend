"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyIncome, IncomeRecord } from "@/services/api";
import { getMyExpense, ExpenseRecord } from "@/services/api/expense";
import SummaryCard from "@/app/ui/dashboard/finance/summaryCard";
import { SummaryCardSkeleton } from "@/app/ui/skeletons/skeleton";
import ReusableBarChart from "@/app/ui/dashboard/graphs/ReusableBarChart";
import { ReusableBarChartSkeleton } from "@/app/ui/skeletons/skeleton";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [income, expenses] = await Promise.all([
          getMyIncome(),
          getMyExpense(),
        ]);
        setIncomeData(income);
        setExpenseData(expenses);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Kunne ikke hente data til dashboard."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalIncome = incomeData.reduce(
    (sum, record) => sum + parseFloat(record.amount),
    0
  );
  const totalExpenses = expenseData.reduce(
    (sum, record) => sum + parseFloat(record.amount),
    0
  );
  const netResult = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <main className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
        <ReusableBarChartSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-400">Fejl</h1>
        <p className="text-red-300 mb-6">{error}</p>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Log ud
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Dashboard Oversigt</h1>
        <button
          onClick={logout}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition-colors"
        >
          Log ud
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Samlet Indkomst"
          content={`${totalIncome.toLocaleString()} kr.`}
          className="bg-green-600/20 border-green-500"
        />
        <SummaryCard
          title="Samlet Udgift"
          content={`${totalExpenses.toLocaleString()} kr.`}
          className="bg-red-600/20 border-red-500"
        />
        <SummaryCard
          title="Nettoresultat"
          content={`${netResult.toLocaleString()} kr.`}
          className={
            netResult >= 0
              ? "bg-blue-600/20 border-blue-500"
              : "bg-orange-600/20 border-orange-500"
          }
        />
      </div>
      {/* Her kan du tilføje en graf hvis ønsket */}
      <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Indkomst vs. Udgifter
        </h2>
        <ReusableBarChart
          data={[
            { name: "Total", Indkomst: totalIncome, Udgifter: totalExpenses },
          ]}
          baseTitle="Finansiel Oversigt"
          year={new Date().getFullYear()} // Eller relevant år
          showMonthlyData={false}
          onToggleDataView={() => {}} // Skal muligvis ikke bruges her
          categoryKey="name"
          bars={[
            {
              key: "Indkomst",
              name: "Indkomst",
              color: "#82ca9d",
              yAxisId: "left",
            },
            {
              key: "Udgifter",
              name: "Udgifter",
              color: "#fb3640",
              yAxisId: "left",
            },
          ]}
          yAxisLabels={{ left: "Beløb (kr)" }}
        />
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Velkommen til dit dashboard! Her får du et hurtigt overblik.
        </p>
        <p className="text-gray-400">
          For mere detaljerede oplysninger, besøg siderne for{" "}
          <a href="/dashboard/budget" className="text-sky-400 hover:underline">
            Indtægter
          </a>{" "}
          eller{" "}
          <a
            href="/dashboard/spending"
            className="text-sky-400 hover:underline"
          >
            Udgifter
          </a>
          .
        </p>
      </div>
    </main>
  );
}
