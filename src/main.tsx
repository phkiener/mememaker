import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./app/layout.tsx";
import Templates from "./app/templates.tsx";
import NotFound from './app/notFound.tsx';

const rootElement = document.getElementById('app')!;

createRoot(rootElement).render(
    <StrictMode>
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Templates /> } />
                    <Route path="*" element={ <NotFound /> } />
                </Routes>
            </BrowserRouter>
        </Layout>
    </StrictMode>);
