import { CHOICE_TYPES, getTypeCode } from "fhir";
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
import { toMap } from "../util";
import CardinalityEditor from "./CardinalityEditor";
import ChoiceTypeEditor from "./ChoiceTypeEditor";
import FixedValueEditor from "./FixedValueEditor";
import FlagsEditor from "./FlagsEditor";
import StringEditor from "./StringEditor";
import TypeEditor from "./TypeEditor";
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

export default function ({ url, base, diff, isOpen, onChange, setOpen, indent, nextIndent }: Props) {
    const name = base.path.replaceAll(/[^.]*\./g, "");
    const types = base.type || [];
    const binding = diff.binding || base.binding;

    var icon = icon_datatype;
    if (diff.contentReference || base.contentReference) {
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

    const nestedIndent = (types.length > 1 && isOpen) ? [...indent, true] : undefined;

    const backgroundImage = `url(${process.env.PUBLIC_URL}/hl7fhir/tbl_bck${(nestedIndent || nextIndent).map(b => +b).join("")}.png)`;

    const canHaveFixedValue = types.length === 1 && CHOICE_TYPES.includes(getTypeCode(types[0]))

    function merge(change: Partial<ElementDefinition>) {
        onChange({ ...diff, ...change })
    }

    const allConstraints = Object.values(toMap((base.constraint || []).concat(diff.constraint || []), v => v.key, v => v))
        .filter(c => c.source === url)

    function onChangeType(newType: ElementDefinitionType) {
        const newTypes = [...diff.type || []]
        const existingIndex = newTypes.findIndex(type => type.code == newType.code)
        if (existingIndex !== -1) {
            newTypes[existingIndex] = newType
        } else {
            newTypes.push(newType)
        }
        merge({ type: newTypes })
    }

    function choiceTypeEditor(baseType: ElementDefinitionType, openTypeNextIndent: boolean[]) {
        const diffType = (diff.type || []).find(type => type.code == baseType.code)
        return <ChoiceTypeEditor base={baseType} diff={diffType} onChange={onChangeType} elementName={name} indent={nestedIndent!} nextIndent={openTypeNextIndent} />
    }

    return (<>
        <tr style={{ border: "0px #F0F0F0 solid", padding: "0px", verticalAlign: "top" }}>
            <td style={{ whiteSpace: "nowrap", backgroundImage }} className="hierarchy">
                <img src={tbl_spacer} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
                {indent.slice(0, -1).map(drawLine => {
                    const image = drawLine ? tbl_vline : tbl_blank;
                    return (<img src={image} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />)
                })}
                {indent.length > 0 && (<VJoin isOpen={isOpen} isLastChild={!(nestedIndent || nextIndent)[indent.length - 1]} setOpen={setOpen} />)}
                <img src={icon} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
                {" "}
                {name}
            </td>
            <td className="hierarchy"><FlagsEditor base={base} diff={diff} /></td>
            <td className="hierarchy">
                <CardinalityEditor base={{ min: base.min!, max: base.max! }} diff={diff} onChange={merge} />
            </td>
            <td className="hierarchy">
                {base.type?.length === 1 && (<TypeEditor base={base.type[0]} diff={diff.type?.at(0)} onChange={type => merge({ type: [type] })} />)}
            </td>
            <td className="hierarchy">
                <StringEditor base={base.short} diff={diff.short} onChange={short => merge({ short })} />
                {allConstraints.map(c => <span><span style={{ fontStyle: "italic" }}>+ Rule: {c.human}</span><br /></span>)}
                {canHaveFixedValue && <FixedValueEditor base={base.fixedString} diff={diff.fixedString} onChange={fixedString => merge({ fixedString })} />}
                {binding && <><br /> <span style={{ textTransform: "capitalize" }}>Binding: {(binding.extension || []).find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/elementdefinition-bindingName")?.valueString} ({binding.strength})</span></>}
            </td>
        </tr >
        {
            types.length > 1 && isOpen !== false && (<>
                {types.slice(0, -1).map(type => choiceTypeEditor(type, nestedIndent!))}
                {choiceTypeEditor(types.at(-1)!, nextIndent)}
            </>)
        }
    </>)
}