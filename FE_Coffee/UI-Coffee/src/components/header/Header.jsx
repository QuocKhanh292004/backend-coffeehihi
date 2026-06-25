import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import Notification from '../notification/index.js';

function Header({ onToggleMenu }) {
    return (
        <header className="w-full bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
            {/* Cụm bên trái */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleMenu}
                    className="lg:hidden text-slate-800 hover:text-indigo-600 transition-colors"
                >
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-indigo-600 flex gap-[2px] items-center">
                        <div className="w-[7px] h-4 bg-indigo-600 rounded-[2px]"></div>
                        <div className="flex flex-col gap-[2px]">
                            <div className="w-[7px] h-[7px] bg-slate-800 rounded-sm"></div>
                            <div className="w-[7px] h-[7px] bg-slate-400 rounded-sm"></div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Cụm bên phải */}
            <div className="flex items-center gap-5">
                {/* Search */}
                <div className="relative group hidden md:block">
                    <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                        <FontAwesomeIcon icon={faSearch} className="text-[14px]" />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 pr-4 py-2 w-64 text-[13px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-400 font-medium"
                    />
                </div>

                <div className="flex items-center gap-3">

                    <Notification />

                    <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
                </div>
            </div>
        </header>
    );
}

export default Header;
