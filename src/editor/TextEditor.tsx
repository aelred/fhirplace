import { CSSProperties } from "react";

type Props = {
    base?: string
    diff?: string
    onChange: (value: string | undefined) => void
    style?: CSSProperties
};

export default function TextEditor({ base, diff, onChange, style }: Props) {
    return <textarea
        value={diff}
        placeholder={base || "Enter a value"}
        onChange={e => onChange(e.target.value || undefined)}
        className="subtle"
        style={style}
    />
}