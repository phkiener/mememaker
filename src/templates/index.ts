import type { Template } from "./types";
export type { Template } from "./types";

export async function fetchTemplates(): Promise<Template[]> {
    const response = await fetch(`${import.meta.env.BASE_URL}/index.json`);
    const entryResponse = await response.json() as { entries: string[] };

    const templates: Template[] = [];
    for (const entry of entryResponse.entries) {
        const response = await fetch(`${import.meta.env.BASE_URL}/${entry}/content.json`);
        const template = await response.json() as Template;

        templates.push({ ...template, image: `${import.meta.env.BASE_URL}/${template.image}` });
    }

    return templates;
}

export async function fetchTemplate(id: string): Promise<Template | null> {
    const response = await fetch(`${import.meta.env.BASE_URL}/${id}/content.json`);
    if (response.ok) {
        const template = await response.json() as Template;

        return { ...template, image: `${import.meta.env.BASE_URL}/${template.image}` }
    }

    return null;
}
