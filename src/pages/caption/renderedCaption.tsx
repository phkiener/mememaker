import './renderedCaption.css';

type Caption = {
    id: string;
    text: string;
    top: number;
    left: number;
    bottom: number;
    right: number;
}

type RenderedCaptionProps = {
    caption: Caption;
    active: boolean;
}

function renderedCaption(props: RenderedCaptionProps) {
    return (
        <>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className={`caption ${props.active ? "active" : ""}`} id={props.caption.id}
                 x={props.caption.left} width={props.caption.right - props.caption.left}
                 y={props.caption.top} height={props.caption.bottom - props.caption.top}>

                <rect className="outline" x="0%" y="0%" height="100%" width="100%" />

                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="8" stroke="black" strokeWidth=".25px" fill="white">{props.caption.text}</text>

                <rect className="handle resize top-left" />
                <rect className="handle resize top" />
                <rect className="handle resize top-right" />

                <rect className="handle resize left" />
                <rect className="handle resize right" />

                <rect className="handle resize bottom-left" />
                <rect className="handle resize bottom" />
                <rect className="handle resize bottom-right" />

            </svg>
        </>
    );
}

export default renderedCaption;
