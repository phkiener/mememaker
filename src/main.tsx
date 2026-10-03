import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { attachRouter, NavigatedEvent } from "./router.ts";

import './index';
import './otherPage';
import notFound from './error/404'

const rootElement = document.getElementById('app')!;
const renderContainer = createRoot(rootElement);

document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    rootElement.addEventListener("navigate", onNavigate);

    attachRouter(rootElement);
})

function onNavigate(evt: NavigatedEvent) {
    if (evt.view) {
        renderContainer.render(<StrictMode>{evt.view(evt.args!)}</StrictMode>);
    } else {
        renderContainer.render(<StrictMode>{notFound()}</StrictMode>);
    }
}
