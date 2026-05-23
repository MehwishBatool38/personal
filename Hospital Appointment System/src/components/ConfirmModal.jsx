import { FiAlertCircle } from "react-icons/fi";
import { useApp } from "../context/AppContext";

export default function ConfirmModal() {
  const { confirmState, confirmAction, cancelConfirm } = useApp();
  if (!confirmState) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-100 p-3 text-amber-700">
            <FiAlertCircle />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{confirmState.title || "Confirm action"}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{confirmState.message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={cancelConfirm}>Cancel</button>
          <button className="btn-danger" onClick={confirmAction}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
