import { build } from "tsdown";
import * as fs from "node:fs";

await runBuild();

if (process.argv.includes("--watch")) {
    let buildDelay;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildDelay);
        buildDelay = setTimeout(runBuild, 250);
    });
}

async function runBuild() {
    try {
        await build({
            entry: ["src/app.ts"],

            format: "module",
            outDir: "app/js",
            platform: "browser",

            failOnWarn: true,
            sourcemap: true,
            minify: true,
            clean: true,
        });
    } catch (error) {
        console.error(error);
    }
}
