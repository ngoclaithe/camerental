import { useState, useEffect } from 'react';
import { User, Plus, Search, Mail, Phone, MapPin, Edit3, Trash2, ShieldCheck, MoreVertical, X, Star, Upload, FileText, ChevronDown } from 'lucide-react';
import { customerApi, uploadApi } from '../../api';
import { toast } from 'sonner';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDocs, setShowDocs] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [viewingItem, setViewingItem] = useState<any>(null);
    const [documents, setDocuments] = useState<any>({
        cccdFront: null, cccdBack: null,
        gplxFront: null, gplxBack: null,
        passportFront: null, passportBack: null
    });
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

    const handleUploadDoc = async (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingDoc(type);
        try {
            const data = await uploadApi.uploadImage(file);
            if (data.secure_url) {
                setDocuments((prev: any) => ({ ...prev, [type]: data.secure_url }));
            }
        } catch (error) {
            console.error('Upload failed', error);
        }
        setUploadingDoc(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            cccdFront: documents.cccdFront,
            cccdBack: documents.cccdBack,
            gplxFront: documents.gplxFront,
            gplxBack: documents.gplxBack,
            passportFront: documents.passportFront,
            passportBack: documents.passportBack,
        };
        try {
            if (editingItem) {
                await customerApi.update(editingItem.id, payload);
                toast.success('Cập nhật khách hàng thành công');
            } else {
                await customerApi.create(payload);
                toast.success('Hội viên được đăng ký thành công');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error: any) {
            console.error('Failed to save', error);
            toast.error('Lưu thông tin thất bại', {
                description: error.response?.data?.message || 'Có lỗi xảy ra, thử lại sau.'
            });
        }
    };

    const resetDocuments = (item: any = null) => {
        setDocuments({
            cccdFront: item?.cccdFront || null,
            cccdBack: item?.cccdBack || null,
            gplxFront: item?.gplxFront || null,
            gplxBack: item?.gplxBack || null,
            passportFront: item?.passportFront || null,
            passportBack: item?.passportBack || null,
        });
    };

    const renderUploadSquare = (label: string, field: string) => (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <div className="relative w-full aspect-[3/2] rounded-[20px] bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
                {documents[field] ? (
                    <>
                        <img src={documents[field]} alt={label} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setDocuments((p: any) => ({ ...p, [field]: null }))} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-rose-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10">
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        {uploadingDoc === field ? (
                            <div className="w-6 h-6 border-2 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin" />
                        ) : (
                            <Plus className="w-8 h-8 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        )}
                        <input type="file" accept="image/*" onChange={(e) => handleUploadDoc(field, e)} disabled={!!uploadingDoc} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </>
                )}
            </div>
        </div>
    );

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

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const ITEMS_PER_PAGE = 9;
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                    onClick={() => { setEditingItem(null); resetDocuments(); setShowDocs(false); setIsModalOpen(true); }}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedItems.map((item) => (
                    <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xl text-slate-400 dark:text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all duration-500 uppercase shrink-0">
                                {item.name.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase truncate group-hover:text-emerald-600 transition-colors" title={item.name}>{item.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Star className="w-3 h-3 text-emerald-500 fill-emerald-500 shrink-0" />
                                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest truncate">HỘI VIÊN BẠCH KIM</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <Phone className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-bold tracking-widest">{item.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 min-w-0">
                                <Mail className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-bold truncate" title={item.email || 'CHƯA CẬP NHẬT'}>{item.email || 'CHƯA CẬP NHẬT'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                                <ShieldCheck className={`w-4 h-4 shrink-0 ${item.cccdFront || item.gplxFront || item.passportFront ? 'text-emerald-500' : ''}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.cccdFront || item.gplxFront || item.passportFront ? 'text-emerald-500' : ''}`}>
                                    {item.cccdFront || item.gplxFront || item.passportFront ? 'ĐÃ XÁC MINH' : 'CHƯA XÁC MINH'}
                                </span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] shrink-0 truncate">GIA NHẬP {new Date(item.createdAt).getFullYear()}</span>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => { setEditingItem(item); resetDocuments(item); setShowDocs(false); setIsModalOpen(true); }} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-500 hover:bg-emerald-500 hover:text-white transition-colors">
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-slate-500 hover:bg-rose-500 hover:text-white transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">TRƯỚC</button>
                    <span className="px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest">{currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50 text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">SAU</button>
                </div>
            )}

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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-white dark:bg-slate-800 rounded-[32px] sm:rounded-[56px] w-full max-w-2xl p-6 sm:p-12 lg:p-16 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-500 shadow-2xl border border-slate-100 dark:border-slate-700">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 sm:top-12 sm:right-12 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-900 dark:text-white z-50"><X className="w-5 h-5 sm:w-6 sm:h-6" /></button>

                        <div className="space-y-8 sm:space-y-12 relative z-10 pt-4 sm:pt-0">
                            <div>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase leading-none tracking-tighter">{editingItem ? 'SỬA HỒ SƠ' : 'THÊM HỘI VIÊN MỚI'}</h3>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 opacity-70">Sổ tay quản lý khách hàng chuyên nghiệp</p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Họ tên khách hàng</label>
                                    <input name="name" type="text" className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xl uppercase tracking-tighter" placeholder="VD: NGUYỄN VĂN A" defaultValue={editingItem?.name} required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Số điện thoại</label>
                                        <input name="phone" type="text" className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xl tracking-widest placeholder:tracking-normal" placeholder="090..." defaultValue={editingItem?.phone} required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Không bắt buộc)</label>
                                        <input name="email" type="email" className="w-full px-8 py-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[28px] font-black text-xl tracking-tight" placeholder="client@example.com" defaultValue={editingItem?.email} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <button type="button" onClick={() => setShowDocs(!showDocs)} className="flex items-center justify-between w-full group py-2">
                                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">Giấy tờ tùy thân</h4>
                                        <span className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-emerald-600 transition-colors">
                                            <ChevronDown className={`w-5 h-5 transition-transform ${showDocs ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>

                                    {showDocs && (
                                        <div className="space-y-6 sm:space-y-4 mt-6 animate-in slide-in-from-top-2 duration-300">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {renderUploadSquare("CCCD Mặt trước", "cccdFront")}
                                                {renderUploadSquare("CCCD Mặt sau", "cccdBack")}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {renderUploadSquare("GPLX Mặt trước", "gplxFront")}
                                                {renderUploadSquare("GPLX Mặt sau", "gplxBack")}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {renderUploadSquare("Passport Trang 1", "passportFront")}
                                                {renderUploadSquare("Passport Trang 2", "passportBack")}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" disabled={!!uploadingDoc} className="w-full py-7 bg-emerald-600 text-white rounded-[32px] font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50">
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
