import * as React from "react";

export function navigate(path: string) {
    history.pushState(null, "", path);
    resolveRoute(path);
}

const routes: Array<{ route: RegExp, view: () => React.JSX.Element}> = [];
export function registerRoute(route: RegExp, view: () => React.JSX.Element) {
    routes.push({ route: route, view: view });
}

function resolveRoute(location: string) {
    const matchResults = routes.map(r => { return { route: r, match: location.match(r.route) } });
    const bestMatch = matchResults.find(r => r.match);

     let view = bestMatch?.route.view ?? null;
     navigationTarget?.dispatchEvent(new NavigatedEvent(view));
}

let navigationTarget: HTMLElement | null;

export class NavigatedEvent extends Event {
    public readonly view: (() => React.JSX.Element) | null;

    constructor(view: (() => React.JSX.Element) | null) {
        super("navigate");

        this.view = view;
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
