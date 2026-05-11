import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { ReportController } from "../controllers/reportController";

export function createReportRoutes(controller: ReportController): Router {
  const router = Router();

  router.get("/mock-weekly-report", asyncHandler(controller.getMockWeeklyReport));

  return router;
}
