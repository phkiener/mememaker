import { resolveController } from "./router";

const controller = resolveController(window.location);
await controller.init(document);
