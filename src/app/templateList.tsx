import { useEffect, useState } from "react";
import TemplateCard from "../components/templateCard.tsx";
import './templateList.css';

type template = {
    id: string;
    title: string;
    image: string;
};

function templateList() {
    const [templates, setTemplates] = useState<template[]>([]);
    useEffect(() => { loadTemplates().then(templates => setTemplates(templates)); }, []);

    return (
        <>
            {templates?.length === 1 && <h2>1 template found</h2>}
            {templates?.length !== 1 && <h2>{templates?.length} templates found</h2>}

            <ul className="template-list">
                {templates?.map(t =>
                    <li key={t.id}>
                        <TemplateCard id={t.id} title={t.title} imageUrl={t.image} />
                    </li>
                )}
            </ul>
        </>
    );
}

async function loadTemplates(): Promise<template[]> {
    const response = await fetch("/data.json");
    const data = await response.json();

    return data.templates as template[];
}

export default templateList;
