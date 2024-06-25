import { ElementDefinition, StructureDefinition, ValueSet } from "fhir/r5";
import { ReactElement, useState } from "react";
import { JsonView } from "react-json-view-lite";
import 'react-json-view-lite/dist/index.css';
import { AllResourceTypes, Path, STRUCTURE_DEFINITIONS } from "../fhir";
import ElementDefinitionEditor from "./ElementDefinitionEditor";

export default function StructureDefinitionEditor() {
    const [name, setName] = useState<string>("MyProfile");
    const [type, setType] = useState<string>("Observation");
    const [differentials, setDifferentials] = useState<{ [id: string]: ElementDefinition }>({})

    const [openElements, setOpenElements] = useState<{ [id: string]: boolean }>({})

    const baseDefinition = STRUCTURE_DEFINITIONS[type];
    const snapshot = baseDefinition.snapshot?.element || []

    const visibleSnapshot = snapshot.filter(element =>
        [...Path.parse(element.path).ancestors()].every(ancestor => openElements[ancestor.value()] !== false)
    );

    const parentElements: { [path: string]: boolean } = {}
    for (var element of snapshot) {
        var parent = Path.parse(element.path).parent()
        if (parent) parentElements[parent.value()] = true
    }

    function* orderedDifferentials(): Generator<ElementDefinition> {
        for (var element of visibleSnapshot) {
            if (element.id! in differentials) {
                yield differentials[element.id!];
            }
        }
    }

    const indents: { [path: string]: boolean[] } = {}
    const nextIndents: { [path: string]: boolean[] } = {}
    var indent: boolean[] = []
    for (var element of visibleSnapshot.toReversed()) {
        nextIndents[element.path] = [...indent.slice(1)];
        const level = (element.path.match(/\./g) || []).length;
        while (indent.length < level) indent.push(false);
        while (indent.length > level) indent.pop();
        indent[level] = true;
        indents[element.path] = [...indent.slice(1)];
    }

    function showFhir(): StructureDefinition {
        return {
            resourceType: "StructureDefinition",
            abstract: false,
            kind: "resource",
            name: name,
            status: "active",
            derivation: "constraint",
            type: type,
            url: `https://www.example.com/${name}`,
            baseDefinition: baseDefinition.url,
            differential: {
                element: [...orderedDifferentials()]
            },
        };
    }

    function updateElement(newElement: ElementDefinition) {
        const newDifferentials = { ...differentials }
        newDifferentials[newElement.id!] = newElement
        setDifferentials(newDifferentials);
    }

    function setOpen(path: string, isOpen: boolean) {
        setOpenElements({ ...openElements, [path]: isOpen })
    }

    return (<form>
        <h1><input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="subtle" /></h1>
        <select value={type} onChange={e => setType(e.target.value)}>
            {[...getCodeOptions(AllResourceTypes)]}
        </select>
        <table border={0} cellPadding={0} cellSpacing={0} style={{ border: "0px #F0F0F0 solid", fontSize: "11px", fontFamily: "verdana", verticalAlign: "top" }}>
            <tbody>
                <tr style={{ border: "1px #F0F0F0 solid", fontSize: "11px", fontFamily: "verdana", verticalAlign: "top" }}>
                    <th style={{ verticalAlign: "top", textAlign: "left", backgroundColor: "white", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
                        Name
                    </th>
                    <th style={{ verticalAlign: "top", textAlign: "left", backgroundColor: "white", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
                        Flags
                    </th>
                    <th style={{ verticalAlign: "top", textAlign: "left", backgroundColor: "white", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
                        Card.
                    </th>
                    <th style={{ verticalAlign: "top", textAlign: "left", backgroundColor: "white", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
                        Type
                    </th>
                    <th style={{ verticalAlign: "top", textAlign: "left", backgroundColor: "white", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px" }} className="hierarchy">
                        Description & Constraints
                    </th>
                </tr>
                {
                    visibleSnapshot.map(element => <ElementDefinitionEditor
                        url={baseDefinition.url}
                        base={element}
                        diff={differentials[element.id!] || { id: element.id, path: element.path }}
                        isOpen={parentElements[element.path] || (element.type?.length || 0) > 1 ? openElements[element.path] !== false : undefined}
                        onChange={updateElement}
                        setOpen={value => setOpen(element.path, value)}
                        indent={indents[element.path]}
                        nextIndent={nextIndents[element.path]}
                    />)
                }
            </tbody>
        </table>
        <JsonView data={showFhir()} />
        <button onClick={(e) => {
            e.preventDefault()
            navigator.clipboard.writeText(JSON.stringify(showFhir(), null, 2))
        }
        }>Copy to clipboard</button>
    </form>)
}

function* getCodeOptions(valueSet: ValueSet): Generator<ReactElement> {
    for (var include of valueSet.compose?.include || []) {
        for (var concept of include.concept || []) {
            yield <option value={concept.code} label={concept.code} />
        }
    }
}