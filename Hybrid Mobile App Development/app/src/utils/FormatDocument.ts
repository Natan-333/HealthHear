export function formatDocument(number: string, uf: string, type: string) {
    return `${type.toUpperCase()} ${number}-${uf}`;
}