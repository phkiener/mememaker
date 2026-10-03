import type { Template } from "./types";
export type { Template } from "./types";

export async function fetchTemplates(): Promise<Template[]> {
    const response = await fetch("/data.json");
    const data = await response.json();

    return data.templates as Template[];
}

export async function fetchTemplate(id: string): Promise<Template | null> {
    const templates = await fetchTemplates();

    return templates.find(t => t.id == id) ?? null;
}
