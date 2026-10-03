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
    const view = evt.view ?? notFound;
    renderContainer.render(<StrictMode>{view()}</StrictMode>);
}
