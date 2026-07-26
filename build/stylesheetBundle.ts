import { bundleAsync } from "lightningcss";
import { Target } from "./target";
import * as fs from "node:fs/promises";

const config: InlineConfig = {
    filename: "src/app.css",
    minify: true
};

const target: Target = {
    name: "stylesheet bundle",
    build: async () => {
        const result = await bundleAsync(config);
        await fs.writeFile("app/css/app.css", result.code);
    }
};

export default target;
