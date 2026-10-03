import { registerRoute } from "../router";

registerRoute("/", render);

function render() {
    return (
        <>
            <h1>Hello World!</h1>
            <p>Welcome from the Index page.</p>

            <p>You can go to <a href="/other/12">another page</a> too.</p>
        </>
    );
}
