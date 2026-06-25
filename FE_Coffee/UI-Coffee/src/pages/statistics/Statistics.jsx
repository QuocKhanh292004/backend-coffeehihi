import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBillWave,
    faArrowUp,
    faArrowDown,
    faCalendarAlt,
    faShoppingBag,
    faClipboardList,
    faChair,
    faCubesStacked,
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
    amount != null
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
        : "—";

const toInputDate = (date) => date.toISOString().split("T")[0];

const ChangeIndicator = ({ value }) => {
    if (value == null) return null;
    const isUp = value >= 0;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>
            <FontAwesomeIcon icon={isUp ? faArrowUp : faArrowDown} className="text-[10px]" />
            {Math.abs(value)}%
        </span>
    );
};

const Statistics = ({ branchId }) => {
    const today = toInputDate(new Date());

    const [startDate, setStartDate]   = useState(today);
    const [endDate, setEndDate]       = useState(today);
    const [statisticsData, setStats]  = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);

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
            // ✅ axios bọc thêm 1 lớp data
            const data = res?.data?.data ?? res?.data ?? null;
            setStats(data);
            if (data?.revenueChart) setRevenueData(data.revenueChart);
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
            : [{ date: startDate, revenue: statisticsData?.totalRevenue ?? 0 }];

    // ✅ Dùng đúng field backend trả về
    const summaryCards = [
        {
            label: "Tổng loại sản phẩm",
            value: statisticsData?.totalItems ?? "—",
            icon: faCubesStacked,
            color: "bg-violet-100 text-violet-600",
        },
        {
            label: "Tổng đơn hàng",
            value: statisticsData?.totalOrders ?? "—",
            icon: faClipboardList,
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Số bàn đã phục vụ",
            value: statisticsData?.totalTables ?? "—",
            icon: faChair,
            color: "bg-amber-100 text-amber-600",
        },
    ];

    const revenueCards = [
        {
            label: "Tổng doanh thu",
            value: statisticsData?.totalRevenue,
            change: null,
        },
        {
            label: "Doanh thu tháng này",
            // ✅ monthRevenue hiện là placeholder = 12, hiển thị nếu > 0
            value: statisticsData?.monthRevenue > 100 ? statisticsData?.monthRevenue : null,
            change: statisticsData?.monthRevenueChange ?? null,
        },
        {
            label: "Doanh thu năm nay",
            value: statisticsData?.yearRevenue ?? null,
            change: statisticsData?.yearRevenueChange ?? null,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Thống kê doanh thu</h2>

            {/* Date filter */}
            <div className="flex items-end gap-4 mb-6">
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

                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="bg-[#1a2744] hover:bg-[#243460] disabled:opacity-60 text-white text-sm font-semibold px-8 py-3 rounded-md whitespace-nowrap transition-colors cursor-pointer"
                >
                    {loading ? "Đang tải..." : "Tính Doanh Thu"}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-5">
                    {error}
                </div>
            )}

            {/* Row 1: Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {summaryCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                            <FontAwesomeIcon icon={card.icon} className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: Revenue cards */}
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
                                {card.value != null ? formatCurrency(card.value) : (
                                    <span className="text-sm text-gray-400 font-normal italic">Chưa có dữ liệu</span>
                                )}
                            </h3>
                            <ChangeIndicator value={card.change} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <p className="text-sm font-semibold text-gray-700 mb-4">Biểu đồ doanh thu</p>
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
                                v === 0 ? "0 đ" : `${(v / 1000).toLocaleString("vi-VN")}.000 đ`
                            }
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                            width={95}
                        />
                        <Tooltip
                            formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                            contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
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