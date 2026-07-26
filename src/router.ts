import { IndexController } from "./pages/indexController";
import { CaptionController } from "./pages/caption/captionController";

import { Controller } from "./controller";

export function resolveController(path: string, query: string): Controller {
    const parsedQuery = new URLSearchParams(query);

    if (path === "caption") {
        return new CaptionController(parsedQuery.get("id")!);
    }

    return new IndexController();
}
