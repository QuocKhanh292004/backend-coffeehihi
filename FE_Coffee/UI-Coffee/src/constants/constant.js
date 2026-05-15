import { faBan, faCircleCheck, faClock, faFire, faTruckFast } from '@fortawesome/free-solid-svg-icons';

export const STATUS_CONFIG = {
    pending: {
        label: 'Chờ xác nhận',
        icon: faClock,
        color: 'text-yellow-500',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        dot: 'bg-yellow-400',
    },
    confirmed: {
        label: 'Đã xác nhận',
        icon: faTruckFast,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        dot: 'bg-blue-400',
    },
    preparing: {
        label: 'Đang pha chế',
        icon: faFire,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        dot: 'bg-orange-400',
    },
    ready: {
        label: 'Sẵn sàng',
        icon: faTruckFast,
        color: 'text-cyan-500',
        bg: 'bg-cyan-50',
        border: 'border-cyan-200',
        dot: 'bg-cyan-400',
    },
    completed: {
        label: 'Hoàn thành',
        icon: faCircleCheck,
        color: 'text-green-500',
        bg: 'bg-green-50',
        border: 'border-green-200',
        dot: 'bg-green-400',
    },
    cancelled: {
        label: 'Đã huỷ',
        icon: faBan,
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        dot: 'bg-red-400',
    },
};