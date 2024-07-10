import { ElementTree } from "ElementTree"
import { ElementDefinition } from "fhir/r5"
import { useState } from "react"
import ElementDefinitionEditor from "./ElementDefinitionEditor"
import ExpandableRow from "./ExpandableRow"

type Props = {
    base: ElementTree
    diff?: ElementTree
    onChange: (value: ElementTree) => void
    url: string
    indent: boolean[]
    isLastChild: boolean
    alwaysOpen?: boolean
}

export default function ElementTreeEditor({ base, diff: differential, onChange, url, indent, isLastChild, alwaysOpen }: Props) {
    const [open, setOpen] = useState<boolean>(false)
    const [openBase, setOpenBase] = useState<boolean>(false)

    const diff = differential || ElementTree.empty()

    function updateElement(newElement: ElementDefinition | undefined) {
        onChange(diff.setElementDefinition(newElement))
    }

    function setChild(field: string, child: ElementTree) {
        onChange(diff.setChild(field, child))
    }

    const hasChildren = base.children.size > 0

    const displayChildren = hasChildren && (alwaysOpen || open)

    const baseElements = [...base.fields()].filter(field => !diff.has(field))

    const thisIndent = [...indent]
    if (isLastChild) thisIndent[thisIndent.length - 1] = false

    const children = []

    if (displayChildren) {
        for (var field of diff.fields()) {
            const theField = field
            children.push(<ElementTreeEditor
                key={field}
                base={base.get(field)!}
                diff={diff.get(field)}
                onChange={tree => setChild(theField, tree)}
                url={url}
                indent={thisIndent.concat([true])}
                isLastChild={false}
            />)
        }
        children.push(<ExpandableRow
            key="$base"
            name="Base"
            isOpen={openBase}
            setOpen={setOpenBase}
            indent={thisIndent.concat([true])}
            isLastChild={!openBase}
        />)
        if (openBase) {
            baseElements.forEach((field, index) => {
                children.push(<ElementTreeEditor
                    key={field}
                    base={base.get(field)!}
                    onChange={tree => setChild(field, tree)}
                    url={url}
                    indent={thisIndent.concat([true])}
                    isLastChild={index === baseElements.length - 1}
                />)
            })
        }
    }

    return <>
        <ElementDefinitionEditor
            url={url}
            base={base.element!}
            diff={diff.element}
            isOpen={(hasChildren && !alwaysOpen) || (base.element!.type?.length || 0) > 1 ? open : undefined}
            onChange={updateElement}
            setOpen={setOpen}
            indent={thisIndent}
            hasChildren={displayChildren}
            isLastChild={isLastChild}
        />
        {children}
    </>
}