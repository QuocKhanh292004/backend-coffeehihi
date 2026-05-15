import React, { useState } from 'react';

const SystemSettings = () => {
    const [theme, setTheme] = useState('dark');
    const [accentColor, setAccentColor] = useState('emerald');
    const [activeTab, setActiveTab] = useState('display');

    const themes = [
        { id: 'light', label: 'Light Mode', icon: 'fa-sun', colors: 'bg-[#F8FAFC] border-slate-200' },
        { id: 'dark', label: 'Dark Mode', icon: 'fa-moon', colors: 'bg-[#18181B] border-white/10' },
        { id: 'system', label: 'Auto', icon: 'fa-circle-half-stroke', colors: 'bg-gradient-to-br from-[#F8FAFC] to-[#18181B] border-slate-300' },
    ];

    const accents = [
        { name: 'emerald', color: 'bg-emerald-500' },
        { name: 'blue', color: 'bg-blue-500' },
        { name: 'purple', color: 'bg-purple-500' },
        { name: 'rose', color: 'bg-rose-500' },
        { name: 'amber', color: 'bg-amber-500' },
    ];

    return (

        <div className="flex h-[95vh] bg-[#0C0C0E] text-slate-300 p-4 font-sans overflow-hidden antialiased">
            {/* --- NỘI DUNG CHÍNH --- */}
            <main className="flex-1 flex flex-col ml-6 overflow-hidden">
                {/* Header thanh thoát */}
                <header className="flex justify-between items-center mb-6 px-2">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase italic">Settings</h1>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            System Operational
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 transition-all">Hủy</button>
                        <button className="px-6 py-2.5 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-white/5">
                            Cập nhật
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-10">
                    {/* BENTO ROW 1: GIAO DIỆN & MÀU NHẤN */}
                    <div className="grid grid-cols-12 gap-6">
                        {/* Khối Giao diện */}
                        <div className="col-span-12 lg:col-span-8 bg-[#121215] border border-white/5 rounded-[2.5rem] p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <i className="fa-solid fa-wand-magic-sparkles text-emerald-500 text-xs"></i>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Chế độ hiển thị</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                {themes.map((t) => (
                                    <div
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className="group cursor-pointer"
                                    >
                                        <div className={`h-32 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${t.colors} ${theme === t.id ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-transparent hover:border-white/10'}`}>
                                            <div className="absolute inset-x-3 inset-y-3 rounded-xl bg-slate-400/5 border border-white/5 p-2">
                                                <div className="flex gap-1.5 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500/40"></div>
                                                    <div className="w-8 h-1.5 rounded-full bg-slate-400/20"></div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="w-full h-1 bg-slate-400/10 rounded-full"></div>
                                                    <div className="w-3/4 h-1 bg-slate-400/10 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`text-center mt-3 text-[10px] font-black uppercase tracking-widest transition-colors ${theme === t.id ? 'text-white' : 'text-slate-600'}`}>{t.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Khối Màu nhấn */}
                        <div className="col-span-12 lg:col-span-4 bg-[#121215] border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Màu chủ đạo</h3>
                                <div className="grid grid-cols-5 lg:grid-cols-3 gap-3">
                                    {accents.map((a) => (
                                        <button
                                            key={a.name}
                                            onClick={() => setAccentColor(a.name)}
                                            className={`h-12 rounded-xl transition-all flex items-center justify-center relative ${accentColor === a.name ? 'ring-2 ring-white ring-offset-4 ring-offset-[#121215]' : 'hover:scale-105'}`}
                                        >
                                            <div className={`w-full h-full rounded-xl ${a.color} opacity-20`}></div>
                                            <div className={`w-3 h-3 rounded-full ${a.color} absolute`}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-500 font-medium italic leading-relaxed mt-4">Tự động áp dụng cho các thành phần UI, Icon và Trạng thái.</p>
                        </div>
                    </div>

                    {/* BENTO ROW 2: VẬN HÀNH NHANH */}
                    <div className="grid grid-cols-4 gap-6">
                        {[
                            { label: 'In hóa đơn tự động', icon: 'fa-print', status: true },
                            { label: 'Cloud Sync', icon: 'fa-cloud-arrow-up', status: true },
                            { label: 'Thông báo Telegram', icon: 'fa-paper-plane', status: false },
                            { label: 'Âm thanh POS', icon: 'fa-volume-low', status: true },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-[#121215] border border-white/5 p-6 rounded-[2rem] flex flex-col gap-6 hover:border-white/10 transition-all group">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 bg-[#1A1A1E] rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                                        <i className={`fa-light ${item.icon} text-lg`}></i>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={item.status} />
                                        <div className="w-10 h-5 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2.5px] after:left-[2.5px] after:bg-slate-600 after:rounded-full after:h-[15px] after:w-[15px] after:transition-all peer-checked:after:bg-emerald-400 peer-checked:bg-emerald-500/10"></div>
                                    </label>
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight text-slate-200">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* BENTO ROW 3: THÔNG TIN CỬA HÀNG (Compact) */}
                    <div className="bg-[#121215] border border-white/5 rounded-[2.5rem] p-10">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Thông tin cơ sở</h3>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                { label: 'Tên quán', val: 'GEMINI COFFEE LAB', icon: 'fa-signature' },
                                { label: 'Hotline', val: '0909 123 456', icon: 'fa-phone' },
                                { label: 'Địa chỉ trụ sở', val: '123 Downtown, Saigon City', icon: 'fa-location-dot' },
                                { label: 'Email Admin', val: 'admin@gemini.coffee', icon: 'fa-envelope' }
                            ].map((field, i) => (
                                <div key={i} className="group border-b border-white/5 pb-2 transition-all focus-within:border-emerald-500/50">
                                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{field.label}</label>
                                    <div className="flex items-center gap-3">
                                        <i className={`fa-light ${field.icon} text-slate-700 text-xs`}></i>
                                        <input
                                            type="text"
                                            defaultValue={field.val}
                                            className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder-white/10"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* CSS bổ sung để ẩn thanh cuộn và làm mượt font */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272A; border-radius: 10px; }
                input:focus { border-bottom-color: #10B981; }
            `}</style>
        </div>
    );
};

export default SystemSettings;