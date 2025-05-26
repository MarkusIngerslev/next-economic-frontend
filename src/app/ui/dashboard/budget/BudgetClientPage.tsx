"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

// Komponenter
import SummaryCard from "@/app/ui/dashboard/finance/summaryCard";
import SummaryTable from "@/app/ui/dashboard/finance/summaryTable";
import EditFinanceModal from "@/app/ui/dashboard/finance/editFinanceModal";
import ConfirmDeleteModal from "@/app/ui/dashboard/finance/confirmDeleteModal";
import AddIncomeModal from "@/app/ui/dashboard/finance/createNewModal";
import {
  SummaryCardSkeleton,
  SummaryTableSkeleton,
  ReusablePieChartSkeleton,
  ReusableBarChartSkeleton,
} from "@/app/ui/skeletons/skeleton";

// API kald
import {
  getMyIncome,
  IncomeRecord,
  updateIncomeRecord,
  IncomeUpdatePayload,
  deleteIncomeRecord,
  createIncomeRecord,
  IncomeCreatePayload,
} from "@/services/api";
import { getAllCategories, Category } from "@/services/api/category";

// Beregningsfunktioner
import {
  calculateIncomeThisYear,
  calculateIncomeThisMonth,
  calculateAverageMonthlyIncomeThisYear,
} from "@/app/lib/budgetCalculations";
import { formatDateToLocal } from "@/app/lib/utils";

// Graf komponenter
import ReusablePieChart from "@/app/ui/dashboard/graphs/ReusablePieChart";
import ReusableBarChart from "@/app/ui/dashboard/graphs/ReusableBarChart";
import MonthYearSelector from "@/app/ui/dashboard/finance/MonthYearSelector";

