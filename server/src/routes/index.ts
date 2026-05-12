import { Router } from "express";
import { CheckInController } from "../controllers/checkInController";
import { InsightController } from "../controllers/insightController";
import { ReportController } from "../controllers/reportController";
import { SupportController } from "../controllers/supportController";
import { repositories } from "../repositories";
import { AiService } from "../services/aiService";
import { CheckInService } from "../services/checkInService";
import { InsightService } from "../services/insightService";
import { ReportService } from "../services/reportService";
import { SupportServiceLayer } from "../services/supportService";
import { createCheckInRoutes } from "./checkInRoutes";
import { createInsightRoutes } from "./insightRoutes";
import { createReportRoutes } from "./reportRoutes";
import { createSupportRoutes } from "./supportRoutes";

export function createApiRouter(): Router {
  const router = Router();

  const aiService = new AiService();
  const checkInService = new CheckInService(repositories.checkIns);
  const insightService = new InsightService(repositories.checkIns, repositories.insights, aiService);
  const reportService = new ReportService(repositories.checkIns);
  const supportService = new SupportServiceLayer(repositories.support);

  router.use(createCheckInRoutes(new CheckInController(checkInService)));
  router.use(createInsightRoutes(new InsightController(insightService)));
  router.use(createReportRoutes(new ReportController(reportService)));
  router.use(createSupportRoutes(new SupportController(supportService)));

  return router;
}
