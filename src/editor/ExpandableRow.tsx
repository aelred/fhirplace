import Row from "./Row";

type Props = {
    name: string
    isOpen: boolean
    setOpen: (open: boolean) => void;
    hasChildren: boolean
    indent: boolean[]
    nextIndent: boolean[]
}

export default function ExpandableRow({ name, isOpen, setOpen, hasChildren, indent, nextIndent }: Props) {
    return <Row
        name={<em>{name}</em>}
        indent={indent}
        nextIndent={isOpen && hasChildren ? indent : nextIndent}
        isOpen={isOpen}
        setOpen={setOpen}
    />
}