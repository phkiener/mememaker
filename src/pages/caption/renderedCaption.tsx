type Caption = {
    text: string;
    x: number;
    y: number;
}

type RenderedCaptionProps = {
    caption: Caption;
}

function renderedCaption(props: RenderedCaptionProps) {
    return (
        <>
            <g>
                <text x={props.caption.x * 100} y={props.caption.y * 100}>{props.caption.text}</text>
            </g>
        </>
    );
}

export default renderedCaption;
