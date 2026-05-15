import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronUp,
    faChevronDown,
    faPlus,
    faEllipsis,
    faChevronRight,
    faCircleDot
} from "@fortawesome/free-solid-svg-icons";
import images from "../../assets/images";
import LogoutButton from "../../components/logout/Logout.jsx";
import { useAuth } from '../../context/AuthContext.jsx';
function Menu({ menuItems = [], activePath, isOpen, onClose }) {
    const location = useLocation();
    const currentPath = activePath || location.pathname;
    const user = JSON.parse(localStorage.getItem('user'));

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <div
                className={`fixed top-0 inset-0 bg-black/10 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300
                    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
                onClick={onClose}
            />
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[260px] 
                    bg-[#FDFDFD] border-r border-gray-100 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* 1. Header: Logo & Brand */}
                <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={images.logo} className="w-15 h-15 bg-gradient-to-tr rounded-full flex-shrink-0" alt=""/>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900 leading-tight">Coffee</h1>
                            <p className="text-[10px] text-gray-400"> Cảm hứng cho cuộc sống</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faCircleDot} className="text-[10px] opacity-40" />
                    </button>
                </div>

                {/* 2. User Selector Profile */}
                <div className="px-4 mb-4">
                    <button className="w-full flex items-center justify-between p-2 bg-gray-50/80 border border-gray-100 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <img
                                src="https://ui-avatars.com/api/?name=W"
                                className="w-6 h-6 rounded-md object-cover"
                                alt="avatar"
                            />
                            <span className="text-[13px] font-medium text-gray-800 truncate">{user.email}</span>
                        </div>
                        <div className="flex flex-col text-[8px] text-gray-400">
                            <FontAwesomeIcon icon={faChevronUp} className="mb-[-2px]" />
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </button>
                </div>

                {/* 3. Main Navigation */}
                <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = currentPath === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`group flex items-center rounded-lg px-3 py-2 text-[14px] transition-all mb-[20px]
                                    ${isActive
                                    ? "bg-gray-100/80 text-gray-900 font-bold relative after:content-[''] after:absolute after:left-[-12px] after:w-1 after:h-5 after:bg-indigo-600 after:rounded-r-full"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    className={`w-4 h-4 mr-3 ${isActive ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600"}`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}

                    {/* Section: Favorites */}
                    <div className="mt-6">
                        {/*<div className="flex items-center justify-between px-3 mb-2">*/}
                        {/*    <div className="flex items-center gap-2 text-gray-400">*/}
                        {/*        <FontAwesomeIcon icon={faChevronUp} className="text-[10px]" />*/}
                        {/*        <span className="text-[11px] font-bold uppercase tracking-wider">Favorites</span>*/}
                        {/*    </div>*/}
                        {/*    <div className="flex gap-2 text-gray-400">*/}
                        {/*        <FontAwesomeIcon icon={faEllipsis} className="text-[10px] cursor-pointer hover:text-gray-600" />*/}
                        {/*        <FontAwesomeIcon icon={faPlus} className="text-[10px] cursor-pointer hover:text-gray-600" />*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/* Ví dụ Items con */}
                        {/*<div className="space-y-1">*/}
                        {/*    <SubMenuItem icon="" name="Companies" count="1222" />*/}
                        {/*    <SubMenuItem icon="" name="Contacts" count="898" />*/}
                        {/*    <SubMenuItem icon="" name="Meetings" count="32" />*/}
                        {/*</div>*/}
                    </div>
                </nav>

                {/* 4. Bottom Section: Storage & Settings */}
                <div className="p-4 border-t border-gray-50">
                    {/* Storage Card */}
                    {/*<div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm mb-4">*/}
                    {/*    <div className="flex justify-between text-[11px] mb-2">*/}
                    {/*        <span className="font-bold text-gray-800">Cloud Storage</span>*/}
                    {/*        <span className="text-gray-400">90%</span>*/}
                    {/*    </div>*/}
                    {/*    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden flex gap-[2px]">*/}
                    {/*        /!* Thanh vạch cam giả lập *!/*/}
                    {/*        {[...Array(20)].map((_, i) => (*/}
                    {/*            <div key={i} className={`h-full w-1 rounded-full ${i < 18 ? 'bg-orange-400' : 'bg-gray-200'}`} />*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*    <button className="w-full mt-3 py-2 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between px-3 group hover:bg-white hover:shadow-sm transition">*/}
                    {/*        <span className="text-[10px] font-bold text-gray-700">*/}
                    {/*            Upgrade Storage <span className="text-gray-400 font-normal">(up to 25GB)</span>*/}
                    {/*        </span>*/}
                    {/*        <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[8px] group-hover:bg-black group-hover:text-white transition">*/}
                    {/*            <FontAwesomeIcon icon={faChevronRight} />*/}
                    {/*        </div>*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {/* Bottom Links */}
                    <div className="space-y-1">
                        <Link to="/settings" className="flex items-center justify-between px-3 py-2 text-[12px] text-gray-500 hover:text-gray-900 transition">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faCircleDot} className="text-[10px] opacity-30" />
                                Settings
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-30" />
                        </Link>
                        <Link to="/help" className="flex items-center justify-between px-3 py-2 text-[12px] text-gray-500 hover:text-gray-900 transition">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faCircleDot} className="text-[10px] opacity-30" />
                                Help Center
                            </div>
                            <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-30" />
                        </Link>
                    </div>
                    <div>
                         <LogoutButton handleLogout={handleLogout} />
                    </div>
                </div>
            </aside>
        </>
    );
}

function SubMenuItem({ icon, name, count }) {
    return (
        <button className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] text-gray-500 hover:bg-gray-50 rounded-lg transition">
            <div className="flex items-center gap-3">
                <span className="w-4 text-center">{icon}</span>
                <span className="font-medium">{name}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold">{count}</span>
        </button>
    );
}

export default Menu;