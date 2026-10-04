import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchTemplate, type Template } from "../../templates";
import './index.css'

function captionTemplate() {
    const params = useParams();

    const [template, setTemplate] = useState<Template | null>(null);
    const [state, setState] = useState<CaptionState>(new CaptionState());

    useEffect(() => {
        fetchTemplate(params.id!)
            .then(template => {
                setTemplate(template);

                for (const text of template!.texts) {
                    setState(s => s.addCaption(text.label, text.content, text.x, text.y));
                }
            });
        }, []);

    return (
        <>
            {!template && <h2>Loading...</h2>}
            {template && <>
                <h2>{template.title}</h2>

                <article className="caption-area">
                    <div className="preview">
                        <img src={template.image} alt="" />
                        <svg>
                            {state.captions.map(c =>
                                <>
                                    <g key={c.id} x={c.x} y={c.y}>
                                        <text>{c.content}</text>
                                    </g>
                                </>)}
                        </svg>
                    </div>
                    <div className="controls">
                        {state.captions.map(c =>
                            <>
                                <label key={c.id}>
                                    {c.id}:
                                    <input type="text" name={c.id} value={c.content} onInput={x => setState(s => s.updateCaption(c.id, x.target.value))} />
                                </label>
                            </>)}
                    </div>
                </article>
            </>}
        </>
    );
}

class Caption {
    public readonly id: string;
    public content: string;
    public x: number;
    public y: number;

    constructor(id: string) {
        this.id = id;

        this.content = "";
        this.x = 0;
        this.y = 0;
    }
}

class CaptionState {
    public captions: Caption[];

    constructor(captions?: Caption[]) {
        this.captions = captions ?? [];
    }

    public addCaption(id: string, text: string, x: number, y: number) {
        if (this.captions.find(c => c.id === id))
        {
            return this;
        }

        const caption = new Caption(id);
        caption.content = text;
        caption.x = x;
        caption.y = y;

        return new CaptionState([...this.captions, caption]);
    }

    public updateCaption(id: string, text: string) {
        const index = this.captions.findIndex(c => c.id === id);

        const update = [...this.captions];
        const updatedCaption = new Caption(id);
        updatedCaption.content = text;
        updatedCaption.x = update[index].x;
        updatedCaption.y = update[index].y;
        update[index] = updatedCaption;

        return new CaptionState(update);
    }
}

export default captionTemplate;
