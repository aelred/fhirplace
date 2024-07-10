import { faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ElementDefinitionType } from "fhir/r5"
import { capitalize } from "../util"
import ElementIcon from "./ElementIcon"
import Row from "./Row"
import TypeEditor from "./TypeEditor"

type Props = {
    base: ElementDefinitionType
    diff?: ElementDefinitionType
    onChange: (value: ElementDefinitionType) => void
    onRemove: () => void
    elementName: string
    indent: boolean[]
    isLastChild: boolean
}

export default function ChoiceTypeEditor({ base, diff, onChange, onRemove, elementName, indent, isLastChild }: Props) {
    return <Row
        icon={<ElementIcon types={[base]} />}
        name={`${elementName.substring(0, elementName.indexOf("[x]"))}${capitalize(base.code)}`}
        card={<FontAwesomeIcon
            className="hide-in-row"
            cursor="pointer"
            style={{ width: "16px", height: "16px" }}
            color="red"
            icon={faSquareXmark}
            onClick={e => onRemove()}
        />}
        type={<TypeEditor base={base} diff={diff} onChange={onChange} />}
        indent={indent}
        hasChildren={false}
        isLastChild={isLastChild}
    />
}