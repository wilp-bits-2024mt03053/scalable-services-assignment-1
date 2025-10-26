export function SkeletonVisitor() {
  return (
    <div className="flex flex-col text-xs text-right animate-pulse">
      <span className="font-bold bg-slate-700 rounded w-16 h-4 mb-1" />
      <span className="bg-slate-700 rounded w-24 h-4 mb-1" />
      <span className="bg-slate-800 rounded w-32 h-4" />
    </div>
  );
}
