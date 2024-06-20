import { ElementDefinition, ElementDefinitionType } from "fhir/r5";
import { ReactElement } from "react";
import Select from "react-select";
import { CardinalityEditor } from "./CardinalityEditor";

type ElementDefinitionProps = {
    base: ElementDefinition;
    differential: ElementDefinition;
    onChange: (element: ElementDefinition) => any;
    indent: boolean[];
    nextIndent: boolean[];
}

export function ElementDefinitionEditor({ base, differential, onChange, indent, nextIndent }: ElementDefinitionProps) {
    const name = base.path.replaceAll(/[^.]*\./g, "");
    const types = differential.type || base.type || [];
    const contentReference = differential.contentReference || base.contentReference;
    const short = differential.short || base.short || "";

    var icon = "hl7fhir/icon_datatype.gif";
    if (contentReference) {
        icon = "hl7fhir/icon_reuse.png";
    } else if (types.length === 0) {
        icon = "hl7fhir/icon_resource.png";
    } else if (types.length > 1) {
        icon = "hl7fhir/icon_choice.gif";
    } else if (types[0].code[0].match(/[a-z]/)) {
        icon = "hl7fhir/icon_primitive.png";
    } else if (types[0].code === "Reference") {
        icon = "hl7fhir/icon_reference.png";
    } else if (types[0].code === "BackboneElement") {
        icon = "hl7fhir/icon_element.gif";
    }

    const backgroundImage = `url(hl7fhir/tbl_bck${nextIndent.map(b => +b).join("")}.png)`;

    return (<tr style={{ border: "0px #F0F0F0 solid", padding: "0px", verticalAlign: "top" }}>
        <td style={{ verticalAlign: "top", textAlign: "left", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px", whiteSpace: "nowrap", backgroundImage }} className="hierarchy">
            <img src="hl7fhir/tbl_spacer.png" alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {/* TODO: nice lines */}
            {indent.slice(0, -1).map(drawLine => {
                const image = drawLine ? "hl7fhir/tbl_vline.png" : "hl7fhir/tbl_blank.png";
                return (<img src={image} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />)
            })}
            {vjoinImage(indent, nextIndent)}
            <img src={icon} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
            {" "}
            {name}
        </td>
        {/* TODO: flags */}
        <td></td>
        <td style={{ verticalAlign: "top", textAlign: "left", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
            <CardinalityEditor baseMin={base.min!} baseMax={base.max!} diffMin={differential.min} diffMax={differential.max} onChange={(min: number, max: string) => {
                onChange({ ...differential, min: min, max: max });
            }} />
        </td>
        <td style={{ verticalAlign: "top", textAlign: "left", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
            {/* TODO: handle multiple types */}
            {renderType(types[0])}
            {references(types[0]?.targetProfile || [])}
        </td>
        <td style={{ verticalAlign: "top", textAlign: "left", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
            {/* TODO: add constraints */}
            {/* TODO: apply changes */}
            {<textarea placeholder={short} className="subtle" />}
        </td>
        <td></td>
    </tr>)
}

function renderType(type: ElementDefinitionType | undefined): ReactElement | undefined {
    const extensions = type?.extension || [];
    const typeExtension = extensions.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type")?.valueUrl
    return <span>{typeExtension || type?.code || ""}</span>
}

function vjoinImage(indent: boolean[], nextIndent: boolean[]): ReactElement | undefined {
    if (indent.length > 0) {
        const joinImage = nextIndent[indent.length - 1] ? "hl7fhir/tbl_vjoin.png" : "hl7fhir/tbl_vjoin_end.png";
        return <img src={joinImage} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />;
    }
}

function references(targetProfiles: string[]): ReactElement | undefined {
    if (targetProfiles.length > 0) {
        const options = targetProfiles.map(profile => {
            return {
                value: profile,
                label: profile.replace(/^http:\/\/hl7\.org\/fhir\/StructureDefinition\//, "")
            }
        });

        // TODO: make it actually apply changes
        return <Select defaultValue={options} isMulti closeMenuOnSelect={false} options={options} className="select" />
    }
}