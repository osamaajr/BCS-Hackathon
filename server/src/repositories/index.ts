import { InMemoryCheckInRepository } from "./InMemoryCheckInRepository";
import { InMemoryInsightsRepository } from "./InMemoryInsightsRepository";
import { MockSupportRepository } from "./MockSupportRepository";

export const repositories = {
  checkIns: new InMemoryCheckInRepository(),
  insights: new InMemoryInsightsRepository(),
  support: new MockSupportRepository(),
};
