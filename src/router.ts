import { IndexController } from "./pages/indexController";
import { CaptionController } from "./pages/caption/captionController";

import { Controller } from "./controller";

export function resolveController(location: Location): Controller {
    const query = new URLSearchParams(location.search);

    if (location.pathname === "/caption") {
        return new CaptionController(query.get("id"));
    }

    return new IndexController();
}
