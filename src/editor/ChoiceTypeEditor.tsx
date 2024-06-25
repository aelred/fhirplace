import { ElementDefinitionType } from "fhir/r5";
import icon_datatype from 'hl7fhir/icon_datatype.gif';
import icon_element from 'hl7fhir/icon_element.gif';
import icon_primitive from 'hl7fhir/icon_primitive.png';
import icon_reference from 'hl7fhir/icon_reference.png';
import tbl_blank from 'hl7fhir/tbl_blank.png';
import tbl_spacer from 'hl7fhir/tbl_spacer.png';
import tbl_vline from 'hl7fhir/tbl_vline.png';
import { ReactElement } from "react";
import { capitalize } from "../util";
import TypeEditor from "./TypeEditor";
import VJoin from "./VJoin";

type Props = {
    base: ElementDefinitionType
    diff?: ElementDefinitionType
    onChange: (value: ElementDefinitionType) => void
    elementName: string
    indent: boolean[]
    nextIndent: boolean[]
}

export default function ({ base, diff, onChange, elementName, indent, nextIndent }: Props) {
    const name = `${elementName.substring(0, elementName.indexOf("[x]"))}${capitalize(base.code)}`

    var icon = icon_datatype;
    if (base.code[0].match(/[a-z]/)) {
        icon = icon_primitive;
    } else if (base.code === "Reference") {
        icon = icon_reference;
    } else if (base.code === "BackboneElement") {
        icon = icon_element;
    }

    const backgroundImage = `url(${process.env.PUBLIC_URL}/hl7fhir/tbl_bck${nextIndent.map(b => +b).join("")}.png)`;

    return (<tr style={{ border: "0px #F0F0F0 solid", padding: "0px", verticalAlign: "top" }}>
        <td style={{ whiteSpace: "nowrap", backgroundImage }} className="hierarchy">
            <img src={tbl_spacer} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {indent.slice(0, -1).map(drawLine => {
                const image = drawLine ? tbl_vline : tbl_blank;
                return (<img src={image} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />)
            })}
            {indent.length > 0 && (<VJoin isLastChild={!nextIndent[indent.length - 1]} setOpen={() => { }} />)}
            <img src={icon} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {" "}
            {name}
        </td>
        <td className="hierarchy" />
        <td className="hierarchy" />
        <td className="hierarchy">
            <TypeEditor base={base} diff={diff} onChange={onChange} />
        </td>
        <td className="hierarchy" />
    </tr>)
}

function renderType(type: ElementDefinitionType | undefined): ReactElement | undefined {
    const extensions = type?.extension || [];
    const typeExtension = extensions.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type")?.valueUrl
    return <span>{typeExtension || type?.code || ""}</span>
}