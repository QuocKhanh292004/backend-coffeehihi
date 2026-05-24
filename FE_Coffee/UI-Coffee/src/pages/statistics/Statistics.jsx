import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faArrowUp,
    faArrowDown,
    faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getDashboardStatsService } from "../../apiServices/ordersServices.js";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

const toInputDate = (date) => date.toISOString().split("T")[0];

const ChangeIndicator = ({ value }) => {
    const isUp = value >= 0;
    return (
        <span className={`inline-flex items-center gap-1 text-sm font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
            <FontAwesomeIcon icon={isUp ? faArrowUp : faArrowDown} className="text-xs" />
            {Math.abs(value)}%
        </span>
    );
};

const Statistics = ({ branchId }) => {
    const today = toInputDate(new Date());

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [statisticsData, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                ...(branchId ? { branch_id: branchId } : {}),
                start_date: startDate,
                end_date: endDate,
            };
            const res = await getDashboardStatsService(params);
            setStats(res.data);
            if (res.data?.revenueChart) {
                setRevenueData(res.data.revenueChart);
            }
        } catch (err) {
            setError("Không thể tải dữ liệu thống kê");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [branchId]);

    const chartData =
        revenueData.length > 0
            ? revenueData
            : [{ date: startDate, revenue: statisticsData?.totalRevenue }];

    const summaryCards = [
        {
            label: "Tổng số sản phẩm",
            value: statisticsData?.totalProducts,
            img: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
            alt: "product",
        },
        {
            label: "Tổng số đơn hàng",
            value: statisticsData?.totalOrders,
            img: "https://cdn-icons-png.flaticon.com/512/1041/1041916.png",
            alt: "orders",
        },
        {
            label: "Tổng số tài khoản",
            value: statisticsData?.totalAccounts,
            img: "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
            alt: "accounts",
        },
    ];

    const revenueCards = [
        { label: "Doanh thu hôm nay", value: statisticsData?.totalRevenue, change: statisticsData?.totalRevenue },
        { label: "Doanh thu tháng này", value: statisticsData?.monthRevenue, change: statisticsData?.monthRevenueChange },
        { label: "Doanh thu năm nay", value: statisticsData?.yearRevenue, change: statisticsData?.yearRevenueChange },
    ];

    console.log("hhh", statisticsData)
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Tiêu đề */}
            <h2 className="text-xl font-bold text-gray-800 mb-5">Thống kê doanh thu</h2>
            {/* Date filter row */}
            <div className="flex items-end gap-4 mb-6">
                {/* Ngày bắt đầu */}
                <div className="relative flex-1">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-400 z-10">
                        Ngày bắt đầu
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2.5 gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                        />
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-sm" />
                    </div>
                </div>

                {/* Ngày kết thúc */}
                <div className="relative flex-1">
                    <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-400 z-10">
                        Ngày kết thúc
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md bg-white px-3 py-2.5 gap-2">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                        />
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-sm" />
                    </div>
                </div>

                {/* Nút tính doanh thu */}
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 text-white text-sm font-semibold px-8 py-3 rounded-md whitespace-nowrap transition-colors cursor-pointer"
                >
                    {loading ? "Đang tải..." : "Tính Doanh Thu"}
                </button>
            </div>

            {/* Lỗi */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-5">
                    {error}
                </div>
            )}

            {/* Row 1: Tổng số sản phẩm / đơn hàng / tài khoản */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {summaryCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <img
                            src={card.img}
                            alt={card.alt}
                            className="w-14 h-14 object-contain shrink-0"
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: Doanh thu hôm nay / tháng này / năm nay */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {revenueCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className="w-11 h-11 rounded-full bg-[#1a2744] flex items-center justify-center shrink-0">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-white text-base" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">{card.label}</p>
                            <h3 className="text-lg font-bold text-gray-800 leading-tight">
                                {formatCurrency(card.value)}
                            </h3>
                            <ChangeIndicator value={card.change} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">Doanh thu</p>
                <ResponsiveContainer width="100%" height={340}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 8, right: 24, left: 16, bottom: 8 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(v) =>
                                v === 0
                                    ? "0 đ"
                                    : `${(v / 1000).toLocaleString("vi-VN")}.000 đ`
                            }
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            width={95}
                        />
                        <Tooltip
                            formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                            contentStyle={{
                                borderRadius: 8,
                                border: "1px solid #e5e7eb",
                                fontSize: 13,
                            }}
                        />
                        <Legend iconType="rect" iconSize={12} wrapperStyle={{ fontSize: 13 }} />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            name="Doanh thu"
                            stroke="#5b8dee"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#5b8dee" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Statistics;