import { registerRoute } from "../router.ts";

registerRoute(/^\/$/g, render);

function render() {
    return (
        <>
            <h1>Hello World!</h1>
            <p>Welcome from the Index page.</p>

            <p>You can go to <a href="/other">another page</a> too.</p>
        </>
    );
}
