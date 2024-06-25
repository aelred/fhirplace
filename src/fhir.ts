import { CodeSystem, CodeSystemConcept, ElementDefinitionType, StructureDefinition, ValueSet } from "fhir/r5";
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

export const CHOICE_TYPES: string[] = [
    "base64Binary",
    "boolean",
    "canonical",
    "code",
    "date",
    "dateTime",
    "decimal",
    "id",
    "instant",
    "integer",
    "integer64",
    "markdown",
    "oid",
    "positiveInt",
    "string",
    "time",
    "unsignedInt",
    "uri",
    "url",
    "uuid",
    "Address",
    "Age",
    "Annotation",
    "Attachment",
    "CodeableConcept",
    "CodeableReference",
    "Coding",
    "ContactPoint",
    "Count",
    "Distance",
    "Duration",
    "HumanName",
    "Identifier",
    "Money",
    "Period",
    "Quantity",
    "Range",
    "Ratio",
    "RatioRange",
    "Reference",
    "SampledData",
    "Signature",
    "Timing",
    "ContactDetail",
    "DataRequirement",
    "Expression",
    "ParameterDefinition",
    "RelatedArtifact",
    "TriggerDefinition",
    "UsageContext",
    "Availability",
    "ExtendedContactDetail",
]

export function getTypeCode(type: ElementDefinitionType): string {
    const extensions = type.extension || [];
    const typeExtension = extensions.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type")?.valueUrl
    return typeExtension || type.code
}


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