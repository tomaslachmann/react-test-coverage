import fs from "fs-extra";
import path from "path";

export async function generateDashboard(outputDir: string) {
  const dashboardSrc = path.join(__dirname, "..", "dashboard");
  const dashboardDst = path.join(outputDir);

  try {
    await fs.copy(dashboardSrc, dashboardDst);
    console.log("📊 Dashboard HTML generated");
  } catch (err) {
    console.error("❌ Failed to generate dashboard:", err);
  }
}
