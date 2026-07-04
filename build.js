import { build } from "tsdown";
import * as fs from "node:fs";

if (process.argv.includes("--watch")) {
    let buildDelay;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildDelay);
        buildDelay = setTimeout(runBuild, 250);
    });
} else {
    await runBuild();
}

async function runBuild() {
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
}
