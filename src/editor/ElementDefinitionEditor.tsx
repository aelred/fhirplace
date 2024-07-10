import { faSquarePlus, faSquareXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ElementDefinition } from "fhir/r5"
import CardinalityEditor from "./CardinalityEditor"
import ChoiceTypesEditor from "./ChoiceTypesEditor"
import DescriptionEditor from "./DescriptionEditor"
import ElementIcon from "./ElementIcon"
import FlagsEditor from "./FlagsEditor"
import Row from "./Row"
import TypeEditor from "./TypeEditor"

type Props = {
    url: string
    base: ElementDefinition
    diff?: ElementDefinition
    isOpen?: boolean
    onChange: (element: ElementDefinition | undefined) => void
    setOpen: (open: boolean) => void
    indent: boolean[]
    hasChildren: boolean
    isLastChild: boolean
}

export default function ElementDefinitionEditor({ url, base, diff, isOpen, onChange, setOpen, indent, hasChildren, isLastChild }: Props) {
    const name = base.path.replaceAll(/[^.]*\./g, "")
    const baseTypes = base.type || []

    const nestedIndent = (baseTypes.length > 1 && isOpen) ? [...indent, true] : undefined

    function merge(change: Partial<ElementDefinition> | undefined) {
        if (change) {
            onChange({ ...(diff || { id: base.id, path: base.path }), ...change })
        } else {
            onChange(undefined)
        }
    }

    const hasChoices = baseTypes.length > 1 && isOpen !== false

    return (<>
        <Row
            icon={<ElementIcon elementDefinition={diff} types={baseTypes} contentReference={base.contentReference} />}
            name={name}
            flags={<FlagsEditor base={base} diff={diff} />}
            card={<CardinalityEditor base={{ min: base.min!, max: base.max! }} diff={diff} onChange={merge} />}
            type={base.type?.length === 1 && (<TypeEditor base={base.type[0]} diff={diff?.type?.at(0)} onChange={type => merge({ type: [type] })} />)}
            description={<DescriptionEditor base={base} diff={diff} onChange={merge} url={url} />}
            isOpen={isOpen}
            setOpen={setOpen}
            indent={indent}
            hasChildren={hasChildren || hasChoices}
            isLastChild={isLastChild}
            button={<FontAwesomeIcon
                className="hide-in-row"
                cursor="pointer"
                style={{ width: "16px", height: "16px" }}
                color={diff ? "red" : "green"}
                icon={diff ? faSquareXmark : faSquarePlus}
                onClick={e => merge(diff ? undefined : {})}
            />}
        />
        {hasChoices && <ChoiceTypesEditor
            base={baseTypes}
            diff={diff?.type}
            onChange={type => merge({ type })}
            elementName={name}
            indent={nestedIndent!}
        />}
    </>)
}