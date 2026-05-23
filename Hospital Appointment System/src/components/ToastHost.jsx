import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useApp } from "../context/AppContext";

export default function ToastHost() {
  const { toasts } = useApp();
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-32px))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 text-sm shadow-soft ${
            toast.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {toast.type === "error" ? <FiXCircle /> : <FiCheckCircle />}
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
}
