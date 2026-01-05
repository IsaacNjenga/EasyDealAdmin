import cron from "node-cron";
import { cleanupExpiredOffers } from "../utils/expiredOffers.js";

// Run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Running expired offers cleanup...");
  try {
    await cleanupExpiredOffers();
  } catch (error) {
    console.error("Cron job error:", error);
  }
});

console.log("✓ Cron job scheduled: Cleanup expired offers every 15 minutes");