import {navigate, registerRoute} from "../router";
import type { RouteValues } from "../router/types.ts";

registerRoute(/^\/other\/(?<id>\d+)$/, render);

function render(args: RouteValues) {
    return (
        <>
            <h1>This is another page for {args["id"]}</h1>
            <p>Routing success!</p>
            <p>Back to <a href="/">main page</a>.</p>
            <button onClick={navigateToRandomPage}>Visit another page</button>
        </>
    );
}

function navigateToRandomPage() {
    const randomId = Math.floor(Math.random() * 1000);
    navigate(`/other/${randomId}`);
}
