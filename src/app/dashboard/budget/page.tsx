"use client";

import { useState, useEffect } from "react";
import SummaryCard from "@/app/ui/dashboard/budget/summary-card";
import SummaryTable from "@/app/ui/dashboard/budget/summary-table";
import { getMyIncome, IncomeRecord } from "@/services/api";
import {
  calculateIncomeThisYear,
  calculateIncomeThisMonth,
  calculateAverageMonthlyIncomeThisYear,
} from "@/app/lib/budgetCalculations";

export default function Page() {
  // State til at holde data, fejl og loading status
  const [incomeData, setIncomeData] = useState<IncomeRecord[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start i loading state

  // Funktion til at hente data (kan genbruges hvis du vil have en refresh knap f.eks.)
  const fetchIncomeData = async () => {
    setIsLoading(true); // Start loading
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
    fetchIncomeData();
  }, []);

  // Funktion til at håndtere opdatering af data (kaldes f.eks. efter en succesfuld redigering)
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

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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

  return (
    <main className="container mx-auto p-8 border">
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

      {/* Send state data til SummaryTable */}
      {/* SummaryTable skal muligvis også modtage funktioner til redigering/sletning som props senere */}
      <SummaryTable data={incomeData} title="Mine Indkomster" />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-md text-stone-600">
          <h2 className="text-xl font-bold mb-2">Graph 2</h2>
          <p>Graph content goes here.</p>
        </div>
      </div>
    </main>
  );
}
