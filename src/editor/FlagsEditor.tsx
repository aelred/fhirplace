import { ElementDefinition } from "fhir/r5"

type Props = {
    base: ElementDefinition
    diff?: ElementDefinition
}

export default function FlagsEditor({ diff, base }: Props) {
    return <>
        {(diff?.isModifier || base.isModifier) && <span style={{ paddingLeft: "3px", paddingRight: "3px", color: "black" }}>?!</span>}
        {(diff?.mustSupport || base.mustSupport) && <span style={{ paddingLeft: "3px", paddingRight: "3px", color: "black" }}>S</span>}
        {(diff?.isSummary || base.isSummary) && <span style={{ paddingLeft: "3px", paddingRight: "3px", color: "black" }}>Σ</span>}
        {/* TODO: I/NE/TU/N/D flags */}
    </>
}