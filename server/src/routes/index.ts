import { Router } from "express";
import { InsightController } from "../controllers/insightController";
import { ReportController } from "../controllers/reportController";
import { SupportController } from "../controllers/supportController";
import { repositories } from "../repositories";
import { AiService } from "../services/aiService";
import { InsightService } from "../services/insightService";
import { ReportService } from "../services/reportService";
import { SupportServiceLayer } from "../services/supportService";
import { createInsightRoutes } from "./insightRoutes";
import { createReportRoutes } from "./reportRoutes";
import { createSupportRoutes } from "./supportRoutes";

export function createApiRouter(): Router {
  const router = Router();

  const aiService = new AiService();
  const insightService = new InsightService(repositories.checkIns, repositories.insights, aiService);
  const reportService = new ReportService(repositories.checkIns);
  const supportService = new SupportServiceLayer(repositories.support);

  router.use(createInsightRoutes(new InsightController(insightService)));
  router.use(createReportRoutes(new ReportController(reportService)));
  router.use(createSupportRoutes(new SupportController(supportService)));

  return router;
}
