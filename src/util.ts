export function toMap<T, V>(array: T[], keyFunction: (t: T) => string, valueFunction: (t: T) => V): { [key: string]: V } {
    return array.reduce((a, v) => ({ ...a, [keyFunction(v)]: valueFunction(v) }), {});
}

export function assert(value: boolean) {
    if (!value) {
        throw new Error("Assertion failed")
    }
}