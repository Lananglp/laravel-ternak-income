import { format } from 'date-fns';
import { id, enUS } from 'date-fns/locale';

/**
 * Fungsi untuk menentukan locale berdasarkan kode bahasa
 * @param lang 'id' untuk Bahasa Indonesia, 'en' untuk English
 */
const getLocale = (lang: 'id' | 'en') => {
    switch (lang) {
        case 'en':
            return enUS;
        case 'id':
        default:
            return id;
    }
};

export const formatDateTime = (date: string) => {
    return format(new Date(date), "EEEE, dd MMMM yyyy HH:mm", {
        locale: getLocale('id'),
    });
};

export const formatDate = (date: string) => {
    return format(new Date(date), "EEEE, dd MMMM yyyy", {
        locale: getLocale('id'),
    });
};

export function formatRupiah(value: number): string {
    if (isNaN(value)) return "Rp. 0";
    return "Rp. " + value.toLocaleString("id-ID");
}

export function countdownDays(dateString: string): string {
    const now = new Date();
    const target = new Date(dateString);
    // Hitung selisih dalam milidetik
    const diff = target.getTime() - now.getTime();
    // Konversi ke hari
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} hari lagi`;
    } else if (days === 0) {
        return "Hari ini";
    } else {
        return "Expired";
    }
}

export function formatPaymentType(
    type: string | null,
    store?: string,
    bank?: string
): string {
    if (type === 'cstore') {
        if (store === 'indomaret') return 'Indomaret';
        if (store === 'alfamart') return 'Alfamart';
        return 'Convenience Store';
    }

    if (type === 'bank_transfer') {
        return bank ? `Bank ${bank.toUpperCase()}` : 'Transfer Bank';
    }

    const map: Record<string, string> = {
        credit_card: 'Kartu Kredit',
        gopay: 'GoPay',
        qris: 'QRIS',
        shopeepay: 'ShopeePay',
        dana: 'DANA',
    };

    return type ? map[type] || type : '-';
}

export function formatTransactionStatus(status: string | null): { label: string, color: string } {
    const map: Record<string, { label: string, color: string }> = {
        pending: { label: 'Menunggu Pembayaran', color: 'text-yellow-100' },
        success: { label: 'Berhasil', color: 'text-green-300' },
        capture: { label: 'Berhasil', color: 'text-green-300' },
        // settlement: { label: 'Diselesaikan', color: 'text-green-300' },
        settlement: { label: 'Berhasil', color: 'text-green-300' },
        deny: { label: 'Ditolak', color: 'text-red-300' },
        expire: { label: 'Kedaluwarsa', color: 'text-zinc-300' },
        cancel: { label: 'Dibatalkan', color: 'text-red-300' },
    };
    return status ? map[status] || { label: status, color: 'text-zinc-300' } : { label: '-', color: 'text-zinc-300' };
}

export function formatFraudStatus(status: string | null): { label: string, color: string } {
    const map: Record<string, { label: string, color: string }> = {
        accept: { label: 'Diterima', color: 'text-green-300' },
        deny: { label: 'Ditolak', color: 'text-red-300' },
        challenge: { label: 'Perlu Tinjauan', color: 'text-yellow-100' },
    };
    return status ? map[status] || { label: status, color: 'text-zinc-300' } : { label: '-', color: 'text-zinc-300' };
}

export function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hh = h > 0 ? `${h}:` : '';
    const mm = h > 0 ? String(m).padStart(2, '0') : `${m}`;
    const ss = String(s).padStart(2, '0');

    return `${hh}${mm}:${ss}`;
}

export function formatDurationText(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (hours > 0) parts.push(`${hours} jam`);
    if (minutes > 0) parts.push(`${minutes} menit`);

    return parts.length > 0 ? parts.join(' ') : '0 menit';
}