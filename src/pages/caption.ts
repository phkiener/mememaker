import { Controller } from "../controller";
import { template, getTemplate } from "../domain/templates";

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
        image.addEventListener("load", () => {
            const boundingBox = image.getBBox();
            const heightFactor = boundingBox.height / boundingBox.width;
            const sizedHeight = this.canvas.clientWidth * heightFactor;

            this.canvas.setAttribute("height", `${sizedHeight}px`);
            this.canvas.setAttribute("viewbox", `0 0 ${boundingBox.width} ${boundingBox.height}`);
            image.setAttribute("width", "100%");
            image.setAttribute("height", "100%");
        }, { once: true });

        image.setAttribute("x", "0");
        image.setAttribute("y", "0");
        image.setAttribute("href", `/assets/${this.template.image}`);
        this.canvas.appendChild(image);

        for (const textField of this.template.texts) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", `${textField.x}`);
            text.setAttribute("y", `${textField.y}`);

            let dragging = false;
            text.addEventListener("mousedown", () => dragging = true);
            text.addEventListener("mouseup", () => dragging = false);
            text.addEventListener("mousemove", evt => {
                if (!dragging) {
                    return;
                }

                const currentX = Number.parseFloat(text.getAttribute("x"));
                const currentY = Number.parseFloat(text.getAttribute("y"));

                const newX = currentX + evt.movementX;
                const newY = currentY + evt.movementY;

                text.setAttribute("x", `${newX}`);
                text.setAttribute("y", `${newY}`);
            }, { passive: true });

            text.innerHTML = "Hello World";
            this.canvas.appendChild(text);

            const input = document.createElement("input");
            input.type = "text";
            input.value = text.innerHTML;

            input.addEventListener("input", () => text.innerHTML = input.value);



            this.controls.appendChild(input);
        }

        return;
    }
}
