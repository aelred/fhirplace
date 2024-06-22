import { CodeSystem, CodeSystemConcept, StructureDefinition, ValueSet } from "fhir/r5";
import "./util";
import { assert, toMap } from "./util";
export const FhirTypes: CodeSystem = require("hl7.fhir.r5.core/CodeSystem-fhir-types.json")
export const AllResourceTypes: ValueSet = require("hl7.fhir.r5.core/ValueSet-all-resource-types.json")

function* getCodes(concept: CodeSystem | CodeSystemConcept): Generator<string> {
    if (concept.concept) {
        for (var inner of concept.concept) {
            yield* getCodesFromConcept(inner);
        }
    }
}

function* getCodesFromConcept(concept: CodeSystemConcept): Generator<string> {
    yield concept.code;
    yield* getCodes(concept);
}

export const TYPES: string[] = [...getCodes(FhirTypes)];

export const STRUCTURE_DEFINITIONS: { [index: string]: StructureDefinition } =
    toMap(TYPES, type => type, type => require(`hl7.fhir.r5.core/StructureDefinition-${type}.json`))


export class Path {
    constructor(public readonly elements: string[]) {
        assert(elements.length > 0)
    }

    static parse(value: string): Path {
        return new Path(value.split("."))
    }

    parent(): Path | undefined {
        const parentElements = this.elements.slice(0, -1);
        if (parentElements.length > 0) {
            return new Path(parentElements);
        }
    }

    *ancestors(): Generator<Path> {
        var ancestor = this.parent();
        while (ancestor !== undefined) {
            yield ancestor;
            ancestor = ancestor.parent();
        }
    }

    value(): string {
        return this.elements.join(".")
    }
}