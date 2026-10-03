import * as React from "react";
import type { Route, RouteValues } from "./types.ts";
import { NavigatedEvent, NavigationFailureEvent } from "./events.ts";
export { NavigatedEvent, NavigationFailureEvent }

const routes: Array<Route> = [];
let navigationTarget: HTMLElement | null;

export function navigate(path: string) {
    history.pushState(null, "", path);
    resolveRoute(path);
}

export function registerRoute(route: RegExp | string, view: (args: RouteValues) => React.JSX.Element) {
    routes.push({ url: route, view: view });
}

function resolveRoute(location: string) {
    const matchResults = routes.map(r => {
        if (typeof r.url === "string") {
            const directUrl = r.url;
            return { route: r, success: location === directUrl, values: {} }
        } else {
            const regex = r.url;
            const match = location.match(regex);

            return { route: r, success: !!match, values: match?.groups ?? {} };
        }
    });

    const bestMatch = matchResults.find(r => r.success);
    if (bestMatch) {
        navigationTarget?.dispatchEvent(new NavigatedEvent(bestMatch.route.view, bestMatch.values));
    } else {
        navigationTarget?.dispatchEvent(new NavigationFailureEvent());
    }
}

export function attachRouter(target: HTMLElement) {
    navigationTarget = target;

    window.addEventListener("popstate", handleHistoryNavigation);
    document.body.addEventListener("click", handleLinkClick);

    resolveRoute(window.location.pathname);
}

function handleHistoryNavigation() {
    resolveRoute(window.location.pathname);
}

function handleLinkClick(evt: MouseEvent) {
    const href = (evt.target as HTMLLinkElement)?.href;
    if (href) {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
            evt.preventDefault();
            evt.stopPropagation();

            navigate(url.pathname);
        }
    }
}
