import { registerRoute } from "../router.ts";

registerRoute(/^\/other$/g, render);

function render() {
    return (
        <>
            <h1>This is another page</h1>
            <p>Routing success!</p>
        </>
    );
}
