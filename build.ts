import typescript from "./build/compileTypescript";
import styles from "./build/bundleStylesheets";
import assets from "./build/copyAssets";
import pages from "./build/renderPages";
import * as fs from "node:fs";
import { Target } from "./build/target";

const targets: Target[] = [typescript, styles, assets, pages];
const incrementalBuildDelay = 1000;

process.stdout.write(`[${new Date().toISOString()}] Starting rebuild...\n`);
for (const target of targets) {
    process.stdout.write(` - ${target.name}...`);
    await target.build();
    process.stdout.write(` success!\n`);
}
process.stdout.write(`[${new Date().toISOString()}] Finished rebuild.\n`);

process.stdout.write("\n");

if (process.argv.includes("--watch")) {
    let buildTimer: NodeJS.Timeout;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildTimer);
        buildTimer = setTimeout(async () => {
            process.stdout.write(`[${new Date().toISOString()}] Starting incremental build...\n`);
            for (const target of targets) {
                process.stdout.write(` - ${target.name}...`);
                try {
                    await (target.incrementalBuild ?? target.build)();
                    process.stdout.write(` success!\n`);
                } catch (e) {
                    process.stdout.write(` failed: ${e}\n`);
                }
            }

            process.stdout.write(`[${new Date().toISOString()}] Finished incremental build.\n`);
        }, incrementalBuildDelay);
    });
}
