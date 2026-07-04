import { build } from "tsdown";

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
