import { useParams } from "react-router";
import {useEffect, useState, type InputEvent, type MouseEvent, type ToggleEvent, useRef} from "react";
import { fetchTemplate } from "../../templates";
import CaptionSettings from "./captionSettings.tsx";
import RenderedCaption from "./renderedCaption.tsx";
import './index.css'

type RenderableCaption = {
    text: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
    angle: number;
}

type ConfigurableCaption = {
    id: string;
    title: string;
    text: string;
}

type CaptionState = RenderableCaption & ConfigurableCaption;

type CaptionStateMap = {
    captionIds: string[];
    captions: { [id: string]: CaptionState };
    activeCaption: string | null;

    anchor: string | null;
    movement: "rotate" | "resize" | "move" | null;
}

type TemplateState = { title: string | undefined, imageUrl: string | undefined }

function captionTemplate() {
    const params = useParams();

    const [template, setTemplate] = useState<TemplateState>({ title: undefined, imageUrl: undefined });
    const [captions, setCaptions] = useState<CaptionStateMap>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const svgRef = useRef<SVGElement>(null);

    useEffect(() => {
        fetchTemplate(params.id!)
            .then(template => {
                const templateState: TemplateState = { title: template!.title, imageUrl: template!.image };
                setTemplate(templateState);

                const captionState: CaptionStateMap = { captionIds: template!.texts.map(t => t.label), captions: {}, activeCaption: null, anchor: null, movement: null };
                for (const caption of template!.texts) {
                    captionState.captions[caption.label] = {
                        id: caption.label,
                        title: caption.label,
                        text: caption.content,
                        top: caption.top,
                        left: caption.left,
                        bottom: caption.bottom,
                        right: caption.right,
                        angle: caption.angle };
                }

                setCaptions(captionState);
            });
        }, []);

    return (
        <>
            {template.title ? <h2>{template.title}</h2> : <h2>Loading...</h2>}

            <article className="caption-area">
                <div className="preview">
                    <img src={template.imageUrl} alt="Template" ref={imgRef} />
                    <svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" className="caption-container" ref={svgRef}
                         onMouseDown={holdCaption}
                         onMouseMove={handleMovement}
                         onMouseUp={releaseCaption}
                         onMouseLeave={releaseCaption}>
                        {captions?.captionIds.map(id => <RenderedCaption key={id} caption={captions.captions[id]} active={captions.activeCaption === id} />)}
                    </svg>
                </div>

                <div className="controls">
                    {captions?.captionIds.map(id => <CaptionSettings key={id} caption={captions.captions[id]} onChange={x => updateCaptionText(id, x)} />)}
                    <button type="button" className="show-export" command="show-modal" commandfor="export-dialog">Export</button>
                </div>
            </article>

            <dialog id="export-dialog" onToggle={renderExport}>
                <canvas ref={canvasRef} />
                <button type="button" className="close-export" command="close" commandfor="export-dialog">Close</button>
            </dialog>
        </>
    );

    function renderExport(evt: ToggleEvent<HTMLDialogElement>) {
        const canvas = canvasRef.current;
        const image = imgRef.current;
        const svg = svgRef.current;

        if (evt.newState !== "open" || !canvas || !image || !svg) {
            return;
        }

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext("2d")!;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);

        const serializer = new XMLSerializer();
        const serializedCaptions = serializer.serializeToString(svg);

        const blob = new Blob([serializedCaptions], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const throwawayImage = new Image();
        throwawayImage.onload = () => {
            context.drawImage(throwawayImage, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
        };

        throwawayImage.src = url;
    }

    function updateCaptionText(id: string, evt: InputEvent<HTMLTextAreaElement>) {
        setCaptions(captions => {
            if (!captions) {
                return undefined;
            }

            const currentCaption = captions.captions[id] ?? {};
            const updatedText = (evt.target as HTMLInputElement).value;

            return { ...captions, captions: { ...captions.captions, [id]: { ...currentCaption, text: updatedText }}};
        });
    }

    function holdCaption(evt: MouseEvent) {
        setCaptions(captions => {
            if (!captions) {
                return captions;
            }

            const heldElement = evt.target as Element;
            const caption = heldElement.closest(".caption");
            const anchor = heldElement.getAttribute("data-anchor");
            const kind = heldElement.classList.contains("resize")
                ? "resize"
                : heldElement.classList.contains("rotate")
                    ? "rotate"
                    : "move";

            return { ...captions, activeCaption: caption?.id ?? null, anchor: anchor ?? null, movement: kind };
        })
    }

    function handleMovement(evt: MouseEvent) {
        setCaptions(captions => {
            if (!captions || !captions.activeCaption) {
                return captions;
            }

            if (evt.movementX === 0 && evt.movementY === 0) {
                return captions;
            }

            const movedElement = evt.target as Element;
            const activeCaption = captions.captions[captions.activeCaption];
            const targetWidth = movedElement.closest(".caption-container")!.clientWidth;
            const targetHeight = movedElement.closest(".caption-container")!.clientHeight;

            const relativeMovementX = evt.movementX / targetWidth * 100 * (targetWidth > targetHeight ? targetWidth / targetHeight : 1);
            const relativeMovementY = evt.movementY / targetHeight * 100 * (targetHeight > targetWidth ? targetHeight / targetWidth : 1);

            if (captions.movement === "move") {
                return {
                    ...captions,
                    captions: {
                        ...captions.captions,
                        [activeCaption.id]: {
                            ...activeCaption,
                            top: activeCaption.top + relativeMovementY,
                            left: activeCaption.left + relativeMovementX,
                            bottom: activeCaption.bottom + relativeMovementY,
                            right: activeCaption.right + relativeMovementX,
                        }
                    }
                };
            }

            if (captions.movement === "resize" && captions.anchor !== null) {
                const moveTop =  captions.anchor === "nw" || captions.anchor === "n" || captions.anchor === "ne";
                const moveLeft = captions.anchor === "nw" || captions.anchor === "w" || captions.anchor === "sw";
                const moveBottom = captions.anchor === "sw" || captions.anchor === "s" || captions.anchor === "se";
                const moveRight = captions.anchor === "ne" || captions.anchor === "e" || captions.anchor === "se";

                return {
                    ...captions,
                    captions: {
                        ...captions.captions,
                        [activeCaption.id]: {
                            ...activeCaption,
                            top: moveTop ? activeCaption.top + relativeMovementY : activeCaption.top,
                            left: moveLeft ? activeCaption.left + relativeMovementX : activeCaption.left,
                            bottom: moveBottom ? activeCaption.bottom + relativeMovementY : activeCaption.bottom,
                            right: moveRight ? activeCaption.right + relativeMovementX : activeCaption.right,
                        }
                    }
                };
            }

            if (captions.movement === "rotate" && captions.anchor !== null) {
                let dx = relativeMovementX;
                let dy = relativeMovementY;

                switch (captions.anchor) {
                    case "n":
                        dx = relativeMovementX;
                        dy = relativeMovementY;
                        break;

                    case "e":
                        dx = relativeMovementY;
                        dy = relativeMovementX;
                        break;

                    case "s":
                        dx = relativeMovementX * -1;
                        dy = relativeMovementY * -1;
                        break;

                    case "w":
                        dx = relativeMovementY * -1;
                        dy = relativeMovementX * -1;
                        break;
                }

                const rotation = Math.atan2(dx, dy);
                return {
                    ...captions,
                    captions: {
                        ...captions.captions,
                        [activeCaption.id]: {
                            ...activeCaption,
                            angle: activeCaption.angle + rotation
                        }
                    }
                };
            }

            return captions;
        });
    }

    function releaseCaption() {
        setCaptions(captions => {
            if (!captions) {
                return captions;
            }

            return { ...captions, activeCaption: null, anchor: null, movement: null };
        })
    }
}

export default captionTemplate;
