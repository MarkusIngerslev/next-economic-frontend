"use client";

import { useState, useEffect } from "react";
import SummaryCard from "@/app/ui/dashboard/budget/summary-card";
import SummaryTable from "@/app/ui/dashboard/budget/summary-table";
import {
  getMyIncome,
  IncomeRecord,
  updateIncomeRecord,
  IncomeUpdatePayload,
  deleteIncomeRecord,
  createIncomeRecord,
  IncomeCreatePayload,
} from "@/services/api";
import { getAllCategories, Category } from "@/services/api/category"; // Antager du har denne fil og type
import {
  calculateIncomeThisYear,
  calculateIncomeThisMonth,
  calculateAverageMonthlyIncomeThisYear,
} from "@/app/lib/budgetCalculations";

import ReusablePieChart from "@/app/ui/dashboard/graphs/ReusablePieChart";
import ReusableBarChart from "@/app/ui/dashboard/graphs/ReusableBarChart";
import EditIncomeModal from "@/app/ui/dashboard/budget/edit-income-modal";
import ConfirmDeleteModal from "@/app/ui/dashboard/budget/confirm-delete-modal";
import AddIncomeModal from "@/app/ui/dashboard/budget/add-income-modal";
import { AnimatePresence } from "framer-motion";
import { formatDateToLocal } from "@/app/lib/utils";

