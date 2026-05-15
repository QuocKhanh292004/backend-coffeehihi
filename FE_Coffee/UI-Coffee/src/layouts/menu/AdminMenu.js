import {
    faHome,
    faClipboardList,
    faBoxes,
    faCoffee,
    faMapMarkerAlt,
    faUtensils,
    faUser,
    faChartBar,
} from '@fortawesome/free-solid-svg-icons';
export const adminMenu = [
    { name: 'Tổng quan', icon: faHome, path: '/home' },
    { name: 'Đơn hàng', icon: faClipboardList, path: '/order' },
    { name: 'Danh mục ', icon: faCoffee, path: '/category' },
    { name: 'Đồ uống', icon: faBoxes, path: '/beverage' },
    { name: 'Chi nhánh ', icon: faUtensils, path: '/branch' },
    { name: 'Bàn phục vụ', icon: faMapMarkerAlt, path: '/table' },
    { name: 'Tài khoản ', icon: faUser, path: '/account' },
    { name: 'Thống kê', icon: faChartBar, path: '/statistics' },
];
