export type Template = {
    id: string;
    title: string;
    image: string;
    tags: string[];
    texts: TemplateLabel[]
}

export type TemplateLabel = {
    label: string;
    content: string;

    top: number;
    left: number;
    bottom: number;
    right: number;
}
