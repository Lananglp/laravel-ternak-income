import { Link } from "@inertiajs/react";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import qs from "qs";

type Meta = {
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

export function AppPagination({ item, query }: { item: Meta, query?: Record<string, any>; }) {
    const { current_page, last_page } = item;

    const getPages = () => {
        const pages: (number | '...')[] = [];

        if (last_page <= 5) {
            for (let i = 1; i <= last_page; i++) pages.push(i);
        } else {
            if (current_page <= 3) {
                pages.push(1, 2, 3, 4, '...', last_page);
            } else if (current_page >= last_page - 2) {
                pages.push(1, '...', last_page - 3, last_page - 2, last_page - 1, last_page);
            } else {
                pages.push(1, '...', current_page - 1, current_page, current_page + 1, '...', last_page);
            }
        }

        return pages;
    };

    const buildLink = (page: number) => {
        return `?${qs.stringify({ ...query, page })}`;
    };

    const baseClass = "px-3 py-1.5 text-sm rounded-md transition-colors duration-200";
    const activeClass = "bg-neutral-700 border border-neutral-700 text-white";
    const inactiveClass = "bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300";

    return (
        <div className="flex flex-wrap gap-2 justify-center mt-6">
            {/* Previous Button */}
            {item.prev_page_url && (
                <Link
                    href={buildLink(current_page - 1)}
                    preserveScroll
                    className={`${baseClass} ${inactiveClass}`}
                >
                    <MoveLeftIcon className="inline h-4 w-4 me-1" /> Prev
                </Link>
            )}

            {/* Numbered Pages */}
            {getPages().map((page, index) =>
                page === '...' ? (
                    <span
                        key={index}
                        className={`${baseClass} bg-transparent text-neutral-500 cursor-default`}
                    >
                        ...
                    </span>
                ) : (
                    <Link
                        key={index}
                        href={buildLink(page)}
                        preserveScroll
                        className={`${baseClass} ${page === current_page ? activeClass : inactiveClass}`}
                    >
                        {page}
                    </Link>
                )
            )}

            {/* Next Button */}
            {item.next_page_url && (
                <Link
                    href={buildLink(current_page + 1)}
                    preserveScroll
                    className={`${baseClass} ${inactiveClass}`}
                >
                    Next <MoveRightIcon className="inline h-4 w-4 ms-1" />
                </Link>
            )}
        </div>
    );
}
