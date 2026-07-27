import { bundleAsync } from "lightningcss";
import * as fs from "node:fs/promises";
import { Target } from "./target";

const config = {
    filename: "src/root.css",
    minify: true
};

const target: Target = {
    name: "bundle stylesheets",
    build: async () => {
        const result = await bundleAsync(config);
        await fs.writeFile("build/root.css", result.code);
    }
};

export default target;
