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

function captionSettings(props: CaptionSettingsProps) {
    return (
        <>
            <label>
                {props.caption.title}:
                <textarea name={props.caption.id} onInput={props.onChange} value={props.caption.text}></textarea>
            </label>
        </>
    );
}

export default captionSettings;
