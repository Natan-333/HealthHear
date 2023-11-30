import { format } from "date-fns";

export function formatDocument(number: string, uf: string, type: string) {
    return `${type.toUpperCase()} ${number}-${uf}`;
}

export function formatDate(date: string) {
    return format(new Date(date), "dd/MM/yy");
}