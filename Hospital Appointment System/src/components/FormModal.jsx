export default function FormModal({ title, fields, values, onChange, onClose, onSubmit, submitLabel = "Save" }) {
  if (!values) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
      <form onSubmit={onSubmit} className="my-8 w-full max-w-3xl rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "md:col-span-2" : ""}>
              <span className="label">{field.label}</span>
              {field.type === "select" ? (
                <select
                  className="field mt-1"
                  value={values[field.name] ?? ""}
                  required={field.required}
                  onChange={(event) => onChange(field.name, event.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  className="field mt-1 min-h-28"
                  value={values[field.name] ?? ""}
                  required={field.required}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              ) : (
                <input
                  className="field mt-1"
                  type={field.type || "text"}
                  min={field.min}
                  value={values[field.name] ?? ""}
                  required={field.required}
                  onChange={(event) => onChange(field.name, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button className="btn-primary" type="submit">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
