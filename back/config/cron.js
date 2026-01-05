import cron from "node-cron";
import { cleanupExpiredOffers } from "../utils/expiredOffers.js";

cron.schedule("*/15 * * * *", async () => {
  await cleanupExpiredOffers();
});
