import StrongIf from "StrongIf"
import { ChoiceType } from "fhir"
import { ElementDefinition } from "fhir/r5"
import { unreachable } from "../util"
import StringEditor from "./StringEditor"
import TextEditor from "./TextEditor"

// TODO: not just strings
type Props = {
    base?: string
    diff?: string
    onChange: (value: Partial<ElementDefinition>) => void
    type: ChoiceType
}

export default function FixedValueEditor({ base, diff, onChange, type }: Props) {
    const style = { color: "darkgreen" }

    function getEditor(type: ChoiceType) {
        switch (type) {
            case "string":
                return <StringEditor base={base} diff={diff} onChange={fixedString => onChange({ fixedString })} style={style} />;
            case "markdown":
                return <TextEditor base={base} diff={diff} onChange={fixedMarkdown => onChange({ fixedMarkdown })} style={style} />;
            case "url":
                return <StringEditor base={base} diff={diff} onChange={fixedUrl => onChange({ fixedUrl })} type="url" style={style} />;
            case "uri":
                return <StringEditor base={base} diff={diff} onChange={fixedUri => onChange({ fixedUri })} type="url" style={style} />;
            case "date":
                return <StringEditor base={base} diff={diff} onChange={fixedDate => onChange({ fixedDate })} type="date" style={style} />;
            case "time":
                return <StringEditor base={base} diff={diff} onChange={fixedTime => onChange({ fixedTime })} type="time" style={style} />;
            case "dateTime":
                return <StringEditor base={base} diff={diff} onChange={fixedDateTime => onChange({ fixedDateTime })} type="datetime-local" style={style} />;
            case "code":
                // TODO: constrain to valid choices
                return <StringEditor base={base} diff={diff} onChange={fixedCode => onChange({ fixedCode })} style={style} />;
            default:
                return unreachable(type)
        }
    }
    return (<>
        <br />
        <StrongIf condition={!!diff}>Fixed Value: </StrongIf>
        {getEditor(type)}
    </>)
}