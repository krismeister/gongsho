import fs from "fs";
import path from "path";
import ts from "typescript";

export const PROJECT_ROOT = path.resolve(__dirname, "..", "..", "project");

export const getProjectFiles = () => {
  return fs.readdirSync(PROJECT_ROOT);
};

export const getProjectFileContents = (file: string) => {
  return fs.readFileSync(path.resolve(PROJECT_ROOT, file), "utf8");
};

export const getProjectFileAST = (file: string) => {
  const contents = getProjectFileContents(file);
  return ts.createSourceFile(file, contents, ts.ScriptTarget.ESNext);
};

export const getProjectFileASTs = () => {
  const files = getProjectFiles();
  return files.map((file) => getProjectFileAST(file));
};
