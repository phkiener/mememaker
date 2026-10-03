import { useEffect, useState } from "react";
import { fetchTemplates, type Template } from "../templates";
import TemplateCard from "../components/templateCard.tsx";
import './templateList.css';

function templateList() {
    const [templates, setTemplates] = useState<Template[]>([]);
    useEffect(() => { fetchTemplates().then(templates => setTemplates(templates)); }, []);

    return (
        <>
            {templates?.length === 1 && <h2>1 template found</h2>}
            {templates?.length !== 1 && <h2>{templates?.length} templates found</h2>}

            <ul className="template-list">
                {templates?.map(t =>
                    <li key={t.id}>
                        <TemplateCard id={t.id} title={t.title} imageUrl={t.image} />
                    </li>
                )}
            </ul>
        </>
    );
}

export default templateList;
