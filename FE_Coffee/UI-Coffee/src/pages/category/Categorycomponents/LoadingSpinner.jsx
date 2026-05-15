export const LoadingSpinner = ({message = 'Đang tải danh mục...'}) => (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"/>
        <p className="text-slate-600 font-bold">{message}</p>
    </div>
);