import { IndexController } from "./pages/indexController";
import { CaptionController } from "./pages/caption/captionController";
import { Controller } from "./lib/controller";

const base = new URL(document.baseURI);
const path = window.location.pathname.replace(base.pathname, "");

const controller = resolveController(path, window.location.search);
if (controller) {
    await controller.init(document);
}

function resolveController(path: string, query: string): Controller | null {
    const parsedQuery = new URLSearchParams(query);

    if (path === "" || path === "/") {
        return new IndexController();
    }

    if (path === "caption" || path === "caption/") {
        return new CaptionController(parsedQuery.get("id")!);
    }

    return null;
}
