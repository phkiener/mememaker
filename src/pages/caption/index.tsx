import { useParams } from "react-router";
import { useEffect, useState, type InputEvent } from "react";
import { fetchTemplate } from "../../templates";
import CaptionSettings from "./captionSettings.tsx";
import RenderedCaption from "./renderedCaption.tsx";
import './index.css'

type RenderableCaption = {
    text: string;
    x: number;
    y: number;
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

                const captionState: CaptionStateMap = { captionIds: template!.texts.map(t => t.label), captions: {} };
                for (const caption of template!.texts) {
                    captionState.captions[caption.label] = {
                        id: caption.label,
                        title: caption.label,
                        text: caption.content,
                        x: caption.x,
                        y: caption.y };
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
                    <svg>
                        {captions?.captionIds.map(id => <RenderedCaption key={id} caption={captions.captions[id]} />)}
                    </svg>
                </div>

                <div className="controls">
                    {captions?.captionIds.map(id => <CaptionSettings key={id} caption={captions.captions[id]} onChange={x => updateCaptionText(id, x)} />)}
                </div>
            </article>
        </>
    );

    function updateCaptionText(id: string, evt: InputEvent<HTMLInputElement>) {
        setCaptions(captions => {
            if (!captions) {
                return undefined;
            }

            const currentCaption = captions.captions[id] ?? {};
            const updatedText = (evt.target as HTMLInputElement).value;

            return { ...captions, captions: { ...captions.captions, [id]: { ...currentCaption, text: updatedText }}};
        });
    }
}

export default captionTemplate;
