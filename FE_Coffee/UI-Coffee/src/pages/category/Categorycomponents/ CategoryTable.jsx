import {CategoryRow} from "./CategoryRow.jsx";

export const CategoryTable = ({ categories, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
            <thead>
            <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-widest font-bold">
                <th className="py-5 px-6 text-center w-32">Hình ảnh</th>
                <th className="py-5 px-6 text-left border-x border-slate-200">
                    Tên Danh mục
                </th>
                <th className="py-5 px-6 text-center w-40">Thao tác</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
                <CategoryRow
                    key={cat.category_id}
                    category={cat}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
            </tbody>
        </table>
    </div>
);