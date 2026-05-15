import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
export const Pagination = ({
  currentPage, totalPages, totalItems, startItem, endItem, itemsPerPage, onPageChange, onItemsPerPageChange
}) => {
    const PaginationButton = ({onClick, disabled, icon, children}) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={
                children
                    ? `w-9 h-9 flex items-center justify-center rounded-lg font-bold transition-all ${
                        currentPage === children
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                            : 'text-slate-500 hover:bg-slate-100 hidden sm:flex'
                    }`
                    : 'p-2 disabled:opacity-30 hover:text-emerald-600 text-slate-600 transition-colors'
            }
        >
            {icon ? <FontAwesomeIcon icon={icon}/> : children}
        </button>
    );

    return (
        <div
            className="px-6 py-5 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <span>Số dòng:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-700 cursor-pointer hover:border-emerald-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                >
                    {[5, 10, 20].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">
                    {startItem}-{endItem} của {totalItems}
                </span>
                <div className="flex items-center gap-1">
                    <PaginationButton
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        icon={faAngleDoubleLeft}
                    />
                    <PaginationButton
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        icon={faAngleLeft}
                    />

                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationButton
                                key={i + 1}
                                onClick={() => onPageChange(i + 1)}
                            >
                                {i + 1}
                            </PaginationButton>
                        ))}
                        <span className="sm:hidden text-emerald-600 px-2 flex items-center">
                            Trang {currentPage}
                        </span>
                    </div>

                    <PaginationButton
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        icon={faAngleRight}
                    />
                    <PaginationButton
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        icon={faAngleDoubleRight}
                    />
                </div>
            </div>
        </div>
    );
};