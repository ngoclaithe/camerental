import { useState, useEffect } from 'react';
import { Camera, Plus, Search, Filter, Edit3, Trash2, ShieldCheck, Settings2, MoreVertical, X } from 'lucide-react';
import { equipmentApi } from '../../api';

export default function EquipmentsPage() {
    const [equipments, setEquipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    useEffect(() => {
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
                return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">Sẵn sàng</span>;
            case 'RENTED':
                return <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">Đang thuê</span>;
            case 'MAINTENANCE':
                return <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-100">Bảo trì</span>;
            default:
                return <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">{status}</span>;
        }
    };

    const filteredItems = equipments.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading && equipments.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">ĐANG ĐỒNG BỘ THIẾT BỊ...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">

            {/* Header & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Kho thiết bị</h2>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2 opacity-70">Quản lý máy ảnh, ống kính và linh kiện</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    THÊM THIẾT BỊ MỚI
                </button>
            </div>

            {/* Modern Filter & Search Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-4 lg:p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên máy hoặc số Serial..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl font-black text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all uppercase tracking-tight"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {[
                        { id: 'all', label: 'TẤT CẢ' },
                        { id: 'AVAILABLE', label: 'SẴN SÀNG' },
                        { id: 'RENTED', label: 'ĐANG THUÊ' },
                        { id: 'MAINTENANCE', label: 'BẢO TRÌ' }
                    ].map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setFilterStatus(s.id)}
                            className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === s.id ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Equipment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item) => (
                    <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-[44px] border border-slate-100 dark:border-slate-700 p-10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-slate-50 dark:bg-slate-900 rounded-bl-[50px] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-700">
                            <Camera className="w-10 h-10 text-slate-200 group-hover:text-white/40 transition-colors" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="min-h-[60px]">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{item.brand}</p>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight pr-12 uppercase group-hover:text-blue-600 transition-colors">{item.name}</h3>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Giá / Ngày</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{formatCurrency(item.pricePerDay)}</p>
                                </div>
                                {getStatusBadge(item.status)}
                            </div>

                            <div className="pt-8 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.serialNumber}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300"><Edit3 className="w-4 h-4" /></button>
                                    <button className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Footer */}
            <div className="bg-slate-900 rounded-[48px] p-12 text-white shadow-2xl shadow-slate-900/20 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                    <div className="p-5 bg-white/10 rounded-3xl border border-white/10"><ShieldCheck className="w-10 h-10 text-blue-400" /></div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">TỔNG THẾ THIẾT BỊ</p>
                        <p className="text-4xl font-black mt-2 leading-none">{equipments.length} <span className="text-sm font-bold opacity-30 uppercase ml-3 tracking-widest">THIẾT BỊ</span></p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-12 lg:gap-16">
                    <div className="text-center lg:text-left">
                        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Sẵn sàng</p>
                        <p className="text-2xl font-black text-emerald-400 leading-none">{equipments.filter(e => e.status === 'AVAILABLE').length}</p>
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Đang thuê</p>
                        <p className="text-2xl font-black text-blue-400 leading-none">{equipments.filter(e => e.status === 'RENTED').length}</p>
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">Bảo trì</p>
                        <p className="text-2xl font-black text-rose-400 leading-none">{equipments.filter(e => e.status === 'MAINTENANCE').length}</p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-800 rounded-[56px] w-full max-w-2xl p-12 lg:p-16 animate-in zoom-in-95 duration-500 shadow-2xl border border-slate-100 dark:border-slate-700">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-12 right-12 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-900 dark:text-white"><X className="w-6 h-6" /></button>

                        <div className="space-y-12">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase leading-none tracking-tighter">{editingItem ? 'SỬA THIẾT BỊ' : 'THIẾT BỊ MỚI'}</h3>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 opacity-70">Cập nhật thông tin kỹ thuật chính xác</p>
                            </div>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Tên thiết bị</label>
                                        <input type="text" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] font-black text-sm uppercase tracking-tight" placeholder="VD: Sony A7 Mark IV" defaultValue={editingItem?.name} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Thương hiệu</label>
                                        <input type="text" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] font-black text-sm uppercase tracking-tight" placeholder="VD: Sony, Canon..." defaultValue={editingItem?.brand} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Giá thuê / Ngày</label>
                                        <input type="number" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] font-black text-sm uppercase tracking-tight" placeholder="VD: 500000" defaultValue={editingItem?.pricePerDay} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Số Serial</label>
                                        <input type="text" className="w-full px-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] font-black text-sm uppercase tracking-tight" placeholder="VD: SN-123456" defaultValue={editingItem?.serialNumber} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all">
                                    {editingItem ? 'LƯU THAY ĐỔI' : 'TẠO THIẾT BỊ'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
