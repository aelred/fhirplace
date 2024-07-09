import { getFixedValue, getTypeCode } from 'fhir';
import { ElementDefinition, ElementDefinitionType } from 'fhir/r5';
import icon_choice from 'hl7fhir/icon_choice.gif';
import icon_datatype from 'hl7fhir/icon_datatype.gif';
import icon_element from 'hl7fhir/icon_element.gif';
import icon_fixed from 'hl7fhir/icon_fixed.gif';
import icon_primitive from 'hl7fhir/icon_primitive.png';
import icon_reference from 'hl7fhir/icon_reference.png';
import icon_resource from 'hl7fhir/icon_resource.png';
import icon_reuse from 'hl7fhir/icon_reuse.png';

type Props = {
    types: ElementDefinitionType[]
    elementDefinition?: ElementDefinition,
    contentReference?: string
}

export default function ElementIcon({ types, elementDefinition, contentReference }: Props) {
    const icon = getIcon(types, elementDefinition, contentReference)
    return <img src={icon} alt="." style={{ backgroundColor: "inherit" }} className="hierarchy" />
}

function getIcon(
    types: ElementDefinitionType[], elementDefinition?: ElementDefinition, contentReference?: string
) {
    const typeCode = types.length === 1 ? getTypeCode(types[0]) : undefined

    if (contentReference) {
        return icon_reuse;
    } else if (types.length === 0) {
        return icon_resource;
    } else if (types.length > 1) {
        return icon_choice;
    } else if (elementDefinition && getFixedValue(elementDefinition)) {
        return icon_fixed
    } else if (typeCode![0].match(/[a-z]/)) {
        return icon_primitive;
    } else if (typeCode === "Reference") {
        return icon_reference;
    } else if (typeCode === "BackboneElement") {
        return icon_element;
    } else {
        return icon_datatype;
    }
}