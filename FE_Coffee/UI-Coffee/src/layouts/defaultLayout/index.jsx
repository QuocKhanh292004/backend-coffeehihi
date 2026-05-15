import { useEffect, useState } from 'react';
import Menu from '../menu/Menu.jsx';
import Header from '../../components/header/Header.jsx';
import { adminMenu } from '../menu/AdminMenu.js';
import { customerMenu } from '../menu/CustomerMenu.js';

function DefaultLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [role, setRole] = useState(false);
    useEffect(() => {
        localStorage.setItem("role", "admin");
        setRole(localStorage.getItem("role"));
    }, []);
    const menuList = role === "admin" ? adminMenu : customerMenu;
    return (
        <div>
            {/* HEADER */}
            <Header onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />

            {/* MAIN CONTENT */}
            <div className="pt-16 flex">
                {/* SIDEBAR DESKTOP */}
                <div className="hidden lg:block w-[250px] bg-[#F7F3EE] border-r border-[#E5D8C8]">
                    <Menu isOpen={true} menuItems={menuList} />
                </div>

                {/* NỘI DUNG */}
                <main className="flex-1 p-4">
                    {children}
                </main>
            </div>

            {/* MENU MOBILE */}
            <Menu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                menuItems={menuList}
            />
        </div>
    );
}
export default DefaultLayout;
