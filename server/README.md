# Nura Backend

Nura is a hackathon health-tech prototype for preventative wellbeing. This backend powers risk scoring, AI wellbeing summaries, preventative recommendations, mock weekly reports, and Liverpool/Merseyside support service suggestions.

Nura is not a medical device, diagnostic system, or replacement for healthcare professionals.

## Architecture

The backend uses a lightweight layered architecture:

```text
routes -> controllers -> services -> repositories/data layer
```

- `routes/`: Express route definitions.
- `controllers/`: HTTP request/response handling and validation.
- `services/`: business logic, scoring, recommendations, OpenAI integration.
- `repositories/`: interfaces plus in-memory/mock implementations.
- `data/`: realistic mock weekly report and support services.
- `constants/`: reusable disclaimers and risk thresholds.
- `types/`: TypeScript interfaces used across the API.

Repositories are intentionally interface-driven, so a real database can later replace the mock implementations without rewriting controllers or services.

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The server runs on:

```text
http://localhost:4000
```

`npm run dev` uses `ts-node-dev` for fast TypeScript reloads. A nodemon-based option is also available:

```bash
npm run dev:nodemon
```

## Environment Variables

```text
PORT=4000
HOST=127.0.0.1
CORS_ORIGIN=http://127.0.0.1:8080
OPENAI_API_KEY=optional-for-ai-summaries
OPENAI_MODEL=gpt-4.1-mini
```

If `OPENAI_API_KEY` is missing or the OpenAI request fails, the backend returns a safe fallback summary.

## API Endpoints

### Health

```http
GET /health
```

### Generate Wellbeing Insight

```http
POST /api/insights
Content-Type: application/json
```

Request:

```json
{
  "wellbeingData": {
    "sleepHours": 5.5,
    "moodScore": 5,
    "stressScore": 8,
    "activityMinutes": 12,
    "restingHeartRate": 88,
    "waterIntake": 1.2,
    "fatigueLevel": 8,
    "socialInteraction": 3,
    "smokingAlcohol": false,
    "notes": "Felt tired and under pressure today."
  }
}
```

Response:

```json
{
  "score": 61,
  "level": "Moderate",
  "factors": [
    {
      "key": "stress",
      "label": "Elevated stress",
      "reason": "Stress was 8/10, suggesting a higher strain day.",
      "weight": 7
    }
  ],
  "aiSummary": "Your current wellbeing score appears moderately elevated...",
  "recommendations": [
    {
      "id": "stress-reset",
      "title": "Add a short stress reset",
      "description": "Try ten minutes of breathing, stretching, journaling, or a quiet walk to help your system settle.",
      "category": "stress"
    }
  ],
  "disclaimer": "Nura is a preventative wellbeing assistant and not a medical diagnostic tool. It does not replace professional medical advice."
}
```

### Mock Weekly Report

```http
GET /api/mock-weekly-report
```

Returns average score, weekly trend, sleep/stress/mood trends, summary text, and chart data.

### Support Services

```http
GET /api/support/:riskLevel
```

Supported risk levels:

```text
Low
Moderate
High
```

Example:

```http
GET /api/support/Moderate
```

Response:

```json
{
  "riskLevel": "Moderate",
  "services": [
    {
      "id": "nhs-111",
      "name": "NHS 111",
      "description": "Non-emergency NHS advice if symptoms or wellbeing patterns feel concerning or are not improving.",
      "urgency": "Medium",
      "openingHours": "24/7",
      "contact": "Call 111 or visit 111.nhs.uk",
      "disclaimer": "Nura is a preventative wellbeing assistant and not a medical diagnostic tool. It does not replace professional medical advice."
    }
  ]
}
```

## Frontend Integration

From React, submit the daily form to:

```text
POST http://localhost:4000/api/insights
```

Then display:

- `score`
- `level`
- `factors`
- `aiSummary`
- `recommendations`
- `disclaimer`

Use:

```text
GET http://localhost:4000/api/mock-weekly-report
GET http://localhost:4000/api/support/Moderate
```

for the weekly report and support pages.

## Future Database Integration

Replace the mock repository classes:

- `InMemoryCheckInRepository`
- `InMemoryInsightsRepository`
- `MockSupportRepository`

with database-backed implementations that satisfy the same interfaces:

- `CheckInRepository`
- `InsightsRepository`
- `SupportRepository`

The controllers and services should not need to change.
