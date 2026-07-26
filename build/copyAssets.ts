import * as fs from "node:fs/promises";

const target: Target = {
    name: "copy assets",
    build: async () => {
        await fs.cp("assets/", "app/assets/", { recursive: true, preserveTimestamps: true });
    }
};

export default target;
