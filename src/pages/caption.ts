import { Controller } from "../controller";
import { getTemplate } from "../domain/templates";

type template = {
    id: string;
    title: string;
    image: string;
}

export class Caption implements Controller {
    private readonly id: string;
    private canvas: HTMLElement;
    private controls: HTMLElement;
    private template: template;

    constructor(id: string) {
        this.id = id;
    }

    async init(document: Document): Promise<void> {
        this.canvas = document.querySelector("main > svg");
        this.controls = document.querySelector("main > .controls");
        this.template = await getTemplate(this.id);

        document.querySelector<HTMLHeadingElement>("main > h2").innerText = this.template.title;

        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("href", `/assets/${this.template.image}`);
        image.onload = () => {

            const boundingBox = image.getBBox();
            const heightFactor = boundingBox.height / boundingBox.width;
            const sizedHeight = this.canvas.clientWidth * heightFactor;

            this.canvas.setAttribute("height", `${sizedHeight}px`);
            image.setAttribute("preserveAspectRatio", "meet");
            image.setAttribute("width", "100%");
            image.setAttribute("height", "100%");
        }

        this.canvas.appendChild(image);

        return;
    }
}
