import { BookOpen } from 'lucide-react';

export default function GuidesPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 lg:pb-0">
            <div className="bg-white dark:bg-slate-800 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-sm p-12 lg:p-16 space-y-12">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl border border-blue-100 dark:border-blue-800"><BookOpen className="w-8 h-8" /></div>
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">HƯỚNG DẪN QUY TRÌNH & VẬN HÀNH ĐƠN</h3>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 opacity-70">CHUẨN HÓA VÒNG ĐỜI CHO THUÊ THIẾT BỊ</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center font-black">1</span>
                            <span className="px-4 py-1 bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg">PENDING</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">CHỜ DUYỆT</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">Sale tạo đơn mới. Thiết bị được khoá lịch (block calendar) để tránh trùng khách. Máy chờ ở quầy (Chờ giao).</p>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-black">2</span>
                            <span className="px-4 py-1 bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">CONFIRMED</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">ĐÃ XÁC NHẬN</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">Quản lý duyệt giấy tờ, khách đã chuyển cọc thành công. Máy lên kệ chuẩn bị giao (Chờ giao).</p>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-black">3</span>
                            <span className="px-4 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">RENTING</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">ĐANG THUÊ</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">Khách qua lấy máy và ký biên bản nhận. Thiết bị rời khỏi cửa hàng và thuộc trách nhiệm của khách.</p>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:border-rose-500 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 flex items-center justify-center font-black">4</span>
                            <span className="px-4 py-1 bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg">LATE</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">TRỄ HẠN</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">Đã qua giờ trả nhưng khách chưa mang thiết bị về. Chuyển sang cờ Đỏ để tính phí trễ hạn (Tuỳ chọn).</p>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:border-slate-500 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 flex items-center justify-center font-black">5</span>
                            <span className="px-4 py-1 bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg">COMPLETED</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">HOÀN TẤT</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">Khách trả thiết bị đủ. KTV đã kiểm tra hỏng hóc, chốt tiền phí, trả cọc/biên bản giấy tờ. Giải phóng máy (Available).</p>
                    </div>

                    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-slate-700 space-y-4 hover:border-neutral-500 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <span className="w-10 h-10 rounded-xl bg-neutral-200 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-400 flex items-center justify-center font-black">6</span>
                            <span className="px-4 py-1 bg-neutral-200 text-neutral-700 dark:bg-neutral-500/20 dark:text-neutral-400 text-[10px] font-black uppercase tracking-widest rounded-lg">CANCELLED</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">ĐÃ HỦY</h4>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">Huỷ đơn (Khách bùng / Shop nghỉ). Thiết bị được tháo khoá Calendar ngay lập tức để nhận đơn khác.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
