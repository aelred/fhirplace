import { ElementTree } from "ElementTree"
import { StructureDefinition, ValueSet } from "fhir/r5"
import { CSSProperties, ReactElement, useState } from "react"
import { JsonView } from "react-json-view-lite"
import 'react-json-view-lite/dist/index.css'
import { AllResourceTypes, STRUCTURE_DEFINITIONS } from "../fhir"
import ElementTreeEditor from "./ElementTreeEditor"

export default function StructureDefinitionEditor() {
    const [name, setName] = useState<string>("MyProfile")
    const [type, setType] = useState<string>("Observation")
    const [diff, setDiff] = useState<ElementTree | undefined>(undefined)

    const baseDefinition = STRUCTURE_DEFINITIONS[type]

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
                element: [...diff?.elementDefinitions() || []]
            },
        }
    }

    const base = ElementTree.from(baseDefinition.snapshot?.element || [])

    const tableStyle: CSSProperties = {
        border: "0px #F0F0F0 solid", fontSize: "11px", fontFamily: "verdana", verticalAlign: "top"
    }

    const rowStyle: CSSProperties = {
        border: "1px #F0F0F0 solid", fontSize: "11px", fontFamily: "verdana", verticalAlign: "top"
    }

    const headerStyle: CSSProperties = {
        verticalAlign: "top", textAlign: "left", backgroundColor: "white", border: "0px #F0F0F0 solid", padding: "0px 4px 0px 4px"
    }

    return <form>
        <h1><input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="subtle" /></h1>
        <select value={type} onChange={e => setType(e.target.value)}>
            {[...getCodeOptions(AllResourceTypes)]}
        </select>
        <table border={0} cellPadding={0} cellSpacing={0} style={tableStyle}>
            <tbody>
                <tr style={rowStyle}>
                    <th style={headerStyle} className="hierarchy">Name</th>
                    <th style={headerStyle} className="hierarchy">Flags</th>
                    <th style={headerStyle} className="hierarchy">Card.</th>
                    <th style={headerStyle} className="hierarchy">Type</th>
                    <th style={headerStyle} className="hierarchy">Description & Constraints</th>
                </tr>
                <ElementTreeEditor base={base} diff={diff} onChange={setDiff} url={baseDefinition.url} alwaysOpen indent={[]} isLastChild={true} />
            </tbody>
        </table>
        <JsonView data={showFhir()} />
        <button onClick={(e) => {
            e.preventDefault()
            navigator.clipboard.writeText(JSON.stringify(showFhir(), null, 2))
        }
        }>Copy to clipboard</button>
    </form >
}

function* getCodeOptions(valueSet: ValueSet): Generator<ReactElement> {
    for (var include of valueSet.compose?.include || []) {
        for (var concept of include.concept || []) {
            yield <option key={concept.code} value={concept.code} label={concept.code} />
        }
    }
}