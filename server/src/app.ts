import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MEDICAL_DISCLAIMER } from "./constants/disclaimers";
import { createApiRouter } from "./routes";
import { errorMiddleware } from "./utils/errorMiddleware";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || "http://127.0.0.1:8080" }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok",
      service: "Nura backend",
      disclaimer: MEDICAL_DISCLAIMER,
    });
  });

  app.use("/api", createApiRouter());
  app.use(errorMiddleware);

  return app;
}
