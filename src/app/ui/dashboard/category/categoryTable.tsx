import { Category } from "@/services/api/category";

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-400">
          Ingen kategorier fundet for denne type.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Navn
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
            >
              Type
            </th>
            {/* <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Handlinger</span>
            </th> */}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-750">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {category.type === "income" ? "Indtægt" : "Udgift"}
              </td>
              {/* Eksempel på handlingscelle
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Edit</a>
              </td>
              */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
