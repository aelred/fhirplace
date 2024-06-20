import { ElementDefinition, StructureDefinition, ValueSet } from "fhir/r5";
import { ReactElement, useState } from "react";
import { JsonView } from "react-json-view-lite";
import 'react-json-view-lite/dist/index.css';
import { ElementDefinitionEditor } from "./ElementDefinitionEditor";
import { AllResourceTypes, STRUCTURE_DEFINITIONS } from "./fhir";

export default function StructureDefinitionEditor() {
    const [name, setName] = useState<string>("MyProfile");
    const [type, setType] = useState<string>("Observation");
    const [differentials, setDifferentials] = useState<{ [id: string]: ElementDefinition }>({})

    const baseDefinition = STRUCTURE_DEFINITIONS[type];
    const snapshot = baseDefinition.snapshot?.element || []

    function* orderedDifferentials(): Generator<ElementDefinition> {
        for (var element of snapshot) {
            if (element.id! in differentials) {
                yield differentials[element.id!];
            }
        }
    }

    const indents: { [path: string]: boolean[] } = {}
    const nextIndents: { [path: string]: boolean[] } = {}
    var indent: boolean[] = []
    for (var element of snapshot.toReversed()) {
        nextIndents[element.path] = [...indent.slice(1)];
        const level = (element.path.match(/\./g) || []).length;
        while (indent.length < level) indent.push(false);
        while (indent.length > level) indent.pop();
        indent[level] = true;
        indents[element.path] = [...indent.slice(1)];
    }

    console.log(indents)

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
                    snapshot.map(element => <ElementDefinitionEditor
                        base={element} differential={differentials[element.id!] || { id: element.id, path: element.path }} onChange={updateElement} indent={indents[element.path]} nextIndent={nextIndents[element.path]}
                    />)
                }
            </tbody>
        </table>
        <JsonView data={showFhir()} />
    </form>)
}

function* getCodeOptions(valueSet: ValueSet): Generator<ReactElement> {
    for (var include of valueSet.compose?.include || []) {
        for (var concept of include.concept || []) {
            yield <option value={concept.code} label={concept.code} />
        }
    }
}