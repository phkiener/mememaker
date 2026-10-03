import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import index from './index'
import otherPage from './otherPage'
import notFound from './error/404'

const routes = [
    { route: /^\/$/g, render: index },
    { route: /^\/other$/g, render: otherPage },
];

function navigateTo(url: string, addToHistory: boolean) {
    if (addToHistory) {
        history.pushState(null, "", url);
    }

    const routingResults = routes.map(r => {
        return { match: location.pathname.match(r.route), route: r };
    });

    const match = routingResults.find(r => r.match)?.route.render ?? notFound;
    renderContainer.render(<StrictMode>{ match() }</StrictMode>);
}


const rootElement = document.getElementById('app')!;
const renderContainer = createRoot(rootElement);

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("popstate", () => {
        navigateTo(window.location.pathname, false);
    });

    document.body.addEventListener("click", evt => {
        const targetElement = evt.target as HTMLLinkElement;

        if (targetElement.href) {
            const targetUrl = new URL(targetElement.href, window.location.origin);
            if (targetUrl.origin === window.location.origin) {
                evt.preventDefault();
                evt.stopPropagation();

                navigateTo(targetUrl.pathname, true);
            }
        }
    });

    navigateTo(window.location.pathname, false);
})
