import './renderedCaption.css';

type Caption = {
    text: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
}

type RenderedCaptionProps = {
    caption: Caption;
}

function renderedCaption(props: RenderedCaptionProps) {
    return (
        <>
            <svg x={props.caption.top} y={props.caption.left} height={props.caption.bottom - props.caption.top} width={props.caption.right - props.caption.left}>
                <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="8">{props.caption.text}</text>
            </svg>
        </>
    );
}

export default renderedCaption;
