import { ChoiceType, getFixedValue, getTypeCode } from "fhir";
import { ElementDefinition } from "fhir/r5";
import { toMap } from "../util";
import FixedValueEditor from "./FixedValueEditor";
import StringEditor from "./StringEditor";

type Props = {
    base: ElementDefinition
    diff?: ElementDefinition
    onChange: (change: Partial<ElementDefinition>) => void
    url: string
}

export default function DescriptionEditor({ base, diff, onChange, url }: Props) {
    const baseTypes = base.type || [];
    const binding = diff?.binding || base.binding;
    const typeCode = baseTypes.length === 1 ? getTypeCode(baseTypes[0]) : undefined

    const allConstraints = Object.values(toMap((base.constraint || []).concat(diff?.constraint || []), v => v.key, v => v))
        .filter(c => c.source === url)

    return <>
        <StringEditor base={base.short} diff={diff?.short} onChange={short => onChange({ short })} />
        {allConstraints.map(c => <span key={c.key}><br /><span style={{ fontStyle: "italic" }}>+ Rule: {c.human}</span></span>)}
        {typeCode && typeCode in ChoiceType && <FixedValueEditor base={getFixedValue(base)} diff={diff && getFixedValue(diff)} onChange={onChange} type={ChoiceType[typeCode as keyof typeof ChoiceType]} />}
        {binding && <><br /> <span style={{ textTransform: "capitalize" }}>Binding: {(binding.extension || []).find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName")?.valueString} ({binding.strength})</span></>}
    </>
}