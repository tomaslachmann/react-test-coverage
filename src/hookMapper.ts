import * as fs from "fs";
import glob from "glob";
import * as babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import { File } from "@babel/types";

export interface HookInfo {
  name: string;
  filePath: string;
  exported: boolean;
  startLine: number;
  endLine: number;
}

export async function findHooks(sourceDir = "src"): Promise<HookInfo[]> {
  const files = glob.sync(`${sourceDir}/**/*.{ts,tsx,js,jsx}`, {
    ignore: ["**/*.test.*", "**/__tests__/**", "node_modules/**"],
  });

  const hooks: HookInfo[] = [];

  for (const filePath of files) {
    const code = fs.readFileSync(filePath, "utf-8");
    let ast: File;

    try {
      ast = babelParser.parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"],
      });
    } catch (err) {
      console.warn(`⚠️  Could not parse ${filePath}`);
      continue;
    }

    traverse(ast, {
      FunctionDeclaration(path) {
        const name = path.node.id?.name;
        if (name?.startsWith("use")) {
          hooks.push({
            name,
            filePath,
            exported: isExported(path),
            startLine: path.node.loc?.start.line || 0,
            endLine: path.node.loc?.end.line || 0,
          });
        }
      },
      VariableDeclaration(path) {
        path.node.declarations.forEach((decl) => {
          if (
            decl.id.type === "Identifier" &&
            decl.id.name.startsWith("use") &&
            (decl.init?.type === "ArrowFunctionExpression" ||
              decl.init?.type === "FunctionExpression")
          ) {
            hooks.push({
              name: decl.id.name,
              filePath,
              exported: isExported(path),
              startLine: decl.loc?.start.line || 0,
              endLine: decl.loc?.end.line || 0,
            });
          }
        });
      },
    });
  }

  return hooks;
}

// Helper to detect export
function isExported(path: any): boolean {
  return (
    path.parentPath?.node?.type === "ExportNamedDeclaration" ||
    path.parentPath?.node?.type === "ExportDefaultDeclaration"
  );
}
