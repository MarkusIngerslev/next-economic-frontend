"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Komponenter
import SummaryCard from "@/app/ui/dashboard/finance/summaryCard";
import SummaryTable from "@/app/ui/dashboard/finance/summaryTable";
import EditFinanceModal from "@/app/ui/dashboard/finance/editFinanceModal";
import ConfirmDeleteModal from "@/app/ui/dashboard/finance/confirmDeleteModal";
import AddIncomeModal from "@/app/ui/dashboard/finance/createNewModal";

// API kald
import {
  getMyExpense,
  ExpenseRecord,
  updateExpenseRecord,
  ExpenseUpdatePayload,
  deleteExpenseRecord,
  createExpenseRecord,
  ExpenseCreatePayload,
} from "@/services/api/expense";
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

export default function SpendingClientPage() {
  // #######################################
  // ## Definer state og initialiser data ##
  // #######################################

  // State til at holde data, fejl og loading status
  const [expenseData, setExpenseData] = useState<ExpenseRecord[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpenseRecord, setSelectedExpenseRecord] =
    useState<ExpenseRecord | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // State for Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ExpenseRecord | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // State for Add Expense modal
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [fetchCategoriesError, setFetchCategoriesError] = useState<
    string | null
  >(null);

  // Udled måned og år fra selectedDate
  const _selectedYear = selectedDate.getFullYear();
  const _selectedMonth = selectedDate.getMonth();

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
      const [expense, categories] = await Promise.all([
        getMyExpense(),
        getAllCategories(),
      ]);
      setExpenseData(expense);
      setAllCategories(categories);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      if (!expenseData.length) setFetchError("Kunne ikke hente indkomstdata.");
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
  const handleOpenEditModal = (record: ExpenseRecord) => {
    setSelectedExpenseRecord(record);
    setIsEditModalOpen(true);
    setSaveError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedExpenseRecord(null);
  };

  // Delete Modal Handlers
  const handleOpenDeleteModal = (record: ExpenseRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
    setSaveError(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  // Add Expense Modal Handlers
  const handleOpenAddExpenseModal = () => {
    setSaveError(null);
    setIsAddExpenseModalOpen(true);
  };

  const handleCloseAddExpenseModal = () => {
    setIsAddExpenseModalOpen(false);
  };

  // ######################################
  // ## Håndter gem af ændringer i modal ##
  // ######################################

  const handleSaveExpenseRecord = async (
    id: string,
    updatedData: ExpenseUpdatePayload
  ) => {
    setSaveError(null);
    try {
      const updatedRecordFromApi = await updateExpenseRecord(id, updatedData);

      // For debugging: Se hvad backend returnerer, og hvad der blev sendt
      console.log("Updated record from API:", updatedRecordFromApi);
      console.log("Data sent for update (updatedData):", updatedData);

      setExpenseData((prevData) =>
        prevData.map((record) =>
          record.id === id ? { ...record, ...updatedRecordFromApi } : record
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to save expense record from page:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ukendt fejl ved gem.";
      setSaveError(`Kunne ikke gemme ændringer: ${errorMessage}`);
      throw error;
    }
  };

  // ########################################
  // ## Håndter sletning af expenseRecord ##
  // ########################################

  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;

    setIsDeleting(true);
    setSaveError(null);
    try {
      await deleteExpenseRecord(recordToDelete.id);
      setExpenseData((prevData) =>
        prevData.filter((record) => record.id !== recordToDelete.id)
      );
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Failed to delete expense record:", error);
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

  const handleCreateNewExpense = async (
    newExpenseData: ExpenseCreatePayload
  ) => {
    setSaveError(null);
    try {
      const createdRecord = await createExpenseRecord(newExpenseData);
      setExpenseData((prevData) => [createdRecord, ...prevData]);
      handleCloseAddExpenseModal();
    } catch (error) {
      console.error("Failed to create new expense record:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ukendt fejl ved oprettelse.";
      setSaveError(`Kunne ikke oprette indkomst: ${errorMessage}`);
      throw error;
    }
  };

  // #########################################
  // ## Vis loading indikator og fejlbesked ##
  // #########################################

  if (isLoading) {
    return (
      <main className="container mx-auto p-8 text-center">
        <p>Henter data...</p>
      </main>
    );
  }

  // ############################################
  // ## Beregn data til grafer og summaryCards ##
  // ############################################

  const expenseForSelectedYear = calculateIncomeThisYear(
    expenseData,
    _selectedYear
  );
  const expenseForSelectedMonth = calculateIncomeThisMonth(
    expenseData,
    _selectedMonth,
    _selectedYear
  );
  const averageMonthlyExpenseForSelectedPeriod =
    calculateAverageMonthlyIncomeThisYear(
      expenseForSelectedYear,
      _selectedMonth // Gennemsnit op til den valgte måned i det valgte år
    );

  // Forbear data til cirkeldiagram
  const expensePieChartData = expenseData
    .filter(
      (record) =>
        new Date(record.date).getFullYear() === _selectedYear &&
        record.category.type === "expense"
    )
    .reduce((acc, record) => {
      const categoryName = record.category.name;
      const amount = parseFloat(record.amount);
      acc[categoryName] = (acc[categoryName] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  // Konverter til array for Recharts
  const formattedExpensePieData = Object.entries(expensePieChartData).map(
    ([name, value]) => ({ name, value })
  );

  // Forbered data til Bar Chart: Antal og Samlet Beløb pr. Kategori (for i år)
  const categoryAnalysisData = expenseData
    .filter(
      (record) =>
        new Date(record.date).getFullYear() === _selectedYear &&
        record.category.type === "expense"
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

  // Filtrer kategorier til kun at inkludere dem af typen 'expense' for AddExpenseModal
  const expenseCategories = allCategories.filter(
    (cat) => cat.type === "expense"
  );

  // Filtrer expenseData for at vise kun de poster der matcher den valgte måned og år
  const expensesForSelectedMonthForTable = expenseData.filter((record) => {
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
    <main className="container mx-auto p-8 relative">
      {/* Budget page content */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Overblik over udgifter</h1>
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
            title={`Årligt forbrug (${_selectedYear})`}
            content={`${expenseForSelectedYear.toLocaleString()} kr.`}
          />
          <SummaryCard
            className="max-w-xs w-full" // Størrelse defineres her
            title={`Månedligt forbrug (${selectedDate.toLocaleString("da-DK", {
              month: "long",
            })} ${_selectedYear})`}
            content={`${expenseForSelectedMonth.toLocaleString()} kr.`}
          />
          <SummaryCard
            className="max-w-xs w-full"
            title={`Gns. Månedlig omk. (${_selectedYear}, op til ${selectedDate.toLocaleString(
              "da-DK",
              { month: "long" }
            )})`}
            content={`${averageMonthlyExpenseForSelectedPeriod.toLocaleString(
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
        data={expensesForSelectedMonthForTable} // Brug filtrerede data
        title={`Mine Udgifter - ${selectedDate.toLocaleString("da-DK", {
          month: "long",
          year: "numeric",
        })}`}
        onEditRow={handleOpenEditModal}
        onDeleteRow={handleOpenDeleteModal}
        onAddIncome={handleOpenAddExpenseModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Cirkeldiagram */}
        <ReusablePieChart
          data={formattedExpensePieData}
          title={`Udgiftfordeling (${_selectedYear})`}
        />

        {/* Søjlediagram */}
        <ReusableBarChart
          data={formattedBarChartData}
          title={`Kategorianalyse: Antal & Beløb (${_selectedYear})`}
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
        {isEditModalOpen && selectedExpenseRecord && (
          <EditFinanceModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            incomeRecord={selectedExpenseRecord}
            onSave={handleSaveExpenseRecord}
            categories={expenseCategories}
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
        {isAddExpenseModalOpen && (
          <AddIncomeModal
            isOpen={isAddExpenseModalOpen}
            onClose={handleCloseAddExpenseModal}
            onSave={handleCreateNewExpense}
            categories={expenseCategories} // Send kun indkomst-kategorier
            defaultDate={new Date().toISOString().split("T")[0]} // Sæt dagens dato
          />
        )}
      </AnimatePresence>

      {/* Vis global gem-fejl hvis den er sat (f.eks. hvis modalen lukkes før fejlen vises internt) */}
      {saveError &&
        !isEditModalOpen &&
        !isDeleteModalOpen &&
        !isAddExpenseModalOpen && (
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
