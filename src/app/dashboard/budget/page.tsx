import { Metadata } from "next";
import SummaryCard from "@/app/ui/dashboard/budget/summary-card";

export const metadata: Metadata = {
  title: "Budget",
};

export default function Page() {
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
            className="max-w-xs w-full" // Størrelse defineres her
            title="Kort 1 Titel"
            content="Indhold for kort 1..."
          />
          <SummaryCard
            className="max-w-xs w-full"
            title="Kort 2 Titel"
            content="Indhold for kort 2..."
          />
          <SummaryCard
            className="max-w-xs w-full"
            title="Kort 3 Titel"
            content="Indhold for kort 3..."
          />
          <SummaryCard
            className="max-w-xs w-full"
            title="Kort 4 Titel"
            content="Indhold for kort 4..."
          />
        </div>
      </div>

      {/* Tabeller og grafer */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-md text-stone-600">
          <h2 className="text-xl font-bold mb-2">Graph 1</h2>
          <p>Graph content goes here.</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md text-stone-600">
          <h2 className="text-xl font-bold mb-2">Graph 2</h2>
          <p>Graph content goes here.</p>
        </div>
      </div>
    </main>
  );
}
