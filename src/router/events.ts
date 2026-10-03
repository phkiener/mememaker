import * as React from "react";
import type { RouteValues } from "./types.ts";

export class NavigatedEvent extends Event {
    public static readonly eventName = "navigate:found";

    public readonly view: (args: RouteValues) => React.JSX.Element;
    public readonly args: RouteValues;

    constructor(view: (args: RouteValues) => React.JSX.Element, args: RouteValues) {
        super(NavigatedEvent.eventName);

        this.view = view;
        this.args = args;
    }
}

export class NavigationFailureEvent extends Event {
    public static readonly eventName = "navigate:not-found";

    constructor() {
        super(NavigatedEvent.eventName);
    }
}
