import React, { useEffect, useState } from 'react';
import { getDashboardStatsService } from "../../apiServices/ordersServices.js";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from "recharts";

const formatCurrency = (amount) =>
    amount != null
        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
        : "—";

const toInputDate = (date) => date.toISOString().split("T")[0];

const CafeDashboard = ({ branchId }) => {
    const today = toInputDate(new Date());

    const [statisticsData, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('7days');

    // Tính start_date theo bộ lọc thời gian
    const getStartDate = () => {
        const d = new Date();
        if (timeFilter === '7days') d.setDate(d.getDate() - 6);
        else if (timeFilter === '30days') d.setDate(d.getDate() - 29);
        else if (timeFilter === 'month') d.setDate(1); // đầu tháng
        return toInputDate(d);
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                ...(branchId ? { branch_id: branchId } : {}),
                start_date: getStartDate(),
                end_date: today,
            };
            const res = await getDashboardStatsService(params);
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
    }, [branchId, timeFilter]); // re-fetch khi đổi bộ lọc

    const chartData =
        revenueData.length > 0
            ? revenueData
            : [{ date: today, revenue: statisticsData?.totalRevenue ?? 0 }];

    // 4 stat cards chính — lấy từ API
    const stats = [
        {
            id: 1,
            title: 'Doanh thu hôm nay',
            value: statisticsData?.totalRevenue != null
                ? new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(statisticsData.totalRevenue)
                : (loading ? '...' : '—'),
            unit: 'VNĐ',
            change: statisticsData?.yearRevenueChange != null
                ? `${statisticsData.yearRevenueChange >= 0 ? '+' : ''}${statisticsData.yearRevenueChange}%`
                : '—',
            icon: 'fa-dollar-sign',
            gradient: 'from-blue-500 to-blue-600',
            bgIcon: 'bg-white/20',
        },
        {
            id: 2,
            title: 'Đơn hàng',
            value: statisticsData?.totalOrders ?? (loading ? '...' : '—'),
            unit: 'Trong kỳ',
            change: statisticsData?.monthRevenueChange != null
                ? `${statisticsData.monthRevenueChange >= 0 ? '+' : ''}${statisticsData.monthRevenueChange}%`
                : '—',
            icon: 'fa-shopping-cart',
            gradient: 'from-purple-500 to-purple-600',
            bgIcon: 'bg-white/20',
        },
        {
            id: 3,
            title: 'Số bàn đã phục vụ',
            value: statisticsData?.totalTables ?? (loading ? '...' : '—'),
            unit: 'Lượt phục vụ',
            change: '—',
            icon: 'fa-users',
            gradient: 'from-green-500 to-green-600',
            bgIcon: 'bg-white/20',
        },
        {
            id: 4,
            title: 'Sản phẩm',
            value: statisticsData?.totalItems ?? (loading ? '...' : '—'),
            unit: 'Loại sản phẩm',
            change: '—',
            icon: 'fa-coffee',
            gradient: 'from-orange-500 to-orange-600',
            bgIcon: 'bg-white/20',
            changeColor: 'bg-yellow-300 text-gray-800',
        },
    ];

    // Quick stats từ API
    const quickStats = [
        {
            label: 'Doanh thu tháng này',
            value: statisticsData?.monthRevenue > 100
                ? new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(statisticsData.monthRevenue) + ' đ'
                : 'Chưa có',
            icon: 'fa-chart-line',
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-500',
        },
        {
            label: 'Doanh thu năm nay',
            value: statisticsData?.yearRevenue != null
                ? new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(statisticsData.yearRevenue) + ' đ'
                : 'Chưa có',
            icon: 'fa-star',
            bg: 'bg-green-50',
            iconBg: 'bg-green-500',
        },
        {
            label: 'Tăng trưởng tháng',
            value: statisticsData?.monthRevenueChange != null
                ? `${statisticsData.monthRevenueChange >= 0 ? '+' : ''}${statisticsData.monthRevenueChange}%`
                : '—',
            icon: 'fa-percentage',
            bg: 'bg-purple-50',
            iconBg: 'bg-purple-500',
        },
        {
            label: 'Tăng trưởng năm',
            value: statisticsData?.yearRevenueChange != null
                ? `${statisticsData.yearRevenueChange >= 0 ? '+' : ''}${statisticsData.yearRevenueChange}%`
                : '—',
            icon: 'fa-clock',
            bg: 'bg-orange-50',
            iconBg: 'bg-orange-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Xin chào, Admin!</h2>
                    <p className="text-gray-600 mt-1">Đây là tổng quan hoạt động quán cafe hôm nay</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                        <div
                            key={stat.id}
                            className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-6 text-white transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`${stat.bgIcon} p-3 rounded-lg`}>
                                    <i className={`fas ${stat.icon} text-2xl`}></i>
                                </div>
                                <span className={`text-xs ${stat.changeColor || 'bg-green-400'} px-2 py-1 rounded-full`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-sm font-medium opacity-90">{stat.title}</h3>
                            <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            <p className="text-xs opacity-75 mt-2">{stat.unit}</p>
                        </div>
                    ))}
                </div>

                {/* Chart + Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                    {/* Revenue Chart — dùng Recharts giống Statistics */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="7days">7 ngày qua</option>
                                <option value="30days">30 ngày qua</option>
                                <option value="month">Tháng này</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                                Đang tải dữ liệu...
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={chartData} margin={{ top: 8, right: 24, left: 16, bottom: 8 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tickFormatter={(v) =>
                                            v === 0 ? "0đ" : `${(v / 1000).toLocaleString("vi-VN")}k`
                                        }
                                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={70}
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
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống kê nhanh</h3>
                        <div className="space-y-4">
                            {quickStats.map((stat, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 ${stat.bg} rounded-lg hover:scale-105 transition-all`}>
                                    <div className="flex items-center space-x-3">
                                        <div className={`${stat.iconBg} p-2 rounded-lg`}>
                                            <i className={`fas ${stat.icon} text-white`}></i>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">{stat.label}</p>
                                            <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders và Top Products giữ nguyên nếu chưa có API */}
                {/* ... */}

            </main>
        </div>
    );
};

export default CafeDashboard;