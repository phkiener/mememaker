import type { InputEventHandler } from "react";
import './captionSettings.css'

type Caption = {
    id: string;
    title: string;
    text: string;
}

type CaptionSettingsProps = {
    caption: Caption;
    onChange: InputEventHandler<HTMLInputElement>,
}

function captionSettings(props: CaptionSettingsProps) {
    return (
        <>
            <label>
                {props.caption.title}:
                <input type="text" name={props.caption.id} value={props.caption.text} onInput={props.onChange} />
            </label>
        </>
    );
}

export default captionSettings;
