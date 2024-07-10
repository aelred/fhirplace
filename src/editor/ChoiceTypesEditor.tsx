import { ElementDefinitionType } from "fhir/r5"
import { useState } from "react"
import AddChoiceType from "./AddChoiceType"
import ChoiceTypeEditor from "./ChoiceTypeEditor"
import ExpandableRow from "./ExpandableRow"

type Props = {
    base: ElementDefinitionType[]
    diff?: ElementDefinitionType[]
    onChange: (value: ElementDefinitionType[]) => void
    elementName: string
    indent: boolean[]
}

// TODO: display AddChoiceType when clicked
export default function ChoiceTypesEditor({ base, diff, onChange, elementName, indent }: Props) {
    const baseTypes = base || []
    const diffTypes = diff || baseTypes

    const [isOpen, setOpen] = useState(false)

    const selectedCodes = diffTypes.map(type => type.code)
    const unselectedTypes = baseTypes.filter(type => !selectedCodes.includes(type.code))

    function onChangeType(newType: ElementDefinitionType) {
        const newTypes = [...diff || []]
        const existingIndex = newTypes.findIndex(type => type.code === newType.code)
        if (existingIndex !== -1) {
            newTypes[existingIndex] = newType
        } else {
            newTypes.push(newType)
        }
        onChange(newTypes)
    }

    function onAdd(type: ElementDefinitionType) {
        const newTypes = [...diff || []]
        newTypes.push(type)
        onChange(newTypes)
    }

    function onRemove(type: ElementDefinitionType) {
        onChange(diffTypes.filter(t => t.code !== type.code))
    }

    const displayUnselectedTypes = isOpen && unselectedTypes.length > 0

    return <>
        {diffTypes.map(type =>
            <ChoiceTypeEditor
                key={type.code}
                base={type}
                diff={(diff || []).find(t => t.code === type.code)}
                onChange={onChangeType}
                onRemove={() => onRemove(type)}
                elementName={elementName}
                indent={indent}
                isLastChild={false}
            />
        )}
        <ExpandableRow
            name="Choices"
            isOpen={isOpen}
            setOpen={setOpen}
            indent={indent}
            isLastChild={!displayUnselectedTypes}
        />
        {
            displayUnselectedTypes && <>
                {unselectedTypes.map((type, idx) =>
                    <AddChoiceType
                        key={type.code}
                        base={type}
                        elementName={elementName}
                        indent={indent}
                        isLastChild={idx === unselectedTypes.length - 1}
                        onAdd={() => onAdd(type)}
                    />
                )}
            </>
        }
    </>
}
