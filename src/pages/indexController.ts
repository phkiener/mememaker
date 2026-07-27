import { Controller } from "../controller";
import { getAllTemplates, template } from "../domain/templates";

export class IndexController implements Controller {
    private cardTemplate!: HTMLTemplateElement;
    private tagTemplate!: HTMLTemplateElement;
    private cardContainer!: HTMLDivElement;
    private cardContainerTitle!: HTMLHeadingElement;

    private templates: template[] = [];

    async init(document: Document): Promise<void> {
        this.cardTemplate = document.querySelector<HTMLTemplateElement>("main template#card-template")!;
        this.tagTemplate = document.querySelector<HTMLTemplateElement>("main template#tag-template")!;
        this.cardContainer = document.querySelector<HTMLDivElement>("#meme-grid")!;
        this.cardContainerTitle = document.querySelector<HTMLHeadingElement>("#template-count") as HTMLHeadingElement;

        this.templates = await getAllTemplates();

        this.cardContainerTitle.innerText = this.templates.length === 1
            ? "1 template"
            : `${this.templates.length} templates`;

        for (const template of this.templates) {
            const templateInstance = document.importNode(this.cardTemplate.content, true);

            const image = templateInstance.querySelector("img")!;
            image.src = template.image;
            image.alt = template.title;

            const caption = templateInstance.querySelector<HTMLElement>(".title")!;
            caption.innerText = template.title;

            const tags = templateInstance.querySelector<HTMLElement>(".tags");
            for (const tag of template.tags) {
                const tagInstance = document.importNode(this.tagTemplate.content, true);
                tagInstance.querySelector("span")!.innerText = tag;

                tags?.appendChild(tagInstance);
            }

            const link = templateInstance.querySelector("a")!;
            link.href = `caption?id=${template.id}`;

            this.cardContainer.appendChild(templateInstance);
        }
    }
}
