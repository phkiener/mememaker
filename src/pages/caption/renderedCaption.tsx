import './renderedCaption.css';

type Caption = {
    id: string;
    text: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
    angle: number;
}

type RenderedCaptionProps = {
    caption: Caption;
    active: boolean;
}

function renderedCaption(props: RenderedCaptionProps) {
    const lines = props.caption.text.split('\n');

    return (
        <>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className={`caption ${props.active ? "active" : ""}`} id={props.caption.id}
                 x={props.caption.left} width={props.caption.right - props.caption.left}
                 y={props.caption.top} height={props.caption.bottom - props.caption.top}>

                <rect className="outline" x="0%" y="0%" height="100%" width="100%" />

                <text textAnchor="middle" dominantBaseline="middle" fontSize="8" stroke="black" strokeWidth=".25px" fill="white" fontFamily="impact"
                      transform={`rotate(${props.caption.angle})`} transformOrigin="center">
                    {lines.map((line, index) => <tspan key={index} x="50%" y={!index ? `50%` : undefined} dy={index ? "1em" : (lines.length - 1) * -0.5 + "em"}>{line}</tspan>)}
                </text>

                <rect className="handle resize top-left" data-anchor="nw" />
                <rect className="handle resize top-right" data-anchor="ne" />
                <rect className="handle resize bottom-left" data-anchor="sw" />
                <rect className="handle resize bottom-right" data-anchor="se" />

                <circle className="handle rotate top" data-anchor="n" />
                <circle className="handle rotate left" data-anchor="e" />
                <circle className="handle rotate bottom" data-anchor="s" />
                <circle className="handle rotate right" data-anchor="w" />
            </svg>
        </>
    );
}

export default renderedCaption;
