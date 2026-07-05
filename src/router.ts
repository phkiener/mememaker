import { Index } from "./pages/index";
import { Controller } from "./controller";
import {Caption} from "./pages/caption";

export function resolveController(location: Location): Controller {
    const query = new URLSearchParams(location.search);

    if (location.pathname === "/caption") {
        return new Caption(query.get("id"));
    }

    return new Index();
}
