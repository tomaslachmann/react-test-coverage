import { FileCoverageSummary } from "./coverageParser";
import { HookInfo } from "./hookMapper";

export interface HookCoverageReport {
  name: string;
  filePath: string;
  exported: boolean;
  coverage: {
    linesPct: number;
    functionsPct: number;
    branchesPct: number;
    linesTotal: number;
    linesCovered: number;
  } | null;
}

export interface CoverageReport {
  generatedAt: string;
  hooks: HookCoverageReport[];
}

export function buildReport(
  hooks: HookInfo[],
  coverageData: FileCoverageSummary[],
): CoverageReport {
  const hooksWithCoverage: HookCoverageReport[] = hooks.map((hook) => {
    const coverage = coverageData.find((file) =>
      file.filePath.endsWith(hook.filePath),
    );

    return {
      name: hook.name,
      filePath: hook.filePath,
      exported: hook.exported,
      coverage: coverage
        ? {
            linesPct: coverage.lines.pct,
            functionsPct: coverage.functions.pct,
            branchesPct: coverage.branches.pct,
            linesTotal: coverage.lines.total,
            linesCovered: coverage.lines.covered,
          }
        : null,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    hooks: hooksWithCoverage,
  };
}
