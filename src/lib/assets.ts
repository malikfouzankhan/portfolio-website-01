import { existsSync } from "node:fs";
import { join } from "node:path";
import { profile } from "@/data/profile";

/** Server-only. The résumé link is hidden until the PDF actually exists in
 *  public/, so the site never ships an anchor that 404s. */
export function hasResume(): boolean {
  try {
    return existsSync(join(process.cwd(), "public", profile.resumeHref));
  } catch {
    return false;
  }
}
