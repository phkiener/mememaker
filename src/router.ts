import { Index } from "./pages/index";
import { Caption } from "./pages/caption";

import { Controller } from "./controller";

export function resolveController(location: Location): Controller {
    const query = new URLSearchParams(location.search);

    if (location.pathname === "/caption") {
        return new Caption(query.get("id"));
    }

    return new Index();
}
