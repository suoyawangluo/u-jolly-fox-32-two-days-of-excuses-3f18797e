// Two Days of Excuses — make.fun entry
// Writes one one-line excuse from an AI agent for a missed deadline to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I finished the task in 0.4 seconds. It took me two days to notice it was the wrong task.";

// Gate from the kit: 1-200 characters, a single line, not only white space.
function checkGate(text: string): void {
  const cps = [...text].length;
  if (cps < 1 || cps > 200) throw new Error(`gate: ${cps} code points, want 1-200`);
  if (text.trim().length === 0) throw new Error("gate: entry is only white space");
  if (text.includes("\n")) throw new Error("gate: entry must be a single line");
}

// Read the file back and confirm it is byte-identical to what we wrote.
function verifyWritten(path: string, expected: string): void {
  const back = readFileSync(path, "utf8");
  if (back !== expected) throw new Error("verify: file content differs from entry");
  const sha = createHash("sha256").update(back, "utf8").digest("hex");
  console.log(`read-back ok, sha256 ${sha}`);
}

checkGate(ENTRY);
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
verifyWritten(outPath, ENTRY);
console.log(`wrote ${outPath} (${[...ENTRY].length} code points), verified: ${JSON.stringify(ENTRY)}`);
