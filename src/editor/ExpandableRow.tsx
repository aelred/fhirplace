import Row from "./Row"

type Props = {
    name: string
    isOpen: boolean
    setOpen: (open: boolean) => void
    indent: boolean[]
    hasChildren: boolean
    isLastChild: boolean
}

export default function ExpandableRow({ name, isOpen, setOpen, indent, hasChildren, isLastChild }: Props) {
    return <Row
        name={<em>{name}</em>}
        indent={indent}
        hasChildren={hasChildren}
        isLastChild={isLastChild}
        isOpen={isOpen}
        setOpen={setOpen}
    />
}