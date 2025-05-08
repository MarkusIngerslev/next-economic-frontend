"use client";

import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { IncomeRecord } from "@/services/api";
import { PencilIcon } from "@heroicons/react/24/outline";

interface SummaryTableProps {
  data: IncomeRecord[];
  title?: string;
  onEditRow?: (record: IncomeRecord) => void; // Callback for når en række skal redigeres
}

export default function SummaryTable({
  data,
  title = "Transaktionsoversigt",
  onEditRow,
}: SummaryTableProps) {
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
            {onEditRow && (
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Handlinger
              </th>
            )}
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
              {onEditRow && (
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditRow(item);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 p-1 rounded-md hover:bg-indigo-100 transition-colors"
                    aria-label={`Rediger ${item.description || "post"}`}
                    title="Rediger post"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {/* Her kan du tilføje en slet knap senere */}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
