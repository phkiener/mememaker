import { Controller } from "../controller";
import { getAllTemplates } from "../domain/templates";

type template = {
    id: string;
    title: string;
    image: string;
}

export class IndexController implements Controller {
    private cardTemplate!: HTMLTemplateElement;
    private cardContainer!: HTMLDivElement;
    private cardContainerTitle!: HTMLHeadingElement;

    private templates: template[] = [];

    async init(document: Document): Promise<void> {
        this.cardTemplate = document.querySelector("main template#meme-card") as HTMLTemplateElement;
        this.cardContainer = document.querySelector("main #meme-grid") as HTMLDivElement;
        this.cardContainerTitle = document.querySelector("main h2") as HTMLHeadingElement;

        this.templates = await getAllTemplates();

        this.cardContainerTitle.innerText = this.templates.length === 1
            ? "1 template"
            : `${this.templates.length} templates`;

        for (const template of this.templates) {
            const templateInstance = document.importNode(this.cardTemplate.content, true);

            const image = templateInstance.querySelector("img")!;
            image.src = template.image;
            image.alt = template.title;

            const caption = templateInstance.querySelector("figcaption")!;
            caption.innerText = template.title;

            const link = templateInstance.querySelector("a")!;
            link.href = `caption?id=${template.id}`;

            this.cardContainer.appendChild(templateInstance);
        }
    }
}
