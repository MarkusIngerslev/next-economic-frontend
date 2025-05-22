import clsx from "clsx";

export function ProfileSkeleton() {
  return (
    <div className="bg-slate-300 shadow rounded-lg p-6 animate-pulse">
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-slate-400 mr-4"></div>
        <div>
          <div className="h-6 bg-slate-400 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-400 rounded w-48"></div>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="border-b pb-4">
          <div className="h-5 bg-slate-400 rounded w-40 mb-2"></div>
          <div className="h-4 bg-slate-400 rounded w-56 mb-2"></div>
          <div className="h-4 bg-slate-400 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-400 rounded w-32"></div>
        </div>
        <div>
          <div className="h-5 bg-slate-400 rounded w-40 mb-2"></div>
          <div className="h-10 bg-slate-400 rounded w-28"></div>
        </div>
      </div>
    </div>
  );
}

export function SummaryCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "bg-gray-700 p-4 rounded shadow-xl animate-pulse",
        className
      )}
    >
      <div className="h-5 bg-slate-500 rounded w-3/4 mb-3"></div>
      <div className="h-8 bg-slate-500 rounded w-1/2"></div>
    </div>
  );
}

export function SummaryTableSkeleton() {
  return (
    <div className="bg-gray-700 mb-8 rounded shadow-xl animate-pulse overflow-x-auto">
      <div className="flex justify-between items-center my-4 mx-4">
        <div className="flex items-center space-x-4">
          <div className="h-6 bg-slate-500 rounded w-48"></div>
          <div className="flex items-center space-x-1">
            <div className="h-7 w-7 bg-slate-600 rounded"></div>
            <div className="h-7 w-12 bg-slate-600 rounded"></div>
            <div className="h-7 w-7 bg-slate-600 rounded"></div>
          </div>
        </div>
        <div className="h-9 w-28 bg-sky-700 rounded"></div>
      </div>
      <table className="min-w-full divide-y divide-gray-600">
        <thead className="bg-gray-600">
          <tr>
            <th className="px-6 py-3">
              <div className="h-4 bg-slate-500 rounded w-20"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-slate-500 rounded w-32"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-slate-500 rounded w-24"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-slate-500 rounded w-16"></div>
            </th>
            <th className="px-6 py-3">
              <div className="h-4 bg-slate-500 rounded w-20"></div>
            </th>
            <th className="px-3 py-3">
              <div className="h-4 bg-slate-500 rounded w-24"></div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-700 divide-y divide-gray-600">
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-500 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-500 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-500 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-500 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-slate-500 rounded"></div>
              </td>
              <td className="px-3 py-4">
                <div className="flex justify-center items-center space-x-2">
                  <div className="h-5 w-5 bg-slate-600 rounded"></div>
                  <div className="h-5 w-5 bg-slate-600 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ReusablePieChartSkeleton() {
  return (
    <div className="bg-gray-700 p-4 rounded shadow-md animate-pulse h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1"></div>
        <div className="h-6 bg-slate-500 rounded w-1/2 mx-2"></div>
        <div className="flex-1 flex justify-end">
          <div className="h-7 w-12 bg-slate-600 rounded"></div>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-40 h-40 bg-slate-600 rounded-full"></div>
      </div>
      <div className="flex justify-center space-x-2 mt-2">
        <div className="h-3 w-10 bg-slate-500 rounded"></div>
        <div className="h-3 w-12 bg-slate-500 rounded"></div>
        <div className="h-3 w-8 bg-slate-500 rounded"></div>
      </div>
    </div>
  );
}

export function ReusableBarChartSkeleton() {
  return (
    <div className="bg-gray-700 p-4 rounded shadow-md animate-pulse h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1"></div>
        <div className="h-6 bg-slate-500 rounded w-1/2 mx-2"></div>
        <div className="flex-1 flex justify-end">
          <div className="h-7 w-12 bg-slate-600 rounded"></div>
        </div>
      </div>
      <div className="flex-grow flex items-end justify-around px-4 pb-6 border-l border-b border-slate-600 relative">
        <div className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 -rotate-90">
          <div className="h-3 w-16 bg-slate-500 rounded"></div>
        </div>
        <div className="absolute bottom-1 left-0 right-0 flex justify-around">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3 w-10 bg-slate-500 rounded"></div>
          ))}
        </div>
        <div className="h-3/4 w-8 bg-slate-600 rounded-t"></div>
        <div className="h-1/2 w-8 bg-slate-600 rounded-t"></div>
        <div className="h-2/3 w-8 bg-slate-600 rounded-t"></div>
        <div className="h-1/3 w-8 bg-slate-600 rounded-t"></div>
        <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 -rotate-90">
          <div className="h-3 w-16 bg-slate-500 rounded"></div>
        </div>
      </div>
      <div className="flex justify-center space-x-2 mt-2">
        <div className="h-3 w-10 bg-slate-500 rounded"></div>
        <div className="h-3 w-12 bg-slate-500 rounded"></div>
      </div>
    </div>
  );
}
