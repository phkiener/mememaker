import { useEffect, useState } from "react";

type template = {
    id: string;
    title: string;
    image: string;
};

function templates() {
    const [templates, setTemplates] = useState<template[]>([]);
    useEffect(() => { loadTemplates().then(templates => setTemplates(templates)); }, []);

    return (
        <>
            <h1>Hello World!</h1>
            <p>Welcome from the Index page.</p>

            <p>Found {templates?.length} templates</p>
            <ul>
                {templates?.map(t =>
                    <li key={t.id}>
                        <figure>
                            <img src={t.image} alt="Template" />
                            <figcaption>{t.title}</figcaption>
                        </figure>
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

export default templates;
