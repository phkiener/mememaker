export type template = {
    id: string;
    title: string;
    image: string;
}

let cachedData: template[] = [];

export async function getTemplate(id: string): Promise<template | null> {
    const templates = await getAllTemplates();

    return templates.filter(t => t.id == id).at(0);
}

export async function getAllTemplates(): Promise<template[]> {
    const data = await fetch("/data/templates.json");
    if (data.ok) {
        const response = await data.json();
        cachedData = response.templates as template[];
    }

    return cachedData;
}
