import { useState } from 'react';
import { LogIn, Key, Mail, Camera, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { authApi } from '../../api';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export default function Login() {
    const [email, setEmail] = useState('admin@camrent.pro');
    const [password, setPassword] = useState('admin123');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setUser = useStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authApi.login(email, password);
            setUser(response.user);
            toast.success('Đăng nhập thành công', {
                description: 'Chào mừng trở lại bảng điều khiển.',
            });
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
            setError(errorMsg);
            toast.error('Lỗi xác thực', {
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#0F172A] selection:bg-blue-500/30">
            {/* Left Decoration - Brand */}
            <div className="hidden lg:flex lg:w-[58%] bg-[#2563EB] relative overflow-hidden items-center justify-center p-16">
                <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-2xl text-white">
                    <div className="w-24 h-24 rounded-[32px] bg-slate-900 flex items-center justify-center mb-12 shadow-[0_32px_80px_rgba(0,0,0,0.15)] group hover:rotate-6 transition-all duration-700">
                        <Camera className="w-12 h-12 text-[#2563EB]" />
                    </div>
                    <h1 className="text-8xl font-black tracking-tighter leading-[0.85] mb-8 uppercase">
                        CAMRENT<br />
                        <span className="text-blue-200">PRO 3.0</span>
                    </h1>
                    <p className="text-2xl font-black text-blue-50/70 leading-relaxed mb-12 uppercase tracking-tight">
                        Hệ thống quản lý cho thuê thiết bị nhiếp ảnh thông minh, chuyên nghiệp và bảo mật nhất hiện nay.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-6 rounded-[28px] border border-white/15 shadow-xl">
                            <ShieldCheck className="w-7 h-7 text-blue-200" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">BẢO MẬT ĐA TẦNG</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-2xl p-6 rounded-[28px] border border-white/15 shadow-xl">
                            <Key className="w-7 h-7 text-blue-200" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">XÁC THỰC HIỆN ĐẠI</span>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-12 left-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">MASTER COMMAND CENTER • v3.0.4</div>
            </div>

            {/* Right - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-[#0F172A] relative">
                <div className="w-full max-w-md space-y-12 relative z-10">
                    <div className="text-center lg:text-left space-y-4">
                        <div className="lg:hidden w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black mx-auto mb-8 shadow-xl">C</div>
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">MỪNG TRỞ LẠI!</h2>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest leading-loose">Truy cập hệ thống điều hành để bắt đầu ngày làm việc mới.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border-2 border-rose-500/20 text-rose-400 px-6 py-4 rounded-3xl text-sm font-black animate-in shake flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.8)]" /> {error.toUpperCase()}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">ĐỊA CHỈ EMAIL QUẢN TRỊ</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-[#2563EB] transition-all" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@camrent.pro"
                                    className="w-full pl-16 pr-8 py-6 bg-slate-900 border-none rounded-[28px] focus:outline-none focus:ring-4 focus:ring-blue-100/10 transition-all font-black text-lg placeholder:text-slate-700 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 ml-1">MẬT KHẨU TRUY CẬP</label>
                            <div className="relative group">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-[#2563EB] transition-all" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-16 pr-8 py-6 bg-slate-900 border-none rounded-[28px] focus:outline-none focus:ring-4 focus:ring-blue-100/10 transition-all font-black text-lg placeholder:text-slate-700 tracking-widest text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer w-5 h-5 rounded-lg border-2 border-slate-700 text-[#2563EB] focus:ring-0 appearance-none bg-slate-900 transition-all checked:bg-blue-600 checked:border-blue-600" />
                                    <Check className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[4]" />
                                </div>
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300">DUY TRÌ ĐĂNG NHẬP</span>
                            </label>
                            <button type="button" className="text-[11px] font-black text-[#2563EB] hover:text-blue-700 uppercase tracking-widest decoration-2 underline-offset-4">QUÊN MẬT KHẨU?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-7 bg-[#2563EB] hover:bg-blue-700 text-white rounded-[32px] font-black transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 disabled:opacity-70 disabled:grayscale transition-all hover:-translate-y-1 active:scale-[0.98] group"
                        >
                            <span className="text-sm uppercase tracking-[0.3em] font-black">{loading ? 'XÁC THỰC DỮ LIỆU...' : 'KÍCH HOẠT HỆ THỐNG'}</span>
                            {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform stroke-[3]" />}
                        </button>
                    </form>

                    <div className="pt-12 text-center text-slate-700 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-800">
                        © 2026 CAMRENT PRO • SMART MANAGEMENT HUB
                    </div>
                </div>
            </div>
        </div>
    );
}
