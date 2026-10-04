import './renderedCaption.css';

type Caption = {
    text: string;
    x: number;
    y: number;

    // TODO: Probably gonna switch to "top", "left", "bottom", "right" for this. Makes sizing easier. Text will just.. have to clip, I guess.
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
