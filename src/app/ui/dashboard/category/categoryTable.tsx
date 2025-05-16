import { Category } from "@/services/api/category";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface CategoryTableProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onEditCategory,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-gray-700 p-6 rounded-lg shadow-md border border-gray-600">
        <p className="text-center text-gray-400">
          Ingen kategorier fundet for denne type.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-700 rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg border border-gray-600">
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-gray-600">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Navn
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider w-[120px]"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider w-24"
            >
              <span className="sr-only">Handlinger</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-600">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 w-[120px]">
                {category.type === "income" ? "Indtægt" : "Udgift"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
                <button
                  onClick={() => onEditCategory(category)}
                  className="text-cyan-400 hover:text-cyan-300 p-1 rounded-md hover:bg-gray-500 transition-colors"
                  title="Rediger kategori"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  <span className="sr-only">Rediger</span>
                </button>
                {/* Her kan du tilføje en slet knap senere */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
