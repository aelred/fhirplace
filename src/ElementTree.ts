import { Path } from "fhir";
import { ElementDefinition } from "fhir/r5";

export class ElementTree {
    constructor(public readonly element: ElementDefinition, public readonly children: ElementTree[]) { }

    static from(elements: ElementDefinition[]): ElementTree {
        const root = new ElementTree(elements[0], [])
        const treesByPath = { [elements[0].path]: root }

        for (var element of elements.slice(1)) {
            const path = Path.parse(element.path)
            const parent = path.parent()!.value()
            const tree = new ElementTree(element, [])
            treesByPath[path.value()] = tree
            treesByPath[parent].children.push(tree)
        }

        return root
    }

    *trees(): Generator<ElementTree> {
        yield this
        for (var child of this.children) {
            yield* child.trees()
        }
    }

    cata<T>(f: (element: ElementDefinition, children: T[]) => T): T {
        return f(this.element, this.children.map(child => child.cata(f)))
    }
}