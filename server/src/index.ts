import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";

const app = express();

const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "api", timestamp: new Date().toISOString() });
});

app.use("/api/items", itemsRouter);

// Basic error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

