export default function Skeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="panel h-28 animate-pulse bg-slate-100 dark:bg-slate-800" />
      ))}
    </div>
  );
}
