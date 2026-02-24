import { useState, useEffect } from 'react';
import { Camera, Search, LogIn, ChevronLeft } from 'lucide-react';
import { equipmentApi } from '../../api';

interface GuestPageProps {
    onLoginClick: () => void;
}

export default function GuestPage({ onLoginClick }: GuestPageProps) {
    const [equipments, setEquipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        // Force dark mode
        document.documentElement.classList.add('dark');
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await equipmentApi.findAll();
            setEquipments(data);
        } catch (error) {
            console.error('Failed to fetch equipments', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[10px] shadow-lg border border-emerald-500">Sẵn sàng</span>;
            case 'RENTED':
                return <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[10px] shadow-lg border border-blue-500">Đang thuê</span>;
            case 'MAINTENANCE':
                return <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[10px] shadow-lg border border-rose-500">Bảo trì</span>;
            default:
                return <span className="px-3 py-1 bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-[10px] shadow-lg border border-slate-600">{status}</span>;
        }
    };

    const filteredItems = equipments.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-blue-500/30 font-sans">
            {/* Minimal Header */}
            <header className="sticky top-0 z-40 px-6 lg:px-12 py-6 flex items-center justify-between bg-[#0F172A]/90 backdrop-blur-2xl border-b border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform cursor-pointer">
                        <img src="/images/camerental.png" alt="Camerental Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-black tracking-tighter text-white text-xl hidden sm:block">Camerental</span>
                </div>
                <button
                    onClick={onLoginClick}
                    className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-[20px] font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] shadow-lg flex items-center gap-3 transition-all active:scale-95"
                >
                    ĐĂNG NHẬP <LogIn className="w-4 h-4 text-blue-500" />
                </button>
            </header>

            <main className="max-w-[1700px] mx-auto p-6 lg:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-24">

                <div className="text-center space-y-4 mb-16 mt-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">DANH SÁCH THIẾT BỊ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">CHO THUÊ</span></h1>
                    <p className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-[0.2em] opacity-80 pt-4">Tra cứu danh sách máy ảnh, ống kính và phụ kiện</p>
                </div>

                <div className="bg-slate-800/80 backdrop-blur-md rounded-[32px] p-4 lg:p-6 border border-slate-700/50 shadow-2xl flex flex-col md:flex-row items-center gap-4 mb-12">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="TÌM KIẾM MÁY ẢNH, LENS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-slate-900 border-none rounded-[20px] font-black text-sm text-white focus:ring-4 focus:ring-blue-900/40 transition-all uppercase tracking-tight placeholder:text-slate-600"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {[
                            { id: 'all', label: 'TẤT CẢ' },
                            { id: 'AVAILABLE', label: 'SẴN SÀNG' },
                            { id: 'RENTED', label: 'ĐANG THUÊ' },
                        ].map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setFilterStatus(s.id)}
                                className={`px-8 py-5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${filterStatus === s.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-6">
                        <div className="w-16 h-16 border-[6px] border-slate-800 border-t-blue-500 rounded-full animate-spin shadow-xl" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-6 lg:gap-8">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="group bg-slate-800/50 rounded-[44px] p-8 border border-slate-700/50 shadow-xl hover:bg-slate-800/80 hover:border-slate-600 transition-all duration-500 relative flex flex-col"
                            >
                                <div className="absolute top-6 right-6 z-20">
                                    {getStatusBadge(item.status)}
                                </div>

                                <div className="w-full aspect-square rounded-[32px] bg-slate-900 overflow-hidden mb-8 relative flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all">
                                    {item.imageUrls?.[0] ? (
                                        <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <Camera className="w-16 h-16 text-slate-800" />
                                    )}
                                </div>

                                <div className="flex flex-col flex-1 justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1.5 bg-slate-900 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.brand}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{item.name}</h3>
                                    </div>

                                    <div className="pt-6 border-t border-slate-700/50">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">GIÁ THUÊ</p>
                                        <p className="text-2xl font-black text-blue-400 tracking-tighter leading-none">{formatCurrency(item.pricePerDay)}<span className="text-[10px] text-slate-600 uppercase tracking-widest ml-1 opacity-80">/NGÀY</span></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
