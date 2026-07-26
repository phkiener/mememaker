import typescript from "./build/compileTypescript";
import styles from "./build/bundleStylesheets";
import assets from "./build/copyAssets";
import pages from "./build/renderPages";
import * as fs from "node:fs";
import { Target } from "./build/target";

const targets: Target[] = [typescript, styles, assets, pages];
const incrementalBuildDelay = 2000;

for (const target of targets) {
    process.stdout.write(`${target.name}...`);
    await target.build();
    process.stdout.write(` success!\n`);
}

process.stdout.write("\n");

if (process.argv.includes("--watch")) {
    let buildTimer: NodeJS.Timeout;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildTimer);
        buildTimer = setTimeout(async () => {
            for (const target of targets) {
                process.stdout.write(`${target.name}...`);
                try {
                    await (target.incrementalBuild ?? target.build)();
                    process.stdout.write(` success!\n`);
                } catch (e) {
                    process.stdout.write(` failed: ${e}\n`);
                }
            }

            process.stdout.write("\n");
        }, incrementalBuildDelay);
    });
}
