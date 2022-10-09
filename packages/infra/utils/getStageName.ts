import { toKebab } from "./changeCase";

export function getStageName(branch: string): string {
  return toKebab(
    branch === "main" || branch === "master" ? "prod" : branch === "develop" ? "dev" : branch
  );
}
