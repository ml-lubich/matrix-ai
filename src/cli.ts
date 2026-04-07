#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { requireMinimaxToken } from "./env.js";
import { runProbe } from "./probe/run-probe.js";
import { traceToHtml } from "./viz/report-html.js";

function printHelp(): void {
  console.log(`matrix-ai probe — MiniMax-backed black-box surface + equity audit

Usage:
  bun run probe --task "Your question or instruction"
  bun run probe --task-file ./prompt.txt [--candidate ./draft.txt]
  bun run probe --task "..." --html ./out/report.html

Environment:
  MINIMAX_API_TOKEN   required
  MINIMAX_MODEL       optional (default M2-her)
  MINIMAX_API_BASE    optional (default https://api.minimax.io)
`);
}

async function readTextFile(path: string): Promise<string> {
  const file = Bun.file(path);
  if (!(await file.exists())) {
    throw new Error(`File not found: ${path}`);
  }
  return file.text();
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  let task = "";
  let taskFile: string | undefined;
  let candidateFile: string | undefined;
  let htmlOut: string | undefined;
  let jsonOut: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--task" && argv[i + 1]) {
      task = argv[++i];
    } else if (a === "--task-file" && argv[i + 1]) {
      taskFile = argv[++i];
    } else if (a === "--candidate" && argv[i + 1]) {
      candidateFile = argv[++i];
    } else if (a === "--html" && argv[i + 1]) {
      htmlOut = argv[++i];
    } else if (a === "--json" && argv[i + 1]) {
      jsonOut = argv[++i];
    }
  }

  if (taskFile) {
    task = (await readTextFile(taskFile)).trim();
  }

  if (!task) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  let candidate: string | undefined;
  if (candidateFile) {
    candidate = (await readTextFile(candidateFile)).trim();
  }

  const apiKey = requireMinimaxToken();
  const trace = await runProbe(apiKey, { task, candidateOutput: candidate });

  const payload = {
    task,
    trace,
    generated_at: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));

  if (jsonOut) {
    const jp = resolve(jsonOut);
    await mkdir(dirname(jp), { recursive: true });
    await writeFile(jp, JSON.stringify(payload, null, 2), "utf8");
  }

  if (htmlOut) {
    const hp = resolve(htmlOut);
    await mkdir(dirname(hp), { recursive: true });
    const html = traceToHtml("matrix-ai probe report", task, trace);
    await writeFile(hp, html, "utf8");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
