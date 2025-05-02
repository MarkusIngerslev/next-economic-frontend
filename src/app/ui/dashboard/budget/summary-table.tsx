"use client";

import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";

// Define the structure of the data object
interface TransactionData {
  id: string;
  amount: string;
  category: {
    id: string;
    name: string;
    type: "income" | "expense";
  };
  description: string;
  date: string;
}

// Define the props for the SummaryTable component
interface SummaryTableProps {
  data: TransactionData[];
  title?: string; // Optional title for the table
}

export default function SummaryTable({
  data,
  title = "Transaktionsoversigt",
}: SummaryTableProps) {
  // Handle cases where data might be empty or undefined
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow-xl text-stone-600">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p>Ingen data at vise.</p>
      </div>
    );
  }

  return (
    <div className="bg-white mb-8 rounded shadow-xl text-stone-600 overflow-x-auto">
      <h2 className="text-xl font-bold my-4 ms-4">{title}</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Dato
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Beskrivelse
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Kategori
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Beløb
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDateToLocal(item.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                {item.category.type === "income" ? "Indkomst" : "Udgift"}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  item.category.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(parseFloat(item.amount))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
