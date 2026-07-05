import { Controller } from "../controller";

type template = {
    id: string;
    title: string;
    image: string;
}

export class Caption implements Controller {
    private readonly id: string;
    private template: template;

    constructor(id: string) {
        this.id = id;
    }

    async init(document: Document): Promise<void> {
        const data = await fetch("/data/templates.json");
        if (data.ok) {
            const response = await data.json();
            this.template = (response.templates as template[]).filter(t => t.id === this.id).at(0);
        }

        document.querySelector<HTMLHeadingElement>("main > h2").innerText = this.template.title;

        return;
    }
}
