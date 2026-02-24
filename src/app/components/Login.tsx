import { useState } from 'react';
import { LogIn, Key, Mail, Camera, ShieldCheck, ArrowRight, Check, EyeOff, Eye } from 'lucide-react';
import { authApi } from '../../api';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';

export default function Login({ onBack }: { onBack?: () => void }) {
    const [email, setEmail] = useState('admin@camrent.pro');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const setUser = useStore((state) => state.setUser);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await authApi.login(email, password);
            sessionStorage.setItem('prefer_session', keepLoggedIn ? 'false' : 'true');
            setUser(response.user);

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
                    <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center mb-12 shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden group hover:rotate-6 transition-all duration-700">
                        <img src="/images/camerental.png" alt="Camerental Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-7xl font-black tracking-tighter leading-[0.85] mb-8">
                        Camerental<br />
                        <span className="text-blue-200">Pro 3.0</span>
                    </h1>
                    <p className="text-2xl font-black text-blue-50/70 leading-relaxed mb-12 uppercase tracking-tight">
                        Hệ thống quản lý cho thuê thiết bị nhiếp ảnh thông minh, chuyên nghiệp.
                    </p>
                </div>
                <div className="absolute bottom-12 left-12 text-[10px] font-black uppercase tracking-[0.5em] text-white/40">MASTER COMMAND CENTER • v3.0.4</div>
            </div>

            {/* Right - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-16 lg:p-24 bg-[#0F172A] relative">
                <div className="w-full max-w-md space-y-12 relative z-10">
                    <div className="text-center lg:text-left space-y-4">
                        {onBack && (
                            <button onClick={onBack} className="absolute -top-16 lg:-top-24 left-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
                                <ArrowRight className="w-4 h-4 rotate-180" /> QUAY LẠI TRANG CHỦ
                            </button>
                        )}
                        <div className="lg:hidden w-16 h-16 rounded-full overflow-hidden mx-auto mb-8 shadow-xl">
                            <img src="/images/camerental.png" alt="Camerental Logo" className="w-full h-full object-cover" />
                        </div>
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
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-16 pr-14 py-6 bg-slate-900 border-none rounded-[28px] focus:outline-none focus:ring-4 focus:ring-blue-100/10 transition-all font-black text-lg placeholder:text-slate-700 tracking-widest text-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-2"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={keepLoggedIn}
                                        onChange={(e) => setKeepLoggedIn(e.target.checked)}
                                        className="peer w-5 h-5 rounded-lg border-2 border-slate-700 text-[#2563EB] focus:ring-0 appearance-none bg-slate-900 transition-all checked:bg-blue-600 checked:border-blue-600"
                                    />
                                    <Check className="absolute w-3.5 h-3.5 text-white left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none stroke-[4]" />
                                </div>
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-300">DUY TRÌ ĐĂNG NHẬP</span>
                            </label>
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
                        © 2026 Camerental Pro • SMART MANAGEMENT HUB
                    </div>
                </div>
            </div>
        </div>
    );
}
