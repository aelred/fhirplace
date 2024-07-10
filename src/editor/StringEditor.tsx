import { CSSProperties, HTMLInputTypeAttribute } from "react"

type Props = {
    base: string | undefined
    diff: string | undefined
    onChange: (value: string | undefined) => void
    type?: HTMLInputTypeAttribute
    style?: CSSProperties
}

export default function StringEditor({ base, diff, onChange, type, style }: Props) {
    return <input
        type={type}
        value={diff || ""}
        placeholder={base || "Enter a value"}
        onChange={e => onChange(e.target.value || undefined)}
        className="subtle"
        style={style}
    />
}