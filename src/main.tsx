import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./app/layout.tsx";
import TemplateList from "./app/templateList.tsx";
import NotFound from './app/notFound.tsx';

import './main.css';

const rootElement = document.getElementById('app')!;

createRoot(rootElement).render(
    <StrictMode>
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <TemplateList /> } />
                    <Route path="*" element={ <NotFound /> } />
                </Routes>
            </BrowserRouter>
        </Layout>
    </StrictMode>);
