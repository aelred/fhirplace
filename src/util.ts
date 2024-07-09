export function toMap<T, V>(array: T[], keyFunction: (t: T) => string, valueFunction: (t: T) => V): { [key: string]: V } {
    return array.reduce((a, v) => ({ ...a, [keyFunction(v)]: valueFunction(v) }), {});
}

export function assert(value: boolean) {
    if (!value) {
        throw new Error("Assertion failed")
    }
}

export function capitalize(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function unreachable(_value: never): never {
    throw new Error(`ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(_value)}`);
}