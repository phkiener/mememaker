import { useParams } from "react-router";
import { useEffect, useState, type InputEvent, type MouseEvent } from "react";
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
}

type TemplateState = { title: string | undefined, imageUrl: string | undefined }

function captionTemplate() {
    const params = useParams();

    const [template, setTemplate] = useState<TemplateState>({ title: undefined, imageUrl: undefined });
    const [captions, setCaptions] = useState<CaptionStateMap>();

    useEffect(() => {
        fetchTemplate(params.id!)
            .then(template => {
                const templateState: TemplateState = { title: template!.title, imageUrl: template!.image };
                setTemplate(templateState);

                const captionState: CaptionStateMap = { captionIds: template!.texts.map(t => t.label), captions: {}, activeCaption: null, anchor: null };
                for (const caption of template!.texts) {
                    captionState.captions[caption.label] = {
                        id: caption.label,
                        title: caption.label,
                        text: caption.content,
                        top: caption.top,
                        left: caption.left,
                        bottom: caption.bottom,
                        right: caption.right };
                }

                setCaptions(captionState);
            });
        }, []);

    return (
        <>
            {template.title ? <h2>{template.title}</h2> : <h2>Loading...</h2>}

            <article className="caption-area">
                <div className="preview">
                    <img src={template.imageUrl} alt="Template" />
                    <svg viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" className="caption-container"
                         onMouseDown={holdCaption}
                         onMouseMove={handleMovement}
                         onMouseUp={releaseCaption}
                         onMouseLeave={releaseCaption}>
                        {captions?.captionIds.map(id => <RenderedCaption key={id} caption={captions.captions[id]} active={captions.activeCaption === id} />)}
                    </svg>
                </div>

                <div className="controls">
                    {captions?.captionIds.map(id => <CaptionSettings key={id} caption={captions.captions[id]} onChange={x => updateCaptionText(id, x)} />)}
                </div>
            </article>
        </>
    );

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

            return { ...captions, activeCaption: caption?.id ?? null, anchor: anchor ?? null };
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
            const targetWidth = movedElement.closest(".caption-container")!.clientWidth;
            const targetHeight = movedElement.closest(".caption-container")!.clientHeight;

            const relativeMovementX = evt.movementX / targetWidth * 100 * (targetWidth > targetHeight ? targetWidth / targetHeight : 1);
            const relativeMovementY = evt.movementY / targetHeight * 100 * (targetHeight > targetWidth ? targetHeight / targetWidth : 1);

           const activeCaption = captions.captions[captions.activeCaption];
           const moveTop = captions.anchor === null || captions.anchor === "nw" || captions.anchor === "n" || captions.anchor === "ne";
           const moveLeft = captions.anchor === null || captions.anchor === "nw" || captions.anchor === "w" || captions.anchor === "sw";
           const moveBottom = captions.anchor === null || captions.anchor === "sw" || captions.anchor === "s" || captions.anchor === "se";
           const moveRight = captions.anchor === null || captions.anchor === "ne" || captions.anchor === "e" || captions.anchor === "se";

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
        });
    }

    function releaseCaption() {
        setCaptions(captions => {
            if (!captions) {
                return captions;
            }

            return { ...captions, activeCaption: null, anchor: null };
        })
    }
}

export default captionTemplate;
