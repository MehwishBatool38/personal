import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const distPath = path.join(__dirname, "dist");

app.use(express.json());
app.use(express.static(distPath));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "MediCore Hospital Management System" });
});

app.use((req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`MediCore React app running at http://localhost:${PORT}`);
});
