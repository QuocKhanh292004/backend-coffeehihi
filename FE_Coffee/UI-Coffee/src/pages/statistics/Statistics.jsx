import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faCoffee,
    faUsers,
    faReceipt
} from "@fortawesome/free-solid-svg-icons";

const stats = [
    {
        title: "Doanh thu",
        value: "25.400.000 ₫",
        icon: faMoneyBillWave,
        color: "bg-green-500",
    },
    {
        title: "Đơn hàng",
        value: "124",
        icon: faReceipt,
        color: "bg-blue-500",
    },
    {
        title: "Sản phẩm",
        value: "38",
        icon: faCoffee,
        color: "bg-brown-500",
    },
    {
        title: "Khách hàng",
        value: "86",
        icon: faUsers,
        color: "bg-purple-500",
    },
];

const Statistics = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition"
                >
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${item.color}`}
                    >
                        <FontAwesomeIcon icon={item.icon} />
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">{item.title}</p>
                        <h3 className="text-xl font-semibold">{item.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Statistics;
