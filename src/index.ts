import { Command } from "commander";
import { parseCoverage } from "./coverageParser";
import { findHooks } from "./hookMapper";
import { generateDashboard } from "./dashboardGenerator";
import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .name("react-coverage-analyzer")
  .description("Analyze React components and custom hooks test coverage")
  .option(
    "-i, --input <path>",
    "Path to coverage-final.json",
    "coverage/coverage-final.json",
  )
  .option("-o, --output <dir>", "Output directory for dashboard", "dist")
  .action(async (opts) => {
    const coverageData = await parseCoverage(opts.input);
    const hooks = await findHooks();
    await fs.ensureDir(opts.output);

    const report = {
      hooks,
      coverage: coverageData,
    };

    const reportPath = path.join(opts.output, "report.json");
    await fs.writeJson(reportPath, report, { spaces: 2 });

    await generateDashboard(opts.output);

    console.log(
      "✅ Report generated at:",
      path.resolve(opts.output, "index.html"),
    );
  });

program.parse();
