import { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("\n========================================");
  console.log(`  TEST SUITE STARTED`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log(`  Projects: ${config.projects.map((p) => p.name).join(", ")}`);
  console.log("========================================\n");
}

export default globalSetup;
