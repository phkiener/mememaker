import typescript from "./build/compileTypescript";
import styles from "./build/bundleStylesheets";
import assets from "./build/copyAssets";
import pages from "./build/renderPages";
import * as fs from "node:fs";

const targets = [typescript, styles, assets, pages];
const incrementalBuildDelay = 2000;

for (const target of targets) {
    await target.build();
}

if (process.argv.includes("--watch")) {
    let buildTimer: NodeJS.Timeout;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildTimer);
        buildTimer = setTimeout(async () => {
            for (const target of targets) {
                try {
                    if (target.kind === "incremental") {
                        await target.incrementalBuild();
                    } else {
                        await target.build();
                    }
                } catch (e) {
                    console.error(`Incremental build for ${target.name} failed: `, e);
                }
            }
        }, incrementalBuildDelay);
    });
}
