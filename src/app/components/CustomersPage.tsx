import { useState, useEffect } from 'react';
import { User, Plus, Search, Mail, Phone, MapPin, Edit3, Trash2, ShieldCheck, MoreVertical, X, Star } from 'lucide-react';
import { customerApi } from '../../api';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await customerApi.findAll();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = customers.filter(item => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.phone.includes(searchQuery) ||
            (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    if (loading && customers.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-16 h-16 border-[6px] border-emerald-600/10 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">ĐANG ĐỒNG BỘ DỮ LIỆU KHÁCH HÀNG...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Danh sách khách hàng</h2>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2 opacity-70">Quản lý hồ sơ hội viên và cấp độ dịch vụ</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2 group transition-all active:scale-95 translate-y-0"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    ĐĂNG KÝ HỘI VIÊN MỚI
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-4 lg:p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, số điện thoại hoặc mã số..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-900 border-none rounded-[24px] font-black text-lg focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/20 transition-all shadow-inner uppercase tracking-tighter"
                    />
                </div>
            </div>

            {/* Customers List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredItems.map((item) => (
                    <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-[44px] border border-slate-100 dark:border-slate-700 p-10 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-700 hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-[80px] flex items-center justify-center pl-10 pb-10 group-hover:bg-emerald-600 transition-all duration-700">
                            <User className="w-14 h-14 text-emerald-200 dark:text-emerald-800 group-hover:text-white/40 transition-colors" />
                        </div>

                        <div className="flex flex-col h-full space-y-10 relative z-10">
                            <div className="flex items-start gap-6 pr-12">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-3xl text-slate-400 dark:text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-500 uppercase">
                                    {item.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase group-hover:text-emerald-600 transition-colors mb-3">{item.name}</h3>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full w-fit">
                                        <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">HỘI VIÊN BẠCH KIM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover/item:text-emerald-600 transition-colors"><Phone className="w-5 h-5" /></div>
                                        <span className="text-sm font-black text-slate-700 dark:text-white tracking-widest">{item.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover/item:text-emerald-600 transition-colors"><Mail className="w-5 h-5" /></div>
                                        <span className="text-sm font-black text-slate-500 truncate tracking-tight">{item.email || 'CHƯA CẬP NHẬT'}</span>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover/item:text-emerald-600 transition-colors"><MapPin className="w-5 h-5" /></div>
                                        <span className="text-sm font-black text-slate-500 truncate tracking-tight uppercase">TP. Hồ Chí Minh</span>
                                    </div>
                                    <div className="flex items-center gap-4 group/item">
                                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover/item:text-emerald-600 transition-colors"><ShieldCheck className="w-5 h-5" /></div>
                                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">ĐÃ XÁC MINH</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">GIA NHẬP {new Date(item.createdAt).getFullYear()}</span>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="px-6 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-400 hover:bg-emerald-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 duration-300">
                                        SỬA HỒ SƠ
                                    </button>
                                    <button className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-300">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Footer */}
            <div className="bg-emerald-900 rounded-[48px] p-12 text-white shadow-2xl shadow-emerald-900/30 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                    <div className="p-5 bg-white/10 rounded-3xl border border-white/10"><Star className="w-10 h-10 text-emerald-400 fill-emerald-400" /></div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Hệ sinh thái khách hàng</p>
                        <p className="text-4xl font-black mt-2 leading-none">{customers.length} <span className="text-sm font-bold opacity-30 uppercase ml-3 tracking-widest">KHÁCH HÀNG</span></p>
                    </div>
                </div>
                <div className="h-14 w-[2px] bg-white/10 hidden lg:block" />
                <div className="text-center lg:text-right">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 leading-none">Cộng đồng thành viên</p>
                    <p className="text-3xl font-black text-emerald-400 tracking-tighter uppercase leading-none">Cộng đồng hoạt động tốt</p>
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
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase leading-none tracking-tighter">{editingItem ? 'SỬA HỒ SƠ' : 'THÊM HỘI VIÊN MỚI'}</h3>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 opacity-70">Sổ tay quản lý khách hàng chuyên nghiệp</p>
                            </div>

                            <form className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ tên khách hàng</label>
                                    <input type="text" className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xl uppercase tracking-tighter" placeholder="VD: NGUYỄN VĂN A" defaultValue={editingItem?.name} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                                        <input type="text" className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xl tracking-widest placeholder:tracking-normal" placeholder="090..." defaultValue={editingItem?.phone} />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Không bắt buộc)</label>
                                        <input type="email" className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xl tracking-tight" placeholder="client@example.com" defaultValue={editingItem?.email} />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-7 bg-emerald-600 text-white rounded-[32px] font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 active:scale-95 transition-all">
                                    {editingItem ? 'LƯU THAY ĐỔI' : 'ĐĂNG KÝ HỆ THỐNG'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
