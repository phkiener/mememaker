import * as ts from "tsdown";
import * as css from "lightningcss";
import * as fs from "node:fs";
import * as asyncfs from "node:fs/promises";

const tsBuild = {
    config: {
        entry: ["src/app.ts"],

        format: "module",
        outDir: "app/js",
        platform: "browser",

        sourcemap: true,
        minify: true,
    },
    rebuild: async () => {
        await ts.build(Object.assign({ clean: true, failOnWarn: true }, tsBuild.config));
    },
    incrementalBuild: async () => {
        await ts.build(Object.assign({ clean: false, failOnWarn: false }, tsBuild.config));
    }
};

const cssBuild = {
    config: {
        filename: "src/app.css",
        minify: true
    },
    rebuild: async () => {
        const result = await css.bundleAsync(cssBuild.config);
        await asyncfs.writeFile("app/css/app.css", result.code);
    },
    incrementalBuild: async () => {
        const result = await css.bundleAsync(cssBuild.config);
        await asyncfs.writeFile("app/css/app.css", result.code);
    }
}

const targets = [tsBuild, cssBuild];
await rebuild();

if (process.argv.includes("--watch")) {
    let buildDelay;

    fs.watch("src/", { recursive: true, }, () => {
        clearTimeout(buildDelay);
        buildDelay = setTimeout(incrementalBuild, 250);
    })
}

async function incrementalBuild() {
    try {
        for (const target of targets) {
            await target.incrementalBuild();
        }
    } catch (error) {
        console.error("Incremental build failed: ", error);
    }
}

async function rebuild() {
    for (const target of targets) {
        await target.rebuild();
    }
}
