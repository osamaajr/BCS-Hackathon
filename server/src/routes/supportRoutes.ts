import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import type { SupportController } from "../controllers/supportController";

export function createSupportRoutes(controller: SupportController): Router {
  const router = Router();

  router.get("/support/:riskLevel", asyncHandler(controller.getSupportServices));

  return router;
}
