import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Eta } from "eta";

const eta = new Eta( { views: "src/pages" });

const target: Target = {
    name: "render pages",
    build: async () => {
        const base = process.env.ETA_BASE ?? "/";

        for await (const template of fs.glob("src/pages/**/*.eta")) {
            if (path.basename(template).startsWith("_")) {
                continue;
            }

            const templateName = path.relative("src/pages/", template).replace(/.eta$/, "");
            const result = await eta.renderAsync(templateName, { base: base });

            const targetPath = "app/" + path.dirname(templateName) + "/index.html";
            await fs.mkdir(path.dirname(targetPath), { recursive: true });
            await fs.writeFile(targetPath, result);
        }
    }
};

export default target;
