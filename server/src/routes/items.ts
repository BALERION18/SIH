import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.post("/", async (req: Request, res: Response) => {
  const { name, description } = req.body as { name?: string; description?: string };
  if (!name) return res.status(400).json({ error: "name is required" });
  const created = await prisma.item.create({ data: { name, description } });
  res.status(201).json(created);
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description } = req.body as { name?: string; description?: string };
  try {
    const updated = await prisma.item.update({ where: { id }, data: { name, description } });
    res.json(updated);
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.item.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "Not found" });
  }
});

export default router;

