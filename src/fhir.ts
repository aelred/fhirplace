import { CodeSystem, CodeSystemConcept, StructureDefinition, ValueSet } from "fhir/r5";
import "./util";
import { toMap } from "./util";
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