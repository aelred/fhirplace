import { ElementTree } from "ElementTree"
import { Path } from "fhir"
import { ElementDefinition } from "fhir/r5"
import { useState } from "react"
import ElementDefinitionEditor from "./ElementDefinitionEditor"
import ExpandableRow from "./ExpandableRow"

type SnapshotSeparator = {
    isSnapshotSeparator: true
    id: string
    path: string
}

type Props = {
    base: ElementDefinition[]
    diff: ElementDefinition[]
    onChange: (value: ElementDefinition[]) => void
    url: string
}

export default function ElementDefinitionTreeEditor({ base, diff, onChange, url }: Props) {
    const [openElements, setOpenElements] = useState<{ [id: string]: boolean }>({})
    const [openBases, setOpenBases] = useState<{ [id: string]: boolean }>({})

    const diffById: { [id: string]: ElementDefinition } = {}
    for (var elementDefinition of diff) {
        diffById[elementDefinition.id!] = elementDefinition
    }

    function isOpen(path: string): boolean {
        return openElements[path] === true
    }

    function isBaseOpen(path: string): boolean {
        return openBases[path] === true
    }

    function setOpen(path: string, isOpen: boolean) {
        setOpenElements({ ...openElements, [path]: isOpen })
    }

    function setOpenBase(path: string, isOpen: boolean) {
        setOpenBases({ ...openBases, [path]: isOpen })
    }

    const snapshot = base || []

    const parentElements: { [path: string]: boolean } = {}
    for (var element of snapshot) {
        var parent = Path.parse(element.path).parent()
        if (parent) parentElements[parent.value()] = true
    }

    const rows: (ElementDefinition | SnapshotSeparator)[] = ElementTree.from(snapshot).cata((element, childrenSets) => {
        // TODO: keep elements in differential even when collapsed
        if (Path.parse(element.path).parent() && !isOpen(element.path)) return [element]

        const inDifferential: (ElementDefinition | SnapshotSeparator)[] = []
        var inSnapshot: (ElementDefinition | SnapshotSeparator)[] = []

        for (var children of childrenSets) {
            const pushTo = children.some(child => child.id! in diffById) ? inDifferential : inSnapshot
            for (var child of children) pushTo.push(child)
        }

        if (inSnapshot.length > 0) {
            inDifferential.push({ isSnapshotSeparator: true, id: `${element.path}.$separator`, path: `${element.path}.$separator` })
        }

        if (!isBaseOpen(`${element.path}.$separator`)) {
            inSnapshot = []
        }

        return [element].concat(inDifferential).concat(inSnapshot)
    })

    const indents: { [path: string]: boolean[] } = {}
    const nextIndents: { [path: string]: boolean[] } = {}
    var indent: boolean[] = []
    for (var row of rows.toReversed()) {
        nextIndents[row.path] = [...indent.slice(1)];
        const level = (row.path.match(/\./g) || []).length;
        while (indent.length < level) indent.push(false);
        while (indent.length > level) indent.pop();
        indent[level] = true;
        indents[row.path] = [...indent.slice(1)];
    }

    function updateElement(newElement: ElementDefinition) {
        diffById[newElement.id!] = newElement
        onChange(Object.values(diffById))
    }

    return <>
        {
            rows.map(row => {
                const indent = indents[row.path]
                const nextIndent = nextIndents[row.path]
                if (row.hasOwnProperty("isSnapshotSeparator")) {
                    return <ExpandableRow
                        key={row.id}
                        name="Base"
                        isOpen={isBaseOpen(row.path)}
                        setOpen={value => setOpenBase(row.path, value)}
                        hasChildren={true}
                        indent={indent}
                        nextIndent={nextIndent}
                    />
                } else {
                    const element: ElementDefinition = row
                    return <ElementDefinitionEditor
                        key={element.id}
                        url={url}
                        base={element}
                        diff={diffById[element.id!]}
                        isOpen={parentElements[element.path] || (element.type?.length || 0) > 1 ? isOpen(element.path) : undefined}
                        onChange={updateElement}
                        setOpen={value => setOpen(element.path, value)}
                        indent={indent}
                        nextIndent={nextIndent}
                    />
                }
            }
            )
        }
    </>
}