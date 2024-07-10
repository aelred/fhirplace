import { CodeSystem, CodeSystemConcept, ElementDefinition, ElementDefinitionType, StructureDefinition, ValueSet } from "fhir/r5"
import "./util"
import { assert, capitalize, toMap } from "./util"
export const FhirTypes: CodeSystem = require("hl7.fhir.r5.core/CodeSystem-fhir-types.json")
export const AllResourceTypes: ValueSet = require("hl7.fhir.r5.core/ValueSet-all-resource-types.json")

function* getCodes(concept: CodeSystem | CodeSystemConcept): Generator<string> {
    if (concept.concept) {
        for (var inner of concept.concept) {
            yield* getCodesFromConcept(inner)
        }
    }
}

function* getCodesFromConcept(concept: CodeSystemConcept): Generator<string> {
    yield concept.code
    yield* getCodes(concept)
}

export const TYPES: string[] = [...getCodes(FhirTypes)]

export const STRUCTURE_DEFINITIONS: { [index: string]: StructureDefinition } =
    toMap(TYPES, type => type, type => require(`hl7.fhir.r5.core/StructureDefinition-${type}.json`))

export enum ChoiceType {
    // base64Binary = "base64Binary",
    // boolean = "boolean",
    // canonical = "canonical",
    code = "code",
    date = "date",
    dateTime = "dateTime",
    // decimal = "decimal",
    // id = "id",
    // instant = "instant",
    // integer = "integer",
    // integer64 = "integer64",
    markdown = "markdown",
    // oid = "oid",
    // positiveInt = "positiveInt",
    string = "string",
    time = "time",
    // unsignedInt = "unsignedInt",
    uri = "uri",
    url = "url",
    // uuid = "uuid",
    // Address = "Address",
    // Age = "Age",
    // Annotation = "Annotation",
    // Attachment = "Attachment",
    // CodeableConcept = "CodeableConcept",
    // CodeableReference = "CodeableReference",
    // Coding = "Coding",
    // ContactPoint = "ContactPoint",
    // Count = "Count",
    // Distance = "Distance",
    // Duration = "Duration",
    // HumanName = "HumanName",
    // Identifier = "Identifier",
    // Money = "Money",
    // Period = "Period",
    // Quantity = "Quantity",
    // Range = "Range",
    // Ratio = "Ratio",
    // RatioRange = "RatioRange",
    // Reference = "Reference",
    // SampledData = "SampledData",
    // Signature = "Signature",
    // Timing = "Timing",
    // ContactDetail = "ContactDetail",
    // DataRequirement = "DataRequirement",
    // Expression = "Expression",
    // ParameterDefinition = "ParameterDefinition",
    // RelatedArtifact = "RelatedArtifact",
    // TriggerDefinition = "TriggerDefinition",
    // UsageContext = "UsageContext",
    // Availability = "Availability",
    // ExtendedContactDetail = "ExtendedContactDetail",
}

export const CHOICE_TYPES: ChoiceType[] = Object.values(ChoiceType)

export function getTypeCode(type: ElementDefinitionType): string {
    const extensions = type.extension || []
    const typeExtension = extensions.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/structuredefinition-fhir-type")?.valueUrl
    return typeExtension || type.code
}

export function getFixedValue(elementDefinition: ElementDefinition): any | undefined {
    for (var choiceType of CHOICE_TYPES) {
        const fieldName = `fixed${capitalize(choiceType)}`
        if (fieldName in elementDefinition) return (elementDefinition as any)[fieldName]
    }
}

export function shortProfileName(profile: string): string {
    return profile.replace(/^http:\/\/hl7\.org\/fhir\/StructureDefinition\//, "")
}



export class Path {
    constructor(public readonly elements: string[]) {
        assert(elements.length > 0)
    }

    static parse(value: string): Path {
        return new Path(value.split("."))
    }

    field(): string {
        return this.elements.at(-1)!
    }

    slice(start?: number | undefined, end?: number | undefined): Path | undefined {
        const slice = this.elements.slice(start, end)
        if (slice.length > 0) return new Path(slice)
    }

    parent(): Path | undefined {
        const parentElements = this.elements.slice(0, -1)
        if (parentElements.length > 0) {
            return new Path(parentElements)
        }
    }

    isAncestorOf(path: Path): boolean {
        return path.elements.length > this.elements.length &&
            path.elements === this.elements.slice(path.elements.length)
    }

    *ancestors(): Generator<Path> {
        var ancestor = this.parent()
        while (ancestor !== undefined) {
            yield ancestor
            ancestor = ancestor.parent()
        }
    }

    value(): string {
        return this.elements.join(".")
    }
}