import jsPDF from "jspdf";

export function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => `"${String(row[key] ?? "").replaceAll('"', '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadSimplePdf(title, lines, filename) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  lines.forEach((line, index) => doc.text(String(line), 14, 32 + index * 7));
  doc.save(filename);
}

export function invoiceTotal(bill) {
  return Number(bill.consultationFee || 0) + Number(bill.medicines || 0) + Number(bill.tests || 0) + Number(bill.roomCharges || 0);
}
