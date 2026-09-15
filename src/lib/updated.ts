import { execSync } from "node:child_process";

// "Updated" means the last content commit, not the last deploy. Falls back to
// the build time if git is not available where the site is built. Read once at
// build time and shared by the title block (revision date) and the footer.
function lastCommitIso(): string | null {
	try {
		const iso = execSync("git log -1 --format=%cI", { encoding: "utf8" }).trim();
		return iso || null;
	} catch {
		return null;
	}
}

const iso = lastCommitIso();

export const updatedAt: Date = iso ? new Date(iso) : new Date();

/** YYYY-MM-DD in the committer's own timezone, the way a drawing revision is stamped. */
export const updatedIso: string = (iso ?? new Date().toISOString()).slice(0, 10);