export default function Page() {
  // #######################################
  // ## Definer state og initialiser data ##
  // #######################################

  // State til at holde data, fejl og loading status
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start i loading state

  // State edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIncomeRecord, setSelectedIncomeRecord] =
    useState<IncomeRecord | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // State for Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<IncomeRecord | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // State for Add Income modal
  const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);

  // Definer currentDate, currentMonth og currentYear før de bruges
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // ####################################
  // ## Hent data fra backend ved load ##
  // ## og opdater state med dataene   ##
  // ####################################

  // Funktion til at hente data fra backend
  const fetchAllData = async () => {
    setIsLoading(true);
    setFetchError(null);
    setFetchCategoriesError(null);
    try {
      const [income, categories] = await Promise.all([
        getMyIncome(),
        getAllCategories(),
      ]);
      setIncomeData(income);
      setAllCategories(categories);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      if (!incomeData.length) setFetchError("Kunne ikke hente indkomstdata.");
      if (!allCategories.length)
        setFetchCategoriesError("Kunne ikke hente kategorier.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ########################################
  // ## Håndter åbning og lukning af modals ##
  // ########################################

  // Edit Modal Handlers
  const handleOpenEditModal = (record: IncomeRecord) => {
    setSelectedIncomeRecord(record);
    setIsEditModalOpen(true);
    setSaveError(null); // Nulstil fejl fra andre handlinger
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedIncomeRecord(null);
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = (record: IncomeRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
    setSaveError(null); // Nulstil fejl fra andre handlinger
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  // Add Income Modal Handlers
  const handleOpenAddIncomeModal = () => {
    setSaveError(null); // Nulstil fejl fra andre handlinger
    setIsAddIncomeModalOpen(true);
  };

  const handleCloseAddIncomeModal = () => {
    setIsAddIncomeModalOpen(false);
  };

  // ######################################
  // ## Håndter gem af ændringer i modal ##
  // ######################################

  const handleSaveIncomeRecord = async (
    id: string,
    updatedData: IncomeUpdatePayload
  ) => {
    setSaveError(null);
    try {
      const updatedRecordFromApi = await updateIncomeRecord(id, updatedData);

      // For debugging: Se hvad backend returnerer, og hvad der blev sendt
      console.log("Updated record from API:", updatedRecordFromApi);
      console.log("Data sent for update (updatedData):", updatedData);

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
      throw error;
    }
  };

  // ########################################
  // ## Håndter sletning af incomeRecord ##
  // ########################################

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    setIsDeleting(true);
    setSaveError(null);
    try {
      await deleteIncomeRecord(recordToDelete.id);
      setIncomeData((prevData) =>
        prevData.filter((record) => record.id !== recordToDelete.id)
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete income record:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ukendt fejl ved sletning.";
      // setSaveError(`Kunne ikke slette post: ${errorMessage}`);
      throw error; // Hvis ConfirmDeleteModal skal håndtere sin egen fejlvisning
    } finally {
      setIsDeleting(false);
    }
  };

  // #######################################
  // ## Håndter oprettelse af ny indkomst ##
  // #######################################

  const handleCreateNewIncome = async (newIncomeData: IncomeCreatePayload) => {
    setSaveError(null);
    try {
      const createdRecord = await createIncomeRecord(newIncomeData);
      // Tilføj den nye record til starten af arrayet for øjeblikkelig UI opdatering
      // eller fetchIncomeData() igen for at få den seneste liste inkl. den nye.
      // At tilføje lokalt er hurtigere for UI.
      setIncomeData((prevData) => [createdRecord, ...prevData]);
      handleCloseAddIncomeModal();
    } catch (error) {
      console.error("Failed to create new income record:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ukendt fejl ved oprettelse.";
      setSaveError(`Kunne ikke oprette indkomst: ${errorMessage}`);
      throw error; // Kast fejlen videre så AddIncomeModal kan fange den
    }
  };

  // #########################################
  // ## Vis loading indikator og fejlbesked ##
  // #########################################

  if (isLoading) {
    return (
      <main className="container mx-auto p-8 text-center">
        <p>Henter data...</p>
        {/* Du kan tilføje en mere avanceret spinner/loading komponent her */}
      </main>
    );
  }

  // ############################################
  // ## Beregn data til grafer og summaryCards ##
  // ############################################

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

  // Forbear data til cirkeldiagram
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

  // Konverter til array for Recharts
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

  // Konverter til array for Recharts
  const formattedBarChartData = Object.values(categoryAnalysisData);

  // Filtrer kategorier til kun at inkludere dem af typen 'income' for AddIncomeModal
  const incomeCategories = allCategories.filter((cat) => cat.type === "income");

  // ###########################################
  // ## Render UI med data og modal komponent ##
  // ###########################################

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
      {fetchCategoriesError && !allCategories.length && (
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Advarsel!</strong>
          <span className="block sm:inline">
            {" "}
            {fetchCategoriesError} Det kan påvirke muligheden for at
            tilføje/redigere indtægter.
          </span>
        </div>
      )}

      {/* Tabel of indtægt */}
      <SummaryTable
        data={incomeData}
        title="Mine Indkomster"
        onEditRow={handleOpenEditModal}
        onDeleteRow={handleOpenDeleteModal}
        onAddIncome={handleOpenAddIncomeModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Cirkeldiagram */}
        <ReusablePieChart
          data={formattedIncomePieData}
          title="Indkomstfordeling (I år)"
        />

        {/* Søjlediagram */}
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
            categories={incomeCategories}
          />
        )}
        {isDeleteModalOpen && recordToDelete && (
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            itemName={
              recordToDelete.description ||
              `post fra ${formatDateToLocal(recordToDelete.date)}`
            }
            isDeleting={isDeleting}
          />
        )}
        {isAddIncomeModalOpen && (
          <AddIncomeModal
            isOpen={isAddIncomeModalOpen}
            onClose={handleCloseAddIncomeModal}
            onSave={handleCreateNewIncome}
            categories={incomeCategories} // Send kun indkomst-kategorier
            defaultDate={new Date().toISOString().split("T")[0]} // Sæt dagens dato
          />
        )}
      </AnimatePresence>

      {/* Vis global gem-fejl hvis den er sat (f.eks. hvis modalen lukkes før fejlen vises internt) */}
      {saveError &&
        !isEditModalOpen &&
        !isDeleteModalOpen &&
        !isAddIncomeModalOpen && (
          <div
            className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50"
            role="alert"
          >
            <strong className="font-bold">Fejl! </strong>
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
