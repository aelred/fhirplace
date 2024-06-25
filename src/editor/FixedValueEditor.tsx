import StringEditor from "./StringEditor"

// TODO: not just strings
type Props = {
    base?: string
    diff?: string
    onChange: (value: string | undefined) => void
}

export default function ({ base, diff, onChange }: Props) {
    return (<>
        <br />
        <span style={{ fontWeight: "bold" }}>Fixed Value: </span>
        <StringEditor base={base} diff={diff} onChange={onChange} style={{ color: "darkgreen" }} />
    </>)
}