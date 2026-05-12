import { Router } from "express";
import type { CheckInController } from "../controllers/checkInController";
import { asyncHandler } from "../utils/asyncHandler";

export function createCheckInRoutes(controller: CheckInController): Router {
  const router = Router();

  router.get("/checkins", asyncHandler(controller.getRecentHistory));

  return router;
}
