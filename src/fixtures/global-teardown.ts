async function globalTeardown() {
  console.log("\n========================================");
  console.log(`  TEST SUITE FINISHED`);
  console.log(`  Time: ${new Date().toISOString()}`);
  console.log("========================================\n");
}

export default globalTeardown;
