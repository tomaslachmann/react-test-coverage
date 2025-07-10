import fs from "fs-extra";
import { createCoverageMap, CoverageMap } from "istanbul-lib-coverage";

export interface FileCoverageSummary {
  filePath: string;
  lines: {
    total: number;
    covered: number;
    pct: number;
  };
  functions: {
    total: number;
    covered: number;
    pct: number;
  };
  branches: {
    total: number;
    covered: number;
    pct: number;
  };
}

export async function parseCoverage(
  coveragePath: string,
): Promise<FileCoverageSummary[]> {
  if (!(await fs.pathExists(coveragePath))) {
    throw new Error(`Coverage file not found at: ${coveragePath}`);
  }

  const raw = await fs.readJSON(coveragePath);
  const coverageMap: CoverageMap = createCoverageMap(raw);

  const summaries: FileCoverageSummary[] = [];

  coverageMap.files().forEach((file) => {
    const fileCoverage = coverageMap.fileCoverageFor(file).toSummary();

    summaries.push({
      filePath: file,
      lines: {
        total: fileCoverage.lines.total,
        covered: fileCoverage.lines.covered,
        pct: fileCoverage.lines.pct,
      },
      functions: {
        total: fileCoverage.functions.total,
        covered: fileCoverage.functions.covered,
        pct: fileCoverage.functions.pct,
      },
      branches: {
        total: fileCoverage.branches.total,
        covered: fileCoverage.branches.covered,
        pct: fileCoverage.branches.pct,
      },
    });
  });

  return summaries;
}
