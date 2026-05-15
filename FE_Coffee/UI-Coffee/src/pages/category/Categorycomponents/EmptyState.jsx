import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const EmptyState = ({ icon, title, subtitle }) => (
    <div className="flex flex-col items-center justify-center py-20">
        {typeof icon === 'string' ? (
            <div className="text-6xl mb-4">{icon}</div>
        ) : (
            <FontAwesomeIcon icon={icon} className="text-6xl text-slate-300 mb-4" />
        )}
        <p className="text-slate-600 font-bold text-lg mb-2">{title}</p>
        {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
    </div>
);