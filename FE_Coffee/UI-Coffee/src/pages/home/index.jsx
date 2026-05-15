import React, { useState } from 'react';

const CafeDashboard = () => {
    const [timeFilter, setTimeFilter] = useState('7days');

    // Sample data
    const stats = [
        {
            id: 1,
            title: 'Doanh thu hôm nay',
            value: '15.5M',
            unit: 'VNĐ',
            change: '+12%',
            icon: 'fa-dollar-sign',
            gradient: 'from-blue-500 to-blue-600',
            bgIcon: 'bg-white/20'
        },
        {
            id: 2,
            title: 'Đơn hàng',
            value: '128',
            unit: 'Hôm nay',
            change: '+8%',
            icon: 'fa-shopping-cart',
            gradient: 'from-purple-500 to-purple-600',
            bgIcon: 'bg-white/20'
        },
        {
            id: 3,
            title: 'Khách hàng',
            value: '342',
            unit: 'Lượt phục vụ',
            change: '+15%',
            icon: 'fa-users',
            gradient: 'from-green-500 to-green-600',
            bgIcon: 'bg-white/20'
        },
        {
            id: 4,
            title: 'Sản phẩm',
            value: '87',
            unit: 'Loại thức uống',
            change: '5 sắp hết',
            icon: 'fa-coffee',
            gradient: 'from-orange-500 to-orange-600',
            bgIcon: 'bg-white/20',
            changeColor: 'bg-yellow-300 text-gray-800'
        }
    ];

    const recentOrders = [
        {
            id: '#ORD-1234',
            table: 'Bàn 5',
            items: 2,
            amount: '285.000đ',
            status: 'completed',
            statusText: 'Hoàn thành',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
        },
        {
            id: '#ORD-1235',
            table: 'Bàn 3',
            items: 4,
            amount: '420.000đ',
            status: 'processing',
            statusText: 'Đang xử lý',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
        },
        {
            id: '#ORD-1236',
            table: 'Bàn 8',
            items: 3,
            amount: '315.000đ',
            status: 'completed',
            statusText: 'Hoàn thành',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
        }
    ];

    const topProducts = [
        {
            id: 1,
            name: 'Cappuccino',
            sold: 156,
            revenue: '4.2M',
            percentage: 85,
            icon: 'fa-mug-hot',
            gradient: 'from-amber-400 to-orange-500',
            barColor: 'bg-amber-500'
        },
        {
            id: 2,
            name: 'Trà sữa trân châu',
            sold: 142,
            revenue: '3.8M',
            percentage: 75,
            icon: 'fa-leaf',
            gradient: 'from-green-400 to-emerald-500',
            barColor: 'bg-green-500'
        },
        {
            id: 3,
            name: 'Sinh tố dâu',
            sold: 128,
            revenue: '3.2M',
            percentage: 65,
            icon: 'fa-ice-cream',
            gradient: 'from-blue-400 to-cyan-500',
            barColor: 'bg-blue-500'
        },
        {
            id: 4,
            name: 'Bánh Tiramisu',
            sold: 95,
            revenue: '2.8M',
            percentage: 55,
            icon: 'fa-cookie-bite',
            gradient: 'from-purple-400 to-pink-500',
            barColor: 'bg-purple-500'
        }
    ];

    const quickStats = [
        { label: 'Tăng trưởng', value: '+18.2%', icon: 'fa-chart-line', bg: 'bg-blue-50', iconBg: 'bg-blue-500' },
        { label: 'Đánh giá TB', value: '4.8/5.0', icon: 'fa-star', bg: 'bg-green-50', iconBg: 'bg-green-500' },
        { label: 'Thời gian TB', value: '12 phút', icon: 'fa-clock', bg: 'bg-purple-50', iconBg: 'bg-purple-500' },
        { label: 'Lợi nhuận', value: '42%', icon: 'fa-percentage', bg: 'bg-orange-50', iconBg: 'bg-orange-500' }
    ];

    const chartData = [
        { day: 'T2', height: 70 },
        { day: 'T3', height: 85 },
        { day: 'T4', height: 60 },
        { day: 'T5', height: 90 },
        { day: 'T6', height: 95 },
        { day: 'T7', height: 100 },
        { day: 'CN', height: 75 }
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Xin chào, Admin!</h2>
                    <p className="text-gray-600 mt-1">Đây là tổng quan hoạt động quán cafe hôm nay</p>
                </div>

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

                {/* Charts and Quick Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                                <option value="7days">7 ngày qua</option>
                                <option value="30days">30 ngày qua</option>
                                <option value="month">Tháng này</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {chartData.map((data, index) => (
                                <div
                                    key={index}
                                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative"
                                    style={{ height: `${data.height}%` }}
                                >
                                    <div className="text-center text-white text-xs mt-2 font-medium">{data.day}</div>
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {(data.height * 200).toLocaleString()}đ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Thống kê nhanh</h3>
                        <div className="space-y-4">
                            {quickStats.map((stat, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 ${stat.bg} rounded-lg transition-all hover:scale-105`}>
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

                {/* Recent Orders and Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Xem tất cả
                            </a>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`${order.iconBg} p-3 rounded-lg`}>
                                            <i className={`fas fa-receipt ${order.iconColor}`}></i>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{order.id}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.table} - {order.items} món
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{order.amount}</p>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${
                                                order.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                      {order.statusText}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Xem tất cả
                            </a>
                        </div>
                        <div className="space-y-4">
                            {topProducts.map((product) => (
                                <div key={product.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className={`bg-gradient-to-br ${product.gradient} p-3 rounded-lg`}>
                                            <i className={`fas ${product.icon} text-white text-xl`}></i>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-600">{product.sold} ly</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{product.revenue}</p>
                                        <div className="flex items-center space-x-1 mt-1">
                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`${product.barColor} h-2 rounded-full transition-all duration-500`}
                                                    style={{ width: `${product.percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-600">{product.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CafeDashboard;