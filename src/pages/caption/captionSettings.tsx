import type { InputEventHandler } from "react";
import './captionSettings.css'

type Caption = {
    id: string;
    title: string;
    text: string;
}

type CaptionSettingsProps = {
    caption: Caption;
    onChange: InputEventHandler<HTMLTextAreaElement>,
}

function CaptionSettings(props: CaptionSettingsProps) {
    return (
        <>
            <div className="caption-control">
                <span>{props.caption.title}</span>
                <textarea name={props.caption.id} onInput={props.onChange} value={props.caption.text}></textarea>
            </div>
        </>
    );
}

export default CaptionSettings;
