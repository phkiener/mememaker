import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchTemplate, type Template } from "../templates";
import './captionTemplate.css'

function captionTemplate() {
    const params = useParams();

    const [template, setTemplate] = useState<Template | null>(null);
    useEffect(() => { fetchTemplate(params.id!).then(template => setTemplate(template)); }, []);

    return (
        <>
            {!template && <h2>Loading...</h2>}
            {template && <>
                <h2>{template.title}</h2>

                <article className="caption-area">
                    <div className="preview">
                        <img src={template.image} alt="" />
                        <svg>

                        </svg>
                    </div>
                    <div className="controls">

                    </div>
                </article>
            </>}
        </>
    );
}

export default captionTemplate;
