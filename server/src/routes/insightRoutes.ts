import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { InsightController } from "../controllers/insightController";

export function createInsightRoutes(controller: InsightController): Router {
  const router = Router();

  router.post("/insights", asyncHandler(controller.createInsight));

  return router;
}
