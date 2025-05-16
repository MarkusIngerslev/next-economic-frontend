import { Category } from "@/services/api/category";

interface CategoryTableProps {
  categories: Category[];
}

export default function CategoryTable({ categories }: CategoryTableProps) {
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
    <div className="overflow-x-auto bg-gray-700 rounded-tr-lg shadow-lg border border-gray-600">
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
                {" "}
                {/* Fast bredde */}
                {category.type === "income" ? "Indtægt" : "Udgift"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-24">
                {" "}
                {/* Fast bredde */}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
