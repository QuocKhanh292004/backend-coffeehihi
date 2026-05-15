import { useState } from "react";

export default function usePagination(data, itemsPerPage = 5) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const firstIndex = (currentPage - 1) * itemsPerPage;
    const currentData = data.slice(firstIndex, firstIndex + itemsPerPage);

    return {
        currentPage,
        totalPages,
        totalItems,
        startItem: firstIndex + 1,
        endItem: Math.min(firstIndex + itemsPerPage, totalItems),
        currentData,
        goToPage: setCurrentPage,
    };
}
