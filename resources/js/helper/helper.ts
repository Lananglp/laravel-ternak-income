import moment from "moment";

export const formatDateTime = (date: string) => {
    return moment(date).locale('en').format('dddd, DD MMMM YYYY HH:mm');
}

export const formatDate = (date: string) => {
    return moment(date).locale('en').format('dddd, DD MMMM YYYY');
}

export function formatRupiah(value: number): string {
    if (isNaN(value)) return "Rp. 0";
    return "Rp. " + value.toLocaleString("id-ID");
}