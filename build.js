import { build } from "tsdown";
import * as fs from "node:fs";

const buildOptions = {
    entry: ["src/app.ts"],

    format: "module",
    outDir: "app/js",
    platform: "browser",

    sourcemap: true,
    minify: true,
}

await rebuild();

if (process.argv.includes("--watch")) {
    let buildDelay;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildDelay);
        buildDelay = setTimeout(incrementalBuild, 250);
    })
}

async function incrementalBuild() {
    const incrementalBuildOptions = Object.assign({ clean: false, failOnWarn: false }, buildOptions);

    try {
        console.log("Building app.ts...");
        await build(incrementalBuildOptions);
        console.log("Incremental build done.")
    } catch (error) {
        console.error("Incremental build failed");
        console.error(error);
    }
}

async function rebuild() {
    const rebuildOptions = Object.assign({ clean: true, failOnWarn: true }, buildOptions);

    console.log("Rebuilding app.ts...");
    await build(rebuildOptions);
    console.log("Rebuild done.")
}
