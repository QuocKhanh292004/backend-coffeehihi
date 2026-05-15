import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

const LogoutButton = ({handleLogout}) => {
    // const { logout } = useAuth();
    // const navigate = useNavigate();
    //
    // const handleLogout = () => {
    //     logout();              //  xoá token + user
    //     navigate('/login');
    // };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-rose-100 text-rose-500
            shadow-sm hover:bg-rose-50 hover:shadow-md active:scale-95 transition-all duration-200 group"
        >
            <div
                className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center
                group-hover:bg-rose-500 group-hover:text-white transition-colors duration-200">
                <FontAwesomeIcon icon={faSignOutAlt} />
            </div>
            <span className="font-bold text-sm">Đăng xuất</span>
        </button>
    );
};

export default LogoutButton;
