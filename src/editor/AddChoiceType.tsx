import { faSquarePlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import StrongIf from "StrongIf"
import { getTypeCode, shortProfileName } from "fhir"
import { ElementDefinitionType } from "fhir/r5"
import { capitalize } from "../util"
import ElementIcon from "./ElementIcon"
import Row from "./Row"

type Props = {
    base: ElementDefinitionType
    elementName: string
    onAdd: () => void
    indent: boolean[]
    isLastChild: boolean
}

export default function AddChoiceType({ base, elementName, onAdd, indent, isLastChild }: Props) {
    return <Row
        icon={<ElementIcon types={[base]} />}
        name={<StrongIf condition={false}>{elementName.substring(0, elementName.indexOf("[x]"))}{capitalize(base.code)}</StrongIf>}
        button={<FontAwesomeIcon
            className="hide-in-row"
            cursor="pointer"
            style={{ width: "16px", height: "16px" }}
            color="green"
            icon={faSquarePlus}
            onClick={e => onAdd()}
        />}
        type={<span className="type">{getTypeCode(base)}{base.targetProfile && <>({base.targetProfile.map(shortProfileName).join(" | ")})</>}</span>}
        indent={indent}
        hasChildren={false}
        isLastChild={isLastChild}
    />
}