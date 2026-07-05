import { Controller } from "../controller";

type template = {
    id: string;
    title: string;
    image: string;
}

export class Index implements Controller {
    private cardTemplate: HTMLTemplateElement;
    private cardContainer: HTMLDivElement;
    private cardContainerTitle: HTMLHeadingElement;

    private templates: template[] = [];

    async init(document: Document): Promise<void> {
        this.cardTemplate = document.getElementById("meme-card") as HTMLTemplateElement;
        this.cardContainer = document.getElementById("meme-container") as HTMLDivElement;
        this.cardContainerTitle = this.cardContainer.querySelector("h2");

        const data = await fetch("/data/templates.json");
        if (data.ok) {
            const response = await data.json();
            this.templates = response.templates;
        }

        this.cardContainerTitle.innerText = this.templates.length === 1
            ? "1 template"
            : `${this.templates.length} templates`;

        for (const template of this.templates) {
            const templateInstance = document.importNode(this.cardTemplate.content, true);

            const image = templateInstance.querySelector("img");
            image.src = `/assets/${template.image}`;
            image.alt = template.title;

            const caption = templateInstance.querySelector("figcaption");
            caption.innerText = template.title;

            const link = templateInstance.querySelector("a");
            link.href = `/caption?id=${template.id}`;

            this.cardContainer.appendChild(templateInstance);
        }
    }
}
