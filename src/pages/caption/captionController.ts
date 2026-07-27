import { Controller } from "../../lib/controller";
import { template, getTemplate } from "../../lib/templates";

export class CaptionController implements Controller {
    private readonly id: string;
    private canvas!: HTMLElement;
    private image!: HTMLImageElement;
    private controls!: HTMLElement;
    private template!: template;
    private exportDialog!: HTMLDialogElement;

    constructor(id: string) {
        this.id = id;
    }

    async init(document: Document): Promise<void> {
        this.canvas = document.querySelector("main svg")!;
        this.image = document.querySelector("main img")!;
        this.controls = document.querySelector("main .captions")!;
        this.exportDialog = document.querySelector("#export-dialog")!;
        this.template = (await getTemplate(this.id))!;

        document.querySelector<HTMLHeadingElement>("main h2")!.innerText = this.template.title;

        this.image.addEventListener("load", () => {
            for (const textField of this.template.texts) {
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", `${textField.x * 100}%`);
                text.setAttribute("y", `${textField.y * 100}%`);
                text.setAttribute("text-anchor", "middle");
                text.innerHTML = textField.content;

                let dragging = false;

                this.canvas.addEventListener("mouseout", () => dragging = false);
                text.addEventListener("mousedown", () => dragging = true);
                text.addEventListener("mouseup", () => dragging = false);
                text.addEventListener("mousemove", evt => {
                    if (!dragging) {
                        return;
                    }

                    const currentX = text.getAttribute("x")!;
                    let currentXAbsolute = 0;
                    if (currentX.endsWith("%")) {
                        const currentXPercentage = Number.parseFloat(currentX.slice(0, currentX.length - 1)) / 100;
                        currentXAbsolute = this.canvas.clientWidth * currentXPercentage;
                    } else {
                        currentXAbsolute = Number.parseFloat(currentX);
                    }

                    const currentY = text.getAttribute("y")!;
                    let currentYAbsolute = 0;
                    if (currentX.endsWith("%")) {
                        const currentYPercentage = Number.parseFloat(currentY.slice(0, currentX.length - 1)) / 100;
                        currentYAbsolute = this.canvas.clientHeight * currentYPercentage;
                    } else {
                        currentYAbsolute = Number.parseFloat(currentY);
                    }

                    const newX = currentXAbsolute + evt.movementX;
                    const newY = currentYAbsolute + evt.movementY;

                    text.setAttribute("x", `${newX / this.canvas.clientWidth * 100}%`);
                    text.setAttribute("y", `${newY / this.canvas.clientHeight * 100}%`);
                }, { passive: true });

                this.canvas.appendChild(text);

                const input = document.createElement("input");
                input.type = "text";
                input.value = text.innerHTML;
                input.placeholder = textField.label;

                input.addEventListener("input", () => text.innerHTML = input.value);

                this.controls.appendChild(input);
            }
        });

        this.image.src = this.template.image;
        this.exportDialog.addEventListener("beforetoggle", evt => {
            if (evt.newState === "open") {
                const image = document.createElement("img");
                image.addEventListener("load", () => {
                    const canvas = this.exportDialog.querySelector("canvas")!;
                    canvas.width = this.image.clientWidth;
                    canvas.height = this.image.clientHeight;

                    const ctx = canvas.getContext("2d")!;

                    ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
                    ctx.drawImage(this.image, 0, 0, this.image.clientWidth, this.image.clientHeight);
                    ctx.drawImage(image, 0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

                    canvas.toBlob(b => navigator.clipboard.write([new ClipboardItem({ [b!.type]: b! })]), "image/png");
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
