import { ElementDefinition, ElementDefinitionType } from "fhir/r5";
import icon_choice from 'hl7fhir/icon_choice.gif';
import icon_datatype from 'hl7fhir/icon_datatype.gif';
import icon_element from 'hl7fhir/icon_element.gif';
import icon_primitive from 'hl7fhir/icon_primitive.png';
import icon_reference from 'hl7fhir/icon_reference.png';
import icon_resource from 'hl7fhir/icon_resource.png';
import icon_reuse from 'hl7fhir/icon_reuse.png';
import tbl_blank from 'hl7fhir/tbl_blank.png';
import tbl_spacer from 'hl7fhir/tbl_spacer.png';
import tbl_vline from 'hl7fhir/tbl_vline.png';
import { ReactElement } from "react";
import { toMap } from "../util";
import CardinalityEditor from "./CardinalityEditor";
import StringEditor from "./StringEditor";
import TargetProfilesEditor from "./TargetProfilesEditor";
import VJoin from "./VJoin";

type Props = {
    url: string;
    base: ElementDefinition;
    diff: ElementDefinition;
    isOpen?: boolean;
    onChange: (element: ElementDefinition) => void;
    setOpen: (open: boolean) => void;
    indent: boolean[];
    nextIndent: boolean[];
}

export default function ElementDefinitionEditor({ url, base, diff, isOpen, onChange, setOpen, indent, nextIndent }: Props) {
    const name = base.path.replaceAll(/[^.]*\./g, "");
    const types = base.type || [];
    const contentReference = diff.contentReference || base.contentReference;
    const binding = diff.binding || base.binding;

    var icon = icon_datatype;
    if (contentReference) {
        icon = icon_reuse;
    } else if (types.length === 0) {
        icon = icon_resource;
    } else if (types.length > 1) {
        icon = icon_choice;
    } else if (types[0].code[0].match(/[a-z]/)) {
        icon = icon_primitive;
    } else if (types[0].code === "Reference") {
        icon = icon_reference;
    } else if (types[0].code === "BackboneElement") {
        icon = icon_element;
    }

    const baseTargetProfiles = (base.type || [])[0]?.targetProfile
    const diffTargetProfiles = (diff.type || [])[0]?.targetProfile

    const backgroundImage = `url(${process.env.PUBLIC_URL}/hl7fhir/tbl_bck${nextIndent.map(b => +b).join("")}.png)`;

    function merge(change: Partial<ElementDefinition>) {
        onChange({ ...diff, ...change })
    }

    const allConstraints = Object.values(toMap((base.constraint || []).concat(diff.constraint || []), v => v.key, v => v))
        .filter(c => c.source === url)

    return (<tr style={{ border: "0px #F0F0F0 solid", padding: "0px", verticalAlign: "top" }}>
        <td style={{ whiteSpace: "nowrap", backgroundImage }} className="hierarchy">
            <img src={tbl_spacer} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {indent.slice(0, -1).map(drawLine => {
                const image = drawLine ? tbl_vline : tbl_blank;
                return (<img src={image} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />)
            })}
            {indent.length > 0 && (<VJoin isOpen={isOpen} isLastChild={!nextIndent[indent.length - 1]} setOpen={setOpen} />)}
            <img src={icon} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {" "}
            {name}
        </td>
        <td className="hierarchy">
            {(diff.isModifier || base.isModifier) && <span style={{ paddingLeft: "3px", paddingRight: "3px", color: "black" }}>?!</span>}
            {(diff.mustSupport || base.mustSupport) && <span style={{ paddingLeft: "3px", paddingRight: "3px", color: "black" }}>S</span>}
            {(diff.isSummary || base.isSummary) && <span style={{ paddingLeft: "3px", paddingRight: "3px", color: "black" }}>Σ</span>}
            {/* TODO: I/NE/TU/N/D flags */}
        </td>
        <td className="hierarchy">
            <CardinalityEditor base={{ min: base.min!, max: base.max! }} diff={diff} onChange={merge} />
        </td>
        <td className="hierarchy">
            <span className="type">
                {/* TODO: handle multiple types */}
                {renderType(types[0])}
                {baseTargetProfiles &&
                    <TargetProfilesEditor base={baseTargetProfiles} diff={diffTargetProfiles} onChange={targetProfile => merge({ type: [{ ...(diff.type || [])[0] || {}, targetProfile }] })} />}
            </span>
        </td>
        <td className="hierarchy">
            <StringEditor base={base.short} diff={diff.short} onChange={short => merge({ short })} />
            <br />
            {allConstraints.map(c => <span><span style={{ fontStyle: "italic" }}>+ Rule: {c.human}</span><br /></span>)}
            {binding && <span style={{ textTransform: "capitalize" }}>Binding: {(binding.extension || []).find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName")?.valueString} ({binding.strength})</span>}
        </td>
    </tr>)
}

function renderType(type: ElementDefinitionType | undefined): ReactElement | undefined {
    const extensions = type?.extension || [];
    const typeExtension = extensions.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type")?.valueUrl
    return <span>{typeExtension || type?.code || ""}</span>
}