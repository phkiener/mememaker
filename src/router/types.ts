import * as React from "react";

export type RouteValues = { [key: string]: string };
export type Route = { url: RegExp | string, view: (args: RouteValues) => React.JSX.Element };