export default function BudgetClientPage() {
  // #######################################
  // ## Definer state og initialiser data ##
  // #######################################

  // State til at holde data, fejl og loading status
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthlyGraphData, setShowMonthlyGraphData] = useState(false);

  // State for paginering
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10; // Antal rækker per side

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

  // Udled måned og år fra selectedDate
  const _selectedYear = selectedDate.getFullYear();
  const _selectedMonth = selectedDate.getMonth();
  const _selectedMonthName = selectedDate.toLocaleString("da-DK", {
    month: "long",
  });

  // Nulstil currentPage når selectedDate (og dermed datasættet for tabellen) ændres
  useEffect(() => {
    setCurrentPage(1);
  }, [_selectedMonth, _selectedYear]);

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

      // Kunstig forsinkelse på 5 sekunder
      // await new Promise((resolve) => setTimeout(resolve, 5000));

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

  // ############################
  // ## Beregn data til grafer ##
  // ############################

  // Forbered data til cirkeldiagram baseret på toggle
  const formattedIncomePieData = useMemo(() => {
    let filteredForDate = incomeData;
    if (showMonthlyGraphData) {
      filteredForDate = incomeData.filter(
        (record) =>
          new Date(record.date).getFullYear() === _selectedYear &&
          new Date(record.date).getMonth() === _selectedMonth
      );
    } else {
      filteredForDate = incomeData.filter(
        (record) => new Date(record.date).getFullYear() === _selectedYear
      );
    }

    const pieChartData = filteredForDate
      .filter((record) => record.category.type === "income")
      .reduce((acc, record) => {
        const categoryName = record.category.name;
        const amount = parseFloat(record.amount);
        acc[categoryName] = (acc[categoryName] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);
    return Object.entries(pieChartData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [incomeData, _selectedYear, _selectedMonth, showMonthlyGraphData]);

  // Forbered data til Bar Chart baseret på toggle
  const formattedIncomeBarChartData = useMemo(() => {
    let filteredForDate = incomeData;
    if (showMonthlyGraphData) {
      filteredForDate = incomeData.filter(
        (record) =>
          new Date(record.date).getFullYear() === _selectedYear &&
          new Date(record.date).getMonth() === _selectedMonth
      );
    } else {
      filteredForDate = incomeData.filter(
        (record) => new Date(record.date).getFullYear() === _selectedYear
      );
    }

    const categoryAnalysisData = filteredForDate
      .filter((record) => record.category.type === "income")
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
    return Object.values(categoryAnalysisData);
  }, [incomeData, _selectedYear, _selectedMonth, showMonthlyGraphData]);

  // ########################################
  // ## Håndter åbning og lukning af modals ##
  // ########################################

  // Edit Modal Handlers
  const handleOpenEditModal = (record: IncomeRecord) => {
    setSelectedIncomeRecord(record);
    setIsEditModalOpen(true);
    setSaveError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedIncomeRecord(null);
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = (record: IncomeRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
    setSaveError(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  // Add Income Modal Handlers
  const handleOpenAddIncomeModal = () => {
    setSaveError(null);
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
      setSaveError(`Kunne ikke slette : ${errorMessage}`);
      throw error;
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
      <main className="container mx-auto p-8 relative">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-500 rounded w-1/2 mb-6"></div>{" "}
          {/* Page title skeleton */}
          <div className="mb-6 flex justify-center">
            <div className="h-10 bg-slate-600 rounded w-64"></div>{" "}
            {/* MonthYearSelector skeleton */}
          </div>
        </div>

        <div className="w-3/4 mx-auto mb-8 ">
          <div className="flex flex-wrap justify-center mb-4 gap-4">
            <SummaryCardSkeleton className="max-w-xs w-full" />
            <SummaryCardSkeleton className="max-w-xs w-full" />
            <SummaryCardSkeleton className="max-w-xs w-full" />
          </div>
        </div>

        <SummaryTableSkeleton />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <ReusablePieChartSkeleton />
          <ReusableBarChartSkeleton />
        </div>
      </main>
    );
  }

  // ############################################
  // ## Beregn data til grafer og summaryCards ##
  // ############################################

  const incomeForSelectedYear = calculateIncomeThisYear(
    incomeData,
    _selectedYear
  );
  const incomeForSelectedMonth = calculateIncomeThisMonth(
    incomeData,
    _selectedMonth,
    _selectedYear
  );
  const averageMonthlyIncomeForSelectedPeriod =
    calculateAverageMonthlyIncomeThisYear(
      incomeForSelectedYear,
      _selectedMonth
    );

  // Filtrer kategorier til kun at inkludere dem af typen 'income' for AddIncomeModal
  const incomeCategories = allCategories.filter((cat) => cat.type === "income");

  // Filtrer expenseData for at vise kun de poster der matcher den valgte måned og år
  const incomeForSelectedMonthForTable = incomeData.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getFullYear() === _selectedYear &&
      recordDate.getMonth() === _selectedMonth
    );
  });

  // ###########################################
  // ## Render UI med data og modal komponent ##
  // ###########################################

  return (
    <main className="container mx-auto p-8  relative">
      {/* Budget page content */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Overblik over indtægter</h1>
        <div className="mb-6 flex justify-center">
          <MonthYearSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            buttonTextPrefix="Viser udgifter for:"
          />
        </div>
      </div>

      {/* små oplysnings cards */}
      {/* Hovedcontainer: 3/4 bredde, centreret */}
      <div className="w-3/4 mx-auto mb-8 ">
        {/* Flex container til kort */}
        <div className="flex flex-wrap justify-center mb-4 gap-4">
          {/* SummaryCards placeres direkte i flex containeren */}
          <SummaryCard
            className="max-w-xs w-full"
            title={`Årligt Indkomst (${_selectedYear})`}
            content={`${incomeForSelectedYear.toLocaleString()} kr.`}
          />
          <SummaryCard
            className="max-w-xs w-full" // Størrelse defineres her
            title={`Månedlig Indkomst (${selectedDate.toLocaleString("da-DK", {
              month: "long",
            })} ${_selectedYear})`}
            content={`${incomeForSelectedMonth.toLocaleString()} kr.`}
          />
          <SummaryCard
            className="max-w-xs w-full"
            title={`Gns. Månedlig Indkomst (${_selectedYear}, op til ${selectedDate.toLocaleString(
              "da-DK",
              { month: "long" }
            )})`}
            content={`${averageMonthlyIncomeForSelectedPeriod.toLocaleString(
              undefined,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )} kr.`}
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
        data={incomeForSelectedMonthForTable}
        title={`Mine Udgifter - ${selectedDate.toLocaleString("da-DK", {
          month: "long",
          year: "numeric",
        })}`}
        onEditRow={handleOpenEditModal}
        onDeleteRow={handleOpenDeleteModal}
        onAddIncome={handleOpenAddIncomeModal}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={incomeForSelectedMonthForTable.length}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Cirkeldiagram */}
        <ReusablePieChart
          data={formattedIncomePieData}
          baseTitle="Udgiftfordeling"
          year={_selectedYear}
          monthName={_selectedMonthName}
          showMonthlyData={showMonthlyGraphData}
          onToggleDataView={() =>
            setShowMonthlyGraphData(!showMonthlyGraphData)
          }
        />

        {/* Søjlediagram */}
        <ReusableBarChart
          data={formattedIncomeBarChartData}
          baseTitle="Kategorianalyse: Antal & Beløb"
          year={_selectedYear}
          monthName={_selectedMonthName}
          showMonthlyData={showMonthlyGraphData}
          onToggleDataView={() =>
            setShowMonthlyGraphData(!showMonthlyGraphData)
          }
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
          <EditFinanceModal
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
