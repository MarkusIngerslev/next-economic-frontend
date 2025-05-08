"use client";

import { useState, useEffect } from "react";
import SummaryCard from "@/app/ui/dashboard/budget/summary-card";
import SummaryTable from "@/app/ui/dashboard/budget/summary-table";
import {
  getMyIncome,
  IncomeRecord,
  updateIncomeRecord,
  IncomeUpdatePayload,
} from "@/services/api";
import {
  calculateIncomeThisYear,
  calculateIncomeThisMonth,
  calculateAverageMonthlyIncomeThisYear,
} from "@/app/lib/budgetCalculations";

import ReusablePieChart from "@/app/ui/dashboard/graphs/ReusablePieChart";
import ReusableBarChart from "@/app/ui/dashboard/graphs/ReusableBarChart";
import EditIncomeModal from "@/app/ui/dashboard/budget/edit-income-modal";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  // State til at holde data, fejl og loading status
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start i loading state

  // State for modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncomeRecord, setSelectedIncomeRecord] =
    useState<IncomeRecord | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null); // Fejl under gem fra modal

  // Definer currentDate, currentMonth og currentYear før de bruges
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Funktion til at hente data (kan genbruges hvis du vil have en refresh knap f.eks.)
  const fetchIncomeData = async () => {
    setFetchError(null); // Nulstil fejl
    try {
      const data = await getMyIncome();
      setIncomeData(data);
    } catch (error) {
      console.error("Failed to fetch income data:", error);
      setFetchError("Kunne ikke hente indkomstdata. Prøv igen senere.");
      setIncomeData([]); // Sørg for at data er tom ved fejl
    } finally {
      setIsLoading(false); // Stop loading uanset resultat
    }
  };

  // useEffect hook til at hente data når komponenten mounter
  useEffect(() => {
    setIsLoading(true); // Sæt global loading ved mount
    fetchIncomeData();
  }, []);

  // ########################################
  // ## Håndter åbning og lukning af modal ##
  // ########################################

  const handleOpenEditModal = (record: IncomeRecord) => {
    setSelectedIncomeRecord(record);
    setIsEditModalOpen(true);
    setSaveError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedIncomeRecord(null); // Nulstil valgt record
  };

  // ######################################
  // ## Håndter gem af ændringer i modal ##
  // ######################################

  const handleSaveIncomeRecord = async (
    id: string,
    updatedData: Partial<Omit<IncomeRecord, "id" | "category">> & {
      categoryId?: string;
    }
  ) => {
    setSaveError(null);
    try {
      const updatedRecordFromApi = await updateIncomeRecord(id, updatedData);

      // Opdater state lokalt for øjeblikkelig UI opdatering
      // Sørg for at den opdaterede record fra API'en har alle nødvendige felter,
      // især hvis `categoryId` blev brugt til at ændre kategorien.
      // Backend bør returnere den fulde, opdaterede record.
      setIncomeData((prevData) =>
        prevData.map((record) =>
          record.id === id ? { ...record, ...updatedRecordFromApi } : record
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to save income record from page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ukendt fejl ved gem.";
      setSaveError(`Kunne ikke gemme ændringer: ${errorMessage}`);
      throw error; // Kast fejlen videre så EditIncomeModal kan fange den og vise fejl internt
    }
  };

  const handleDataUpdate = () => {
    // Simpel løsning: Hent al data igen
    fetchIncomeData();
    // Mere avanceret: Opdater kun den specifikke række i state lokalt
    // uden at skulle hente alt igen, hvis backend returnerer den opdaterede række.
  };

  // Vis loading indikator mens data hentes
  if (isLoading) {
    return (
      <main className="container mx-auto p-8 text-center">
        <p>Henter data...</p>
        {/* Du kan tilføje en mere avanceret spinner/loading komponent her */}
      </main>
    );
  }

  const incomeThisYear = calculateIncomeThisYear(incomeData, currentYear);
  const incomeThisMonth = calculateIncomeThisMonth(
    incomeData,
    currentMonth,
    currentYear
  );
  const averageMonthlyIncomeThisYear = calculateAverageMonthlyIncomeThisYear(
    incomeThisYear,
    currentMonth
  );

  const incomePieChartData = incomeData
    .filter(
      (record) =>
        new Date(record.date).getFullYear() === currentYear &&
        record.category.type === "income"
    )
    .reduce((acc, record) => {
      const categoryName = record.category.name;
      const amount = parseFloat(record.amount);
      acc[categoryName] = (acc[categoryName] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const formattedIncomePieData = Object.entries(incomePieChartData).map(
    ([name, value]) => ({ name, value })
  );

  // Forbered data til Bar Chart: Antal og Samlet Beløb pr. Kategori (for i år)
  const categoryAnalysisData = incomeData
    .filter(
      (record) =>
        new Date(record.date).getFullYear() === currentYear &&
        record.category.type === "income"
    )
    .reduce((acc, record) => {
      const categoryName = record.category.name;
      const amount = parseFloat(record.amount);

      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          count: 0,
          totalAmount: 0,
        };
      }
      acc[categoryName].count += 1;
      acc[categoryName].totalAmount += amount;
      return acc;
    }, {} as Record<string, { category: string; count: number; totalAmount: number }>);

  const formattedBarChartData = Object.values(categoryAnalysisData);

  return (
    <main className="container mx-auto p-8 border relative">
      {/* Budget page content */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Overblik over indtægt</h1>
        <p className="mb-6 text-center">Budget page content goes here.</p>
      </div>

      {/* små oplysnings cards */}
      {/* Hovedcontainer: 3/4 bredde, centreret */}
      <div className="w-3/4 mx-auto mb-8 border-1">
        <h2 className="text-xl font-bold mb-4 text-start">
          Budget Oplysninger
        </h2>

        {/* Flex container til kort */}
        <div className="flex flex-wrap justify-center mb-4 gap-4">
          {/* SummaryCards placeres direkte i flex containeren */}
          <SummaryCard
            className="max-w-xs w-full"
            title="Årlig Indkomst"
            content={`${incomeThisYear.toLocaleString()} kr.`}
          />
          <SummaryCard
            className="max-w-xs w-full" // Størrelse defineres her
            title="Månedlig Indkomst"
            content={`${incomeThisMonth.toLocaleString()} kr.`}
          />
          <SummaryCard
            className="max-w-xs w-full"
            title="Gns. Månedlig Indkomst (I år)"
            content={`${averageMonthlyIncomeThisYear.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} kr.`}
          />
        </div>
      </div>

      {/* Tabeller og grafer */}
      {/* Vis fejlbesked hvis fetch fejlede */}
      {fetchError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Fejl!</strong>
          <span className="block sm:inline"> {fetchError}</span>
        </div>
      )}

      {/* Tabel of indtægt */}
      <SummaryTable
        data={incomeData}
        title="Mine Indkomster"
        onEditRow={handleOpenEditModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <ReusablePieChart
          data={formattedIncomePieData}
          title="Indkomstfordeling (I år)"
        />
        <ReusableBarChart
          data={formattedBarChartData}
          title="Kategorianalyse: Antal & Beløb (I år)"
          categoryKey="category" // Nøglen i data-objekterne, der indeholder kategorinavnet
          bars={[
            {
              key: "count", // Nøglen for antal-værdien
              name: "Antal Transaktioner",
              color: "#8884d8",
              yAxisId: "left",
            },
            {
              key: "totalAmount", // Nøglen for beløb-værdien
              name: "Samlet Beløb (kr)",
              color: "#82ca9d",
              yAxisId: "right",
            },
          ]}
          yAxisLabels={{ left: "Antal", right: "Beløb (kr)" }}
        />
      </div>

      {/*  */}
      <AnimatePresence>
        {isEditModalOpen && selectedIncomeRecord && (
          <EditIncomeModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            incomeRecord={selectedIncomeRecord}
            onSave={handleSaveIncomeRecord}
            // categories={availableCategories} // Hvis du implementerer kategoriændring
          />
        )}
      </AnimatePresence>

      {/* Vis global gem-fejl hvis den er sat (f.eks. hvis modalen lukkes før fejlen vises internt) */}
      {saveError && !isEditModalOpen && (
        <div
          className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50"
          role="alert"
        >
          <strong className="font-bold">Fejl ved gem! </strong>
          <span className="block sm:inline">{saveError}</span>
          <button
            onClick={() => setSaveError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Luk fejlbesked"
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
      )}
    </main>
  );
}
