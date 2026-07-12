import { Controller } from "../controller";
import { template, getTemplate } from "../domain/templates";

export class Caption implements Controller {
    private readonly id: string;
    private canvas: HTMLElement;
    private image: HTMLImageElement;
    private controls: HTMLElement;
    private template: template;
    private exportDialog: HTMLDialogElement;

    constructor(id: string) {
        this.id = id;
    }

    async init(document: Document): Promise<void> {
        this.canvas = document.querySelector("main svg");
        this.image = document.querySelector("main img");
        this.controls = document.querySelector("main .captions");
        this.exportDialog = document.querySelector("#export-dialog");
        this.template = await getTemplate(this.id);

        document.querySelector<HTMLHeadingElement>("main > h2").innerText = this.template.title;


        this.image.src = this.template.image;

        for (const textField of this.template.texts) {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", `${textField.x}`);
            text.setAttribute("y", `${textField.y}`);
            text.setAttribute("text-anchor", "middle");

            let dragging = false;

            this.canvas.addEventListener("mouseout", () => dragging = false);
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
            input.placeholder = textField.label;

            input.addEventListener("input", () => text.innerHTML = input.value);

            this.controls.appendChild(input);
        }

        this.exportDialog.addEventListener("beforetoggle", evt => {
            if (evt.newState === "open") {

                this.exportDialog.style.width = this.image.clientWidth + "px";
                this.exportDialog.style.height = this.image.clientHeight + "px";
                this.exportDialog.style.overflow = "hidden";

                const image = document.createElement("img");
                image.addEventListener("load", () => {
                    const canvas = this.exportDialog.querySelector("canvas");
                    canvas.width = this.image.clientWidth;
                    canvas.height = this.image.clientHeight;

                    const ctx = canvas.getContext("2d");

                    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
                    ctx.drawImage(this.image, 0, 0, this.image.clientWidth, this.image.clientHeight);
                    ctx.drawImage(image, 0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
                }, { once: true });

                const exported = new XMLSerializer().serializeToString(this.canvas);
                const svgBlob = new Blob([exported], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);
                image.src = url;

                image.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
           }
        });

        return;
    }
}
