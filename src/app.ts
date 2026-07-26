import { resolveController } from "./router";

const base = new URL(document.baseURI);
const path = window.location.pathname.replace(base.pathname, "");

const controller = resolveController(path, window.location.search);
await controller.init(document);
