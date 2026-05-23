import { useMemo, useState } from "react";
import { FiDownload, FiPlus, FiSearch } from "react-icons/fi";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import { useApp } from "../context/AppContext";
import { downloadCsv, downloadSimplePdf } from "../utils/exporters";

export default function ModulePage({
  title,
  collection,
  label,
  fields,
  columns,
  filters = [],
  defaultItem = {},
  enrich = (item) => item,
  onView,
  onPrint
}) {
  const { data, createItem, updateItem, deleteItem, askConfirm } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const rows = data[collection].map(enrich);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const textMatch = JSON.stringify(row).toLowerCase().includes(query.toLowerCase());
      const filterMatch = filter === "All" || filters.some((item) => item.value === filter && String(row[item.key]) === item.value);
      return textMatch && filterMatch;
    });
  }, [rows, query, filter, filters]);

  function openCreate() {
    setEditing({ ...defaultItem });
    setShowForm(true);
  }

  function submit(event) {
    event.preventDefault();
    if (editing.id) updateItem(collection, editing.id, editing, label);
    else createItem(collection, editing, label);
    setShowForm(false);
    setEditing(null);
  }

  function remove(row) {
    askConfirm({
      title: `Delete ${label}`,
      message: `This will permanently delete ${row.name || row.id}.`,
      onConfirm: () => deleteItem(collection, row.id, label)
    });
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500">{filteredRows.length} records available</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary" onClick={() => downloadCsv(`${collection}.csv`, filteredRows)}><FiDownload /> CSV</button>
          <button className="btn-secondary" onClick={() => downloadSimplePdf(title, filteredRows.map((item) => `${item.id} - ${item.name || item.testName || item.type || item.status}`), `${collection}.pdf`)}><FiDownload /> PDF</button>
          <button className="btn-primary" onClick={openCreate}><FiPlus /> Add {label}</button>
        </div>
      </section>

      <section className="panel p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <label className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input className="field pl-9" placeholder={`Search ${label.toLowerCase()} records`} value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="field" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All</option>
            {filters.map((item) => (
              <option key={`${item.key}-${item.value}`} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
      </section>

      <DataTable rows={filteredRows} columns={columns} onEdit={(row) => { setEditing(row); setShowForm(true); }} onDelete={remove} onView={onView} onPrint={onPrint} />

      {showForm && (
        <FormModal
          title={`${editing.id ? "Edit" : "Add"} ${label}`}
          fields={fields}
          values={editing}
          onChange={(name, value) => setEditing((item) => ({ ...item, [name]: value }))}
          onClose={() => setShowForm(false)}
          onSubmit={submit}
          submitLabel={editing.id ? "Save Changes" : `Create ${label}`}
        />
      )}
    </div>
  );
}
