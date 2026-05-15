import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faSearch } from "@fortawesome/free-solid-svg-icons"; // Phải có cả 2 cái này

export const CategoryFilters = ({
                                    branches = [], // Thêm default value để tránh lỗi .map()
                                    selectedBranch,
                                    searchTerm,
                                    loadingBranches,
                                    onBranchChange,
                                    onSearch
                                }) => (

    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branch Selector */}
            <div>
                <label
                    className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faStore} className="text-emerald-500"/>
                    Chi nhánh
                </label>
                <select
                    value={selectedBranch}
                    onChange={(e) => onBranchChange(e.target.value)}
                    disabled={loadingBranches}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold disabled:opacity-50"
                >
                    <option value="">
                        {loadingBranches ? 'Đang tải...' : 'Chọn chi nhánh'}
                    </option>
                    {branches.map((branch) => (
                        <option key={branch.branch_id} value={branch.branch_id}>
                            Chi nhánh {branch.branch_id} : {branch.branch_name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search */}
            <div>
                <label
                    className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={faSearch} className="text-emerald-500"/>
                    Tìm kiếm
                </label>
                <div className="relative">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tên danh mục..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
                    />
                </div>
            </div>
        </div>
    </div>
);
