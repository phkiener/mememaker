import type { ReactNode } from "react";
import './layout.css';

type LayoutProps = { children: ReactNode };

function layout(props: LayoutProps) {
    return (
        <>
            <header className="layout-header">
                <a href="/">mememaker</a>
            </header>

            <main className="layout-main">
                {props.children}
            </main>

            <footer className="layout-footer">
                (c) some guy in 2026
            </footer>
        </>
    );
}

export default layout;
