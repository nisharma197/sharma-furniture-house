import { Router } from "express";
import { getSettings, upsertSettings } from "../controllers/settings.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", getSettings);
router.put("/", requireAuth, upsertSettings);

export default router;
