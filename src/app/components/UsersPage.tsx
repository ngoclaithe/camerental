import { useState, useEffect } from 'react';
import { Search, Plus, UserCog, User, ShieldCheck, Mail, Edit3, Trash2, X, KeySquare } from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '../../api';

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STAFF' });

    const fetchUsers = async () => {
        try {
            const data = await userApi.findAll();
            setUsers(data);
        } catch (error: any) {
            toast.error('Lỗi tải danh sách', {
                description: error.response?.data?.message || 'Không thể lấy dữ liệu tài khoản.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setFormLoading(true);
            await userApi.create(formData);
            toast.success('Tạo tài khoản thành công');
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'STAFF' });
            fetchUsers();
        } catch (error: any) {
            toast.error('Tạo tài khoản thất bại', {
                description: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.'
            });
        } finally {
            setFormLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400';
            case 'MANAGER': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
            case 'STAFF': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'QUẢN TRỊ VIÊN';
            case 'MANAGER': return 'QUẢN LÝ';
            case 'STAFF': return 'NHÂN VIÊN';
            default: return role;
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">ĐANG TẢI DỮ LIỆU TÀI KHOẢN...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Quản lý Tài Khoản</h2>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-2">{users.length} NHÂN SỰ HỆ THỐNG</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <div className="relative group w-full sm:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Tìm tên, email..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-black text-sm uppercase text-slate-900 dark:text-white"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all hover:-translate-y-1 shadow-[0_15px_30px_rgba(37,99,235,0.3)] font-black text-xs uppercase tracking-widest active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" /> TẠO TÀI KHOẢN
                    </button>
                </div>
            </div>

            {/* Users List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative">
                        <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors" onClick={() => toast.info('Tính năng sửa đang được phát triển')}><Edit3 className="w-4 h-4" /></button>
                            <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/40 transition-colors" onClick={() => toast.error('Tính năng xoá đang được phát triển')}><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="flex flex-col items-center text-center mt-4">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-100 dark:border-blue-800/50 flex flex-col items-center justify-center font-black group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                    <UserCog className="w-10 h-10" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1 rounded-full shadow-lg">
                                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
                                </div>
                            </div>

                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user.name}</h3>

                            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400">
                                <Mail className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-bold tracking-widest uppercase">{user.email}</span>
                            </div>

                            <div className={`mt-6 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${getRoleBadge(user.role)}`}>
                                {getRoleLabel(user.role)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">TẠO TÀI KHOẢN MỚI</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">TÊN NHÂN VIÊN</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Vd: Nguyễn Văn A..."
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none font-black text-sm uppercase text-slate-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">EMAIL ĐĂNG NHẬP</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="admin@camrent.pro"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none font-black text-sm uppercase text-slate-900 dark:text-white transition-all lowercase"
                                        style={{ textTransform: 'lowercase' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">MẬT KHẨU</label>
                                <div className="relative">
                                    <KeySquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none font-black text-sm text-slate-900 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">QUYỀN HẠN (ROLE)</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none font-black text-sm uppercase text-slate-900 dark:text-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="STAFF">NHÂN VIÊN</option>
                                        <option value="MANAGER">QUẢN LÝ</option>
                                        <option value="ADMIN">QUẢN TRỊ VIÊN</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">HỦY</button>
                                <button type="submit" disabled={formLoading} className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0">
                                    {formLoading ? 'ĐANG LƯU...' : 'XÁC NHẬN YÊU CẦU'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
