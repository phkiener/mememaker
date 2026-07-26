import { build, InlineConfig } from "tsdown";
import { IncrementalTarget } from "./target";

const config: InlineConfig = {
    entry: ["src/app.ts"],

    format: "module",
    outDir: "app/js",
    platform: "browser",

    sourcemap: true,
    minify: true,
};

const target: IncrementalTarget = {
    name: "compile typescript",
    build: async () => {
        await build(Object.assign({ clean: true, failOnWarn: true }, config));
    },
    incrementalBuild: async () => {
        await build(Object.assign({ clean: false, failOnWarn: false }, config));
    }
};

export default target;
