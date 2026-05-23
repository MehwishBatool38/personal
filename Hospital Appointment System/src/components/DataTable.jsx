import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEdit2, FiEye, FiPrinter, FiTrash2 } from "react-icons/fi";

export default function DataTable({ rows, columns, onEdit, onDelete, onView, onPrint, actions = true }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-950">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-bold text-slate-600 dark:text-slate-300">{column.label}</th>
              ))}
              {actions && <th className="px-4 py-3 text-right font-bold text-slate-600 dark:text-slate-300">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-medical-50/70 dark:hover:bg-slate-800">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {onView && <button className="btn-secondary !min-h-9 !px-3" onClick={() => onView(row)} title="View"><FiEye /></button>}
                      {onPrint && <button className="btn-secondary !min-h-9 !px-3" onClick={() => onPrint(row)} title="Print"><FiPrinter /></button>}
                      {onEdit && <button className="btn-secondary !min-h-9 !px-3" onClick={() => onEdit(row)} title="Edit"><FiEdit2 /></button>}
                      {onDelete && <button className="btn-danger !min-h-9 !px-3" onClick={() => onDelete(row)} title="Delete"><FiTrash2 /></button>}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!pageRows.length && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length + 1}>No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button className="btn-secondary !min-h-9 !px-3" disabled={page === 1} onClick={() => setPage((item) => item - 1)}><FiChevronLeft /></button>
          <button className="btn-secondary !min-h-9 !px-3" disabled={page === totalPages} onClick={() => setPage((item) => item + 1)}><FiChevronRight /></button>
        </div>
      </div>
    </div>
  );
}
