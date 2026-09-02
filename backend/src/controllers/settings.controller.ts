import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  res.json({ success: true, data: map });
});

export const upsertSettings = asyncHandler(async (req: Request, res: Response) => {
  const updates = req.body as Record<string, string>;
  const ops = Object.entries(updates).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  );
  await Promise.all(ops);
  res.json({ success: true, message: "Settings updated" });
});
