"use client";

import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { IncomeRecord } from "@/services/api";
import {
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

interface SummaryTableProps {
  data: IncomeRecord[];
  title?: string;
  onEditRow?: (record: IncomeRecord) => void;
  onDeleteRow?: (record: IncomeRecord) => void;
  onAddIncome?: () => void;
}

export default function SummaryTable({
  data,
  title = "Transaktionsoversigt",
  onEditRow,
  onDeleteRow,
  onAddIncome,
}: SummaryTableProps) {
  // Vis stadig "Tilføj" knap selvom der ikke er data
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-700 p-4 rounded shadow-xl text-gray-300">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-100">{title}</h2>{" "}
          {onAddIncome && (
            <button
              onClick={onAddIncome}
              className="flex items-center px-3 py-1.5 bg-sky-500 text-white text-sm font-medium rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 focus:ring-offset-gray-800"
              title="Tilføj ny indkomst"
            >
              <PlusCircleIcon className="h-5 w-5 mr-1" />
              Tilføj Ny
            </button>
          )}
        </div>
        <p>Ingen data at vise.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 mb-8 rounded shadow-xl text-gray-300 overflow-x-auto">
      <div className="flex justify-between items-center my-4 mx-4">
        <h2 className="text-xl font-bold my-4 ms-4 text-gray-100">{title}</h2>{" "}
        {onAddIncome && (
          <button
            onClick={onAddIncome}
            className="flex items-center px-3 py-1.5 bg-sky-500 text-white text-sm font-medium rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 focus:ring-offset-gray-800"
            title="Tilføj ny indkomst"
          >
            <PlusCircleIcon className="h-5 w-5 mr-1" />
            Tilføj Ny
          </button>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Dato
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Beskrivelse
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Kategori
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Beløb
            </th>
            {(onEditRow || onDeleteRow) && (
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-semibold text-gray-300 uppercase tracking-wider"
              >
                Handlinger
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {formatDateToLocal(item.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {item.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {item.category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 capitalize">
                {item.category.type === "income" ? "Indkomst" : "Udgift"}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                  item.category.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatCurrency(parseFloat(item.amount))}
              </td>
              {(onEditRow || onDeleteRow) && (
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center items-center space-x-2">
                    {onEditRow && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditRow(item);
                        }}
                        className="text-sky-400 hover:text-sky-300 p-1 rounded-md hover:bg-gray-600 transition-colors"
                        aria-label={`Rediger ${item.description || "post"}`}
                        title="Rediger post"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                    {onDeleteRow && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRow(item);
                        }}
                        className="text-red-400 hover:text-red-300 p-1 rounded-md hover:bg-gray-600 transition-colors"
                        aria-label={`Slet ${item.description || "post"}`}
                        title="Slet post"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
