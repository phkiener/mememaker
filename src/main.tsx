import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {attachRouter, NavigatedEvent, NavigationFailureEvent} from "./router";

import './index';
import './otherPage';
import notFound from './error/404'

const rootElement = document.getElementById('app')!;
const renderContainer = createRoot(rootElement);

document.addEventListener("DOMContentLoaded", () => {
    // @ts-ignore
    rootElement.addEventListener(NavigatedEvent.eventName, onNavigate);

    // @ts-ignore
    rootElement.addEventListener(NavigationFailureEvent.eventName, onNavigateFailure);

    attachRouter(rootElement);
})

function onNavigate(evt: NavigatedEvent) {
    renderContainer.render(<StrictMode>{evt.view(evt.args)}</StrictMode>);
}

function onNavigateFailure() {
    renderContainer.render(<StrictMode>{notFound()}</StrictMode>);
}
