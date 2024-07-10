import { Path } from "fhir"
import { ElementDefinition } from "fhir/r5"

export class ElementTree {
    constructor(
        public readonly element: ElementDefinition | undefined,
        public readonly children: ReadonlyMap<string, ElementTree>
    ) { }

    static empty(): ElementTree {
        return new ElementTree(undefined, new Map())
    }

    static from(elements: ElementDefinition[]): ElementTree {
        const root = new ElementTree(elements[0], new Map())
        const treesByPath = { [elements[0].path]: root }

        for (var element of elements.slice(1)) {
            const path = Path.parse(element.path)
            const parent = path.parent()!.value()
            const tree = new ElementTree(element, new Map())
            treesByPath[path.value()] = tree;
            (treesByPath[parent].children as Map<string, ElementTree>).set(path.field(), tree)
        }

        return root
    }

    *trees(): Generator<ElementTree> {
        yield this
        for (var child of this.children.values()) {
            yield* child.trees()
        }
    }

    *elementDefinitions(): Generator<ElementDefinition> {
        for (var tree of this.trees()) {
            if (tree.element) {
                yield tree.element
            }
        }
    }

    cata<T>(f: (element: ElementDefinition | undefined, children: Map<string, T>) => T): T {
        const newChildren = new Map()
        for (var [field, child] of this.children) {
            newChildren.set(field, child.cata(f))
        }
        return f(this.element, newChildren)
    }

    map(f: (element: ElementDefinition | undefined) => ElementDefinition | undefined): ElementTree {
        return this.cata((ed, children) => new ElementTree(f(ed), children))
    }

    setChild(field: string, tree: ElementTree): ElementTree {
        const newChildren = new Map(this.children)
        newChildren.set(field, tree)
        return new ElementTree(this.element, newChildren)
    }

    setElementDefinition(elementDefinition: ElementDefinition): ElementTree {
        return new ElementTree(elementDefinition, this.children)
    }
}