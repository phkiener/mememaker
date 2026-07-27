import { build, InlineConfig } from "tsdown";
import { Target } from "./target";

const config: InlineConfig = {
    entry: ["src/app.ts"],

    format: "module",
    outDir: "build/",
    platform: "browser",
    logLevel: "silent",

    sourcemap: true,
    minify: true,
};

const target: Target = {
    name: "compile typescript",
    build: async () => {
        await build(Object.assign({ clean: true, failOnWarn: true }, config));
    },
    incrementalBuild: async () => {
        await build(Object.assign({ clean: false, failOnWarn: false }, config));
    }
};

export default target;
