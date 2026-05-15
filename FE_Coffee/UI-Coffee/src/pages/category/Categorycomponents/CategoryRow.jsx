import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export const CategoryRow = ({ category, onEdit, onDelete }) => {

    if (!category) return null;

    const handleDelete = () => {
        if (window.confirm(`Xóa danh mục "${category.category_name}"?`)) {
            onDelete(category.category_id);
        }
    };

    return (
        <tr className="hover:bg-emerald-50/50 transition-colors">
            <td className="py-4 px-6">
                <div className="flex justify-center">
                    <img
                        src={category.category_image || 'https://via.placeholder.com/50'}
                        alt={category.category_name}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200 shadow-sm"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/50';
                        }}
                    />
                </div>
            </td>
            <td className="py-4 px-6 border-x border-slate-100">
                <span className="text-slate-700 font-bold text-base">
                    {category.category_name}
                </span>
            </td>
            <td className="py-4 px-6">
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => onEdit(category)}
                        className="w-10 h-10 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa ${category.category_name}`}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                        title="Xóa"
                        aria-label={`Xóa ${category.category_name}`}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </div>
            </td>
        </tr>
    );
};