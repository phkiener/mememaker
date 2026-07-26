import { IndexController } from "./pages/indexController";
import { CaptionController } from "./pages/caption/captionController";

import { Controller } from "./controller";

export function resolveController(path: string, query: string): Controller | null {
    const parsedQuery = new URLSearchParams(query);

    if (path === "" || path === "/") {
        return new IndexController();
    }

    if (path === "caption" || path === "caption/") {
        return new CaptionController(parsedQuery.get("id")!);
    }

    return null;
}
