import { format } from "date-fns";

export function formatDocument(number: string, uf: string, type: string) {
    if (type && number && uf) return `${type.toUpperCase()} ${number}-${uf}`;
}

export function formatDate(date: string) {
    return format(new Date(date), "dd/MM/yy");
}