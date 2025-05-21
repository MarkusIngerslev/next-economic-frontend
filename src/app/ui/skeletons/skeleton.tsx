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
