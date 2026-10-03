import type { ReactNode } from "react";

type LayoutProps = { children: ReactNode };

function layout(props: LayoutProps) {
    return (
        <>
            <header>
                mememaker
            </header>
            <main>
                {props.children}
            </main>
            <footer>
                (c) Some guy 2026
            </footer>
        </>
    );
}

export default layout;
