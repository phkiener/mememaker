import { Index } from "./pages/index";
import { Controller } from "./controller";

export function resolveController(location: Location): Controller {
    return new Index();
}
