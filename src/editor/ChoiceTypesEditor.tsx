import { ElementDefinitionType } from "fhir/r5";
import { useState } from "react";
import AddChoiceType from "./AddChoiceType";
import ChoiceTypeEditor from "./ChoiceTypeEditor";
import ExpandableRow from "./ExpandableRow";

type Props = {
    base: ElementDefinitionType[]
    diff?: ElementDefinitionType[]
    onChange: (value: ElementDefinitionType[]) => void
    elementName: string
    indent: boolean[]
    nextIndent: boolean[]
}

// TODO: display AddChoiceType when clicked
export default function ChoiceTypesEditor({ base, diff, onChange, elementName, indent, nextIndent }: Props) {
    const baseTypes = base || [];
    const diffTypes = diff || baseTypes;

    const [isOpen, setOpen] = useState(false)

    const selectedCodes = diffTypes.map(type => type.code)
    const unselectedTypes = baseTypes.filter(type => !selectedCodes.includes(type.code))

    function onChangeType(newType: ElementDefinitionType) {
        const newTypes = [...diff || []]
        const existingIndex = newTypes.findIndex(type => type.code == newType.code)
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

    return <>
        {diffTypes.map(type =>
            <ChoiceTypeEditor
                key={type.code}
                base={type}
                diff={(diff || []).find(t => t.code == type.code)}
                onChange={onChangeType}
                onRemove={() => onRemove(type)}
                elementName={elementName}
                indent={indent}
                nextIndent={indent}
            />
        )}
        <ExpandableRow
            name="Choices"
            isOpen={isOpen}
            setOpen={setOpen}
            hasChildren={unselectedTypes.length > 0}
            indent={indent}
            nextIndent={nextIndent}
        />
        {
            isOpen && unselectedTypes.length > 0 && <>
                {unselectedTypes.slice(0, -1).map(type =>
                    <AddChoiceType base={type} elementName={elementName} indent={indent} nextIndent={indent} onAdd={() => onAdd(type)} />
                )}
                <AddChoiceType base={unselectedTypes.at(-1)!} elementName={elementName} indent={indent} nextIndent={nextIndent} onAdd={() => onAdd(unselectedTypes.at(-1)!)} />
            </>
        }
    </>
}