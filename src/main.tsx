import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import Layout from "./layout.tsx";
import List from './pages/list';
import Caption from "./pages/caption";
import NotFound from './pages/notFound.tsx';

import './main.css';

const rootElement = document.getElementById('app')!;

createRoot(rootElement).render(
    <StrictMode>
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <List /> } />
                    <Route path="/caption/:id" element={ <Caption /> } />
                    <Route path="*" element={ <NotFound /> } />
                </Routes>
            </BrowserRouter>
        </Layout>
    </StrictMode>);
