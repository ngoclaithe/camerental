import { useEffect, useState } from 'react';
import { Camera, FileText, BarChart3, Clock, ChevronRight, TrendingUp, Calendar as CalendarIcon, Filter, ArrowUpRight, Activity } from 'lucide-react';
import { reportApi, orderApi } from '../../api';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, ordersData] = await Promise.all([
          reportApi.getSummary(),
          orderApi.findAll(),
        ]);
        setSummary(summaryData);
        setRecentOrders(ordersData.slice(0, 6));
      } catch (error: any) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Lỗi tải dữ liệu', {
          description: error.response?.data?.message || 'Không thể đồng bộ dữ liệu Dashboard.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">ĐANG ĐỒNG BỘ HỆ THỐNG...</p>
    </div>
  );

  const stats = [
    { label: 'DOANH THU HÔM NAY', value: formatCurrency(summary?.todayRevenue || 0), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50/50', growth: '+12.5%', iconColor: 'text-blue-600' },
    { label: 'ĐƠN ĐANG HOẠT ĐỘNG', value: summary?.activeOrders || 0, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50/50', growth: 'TRỰC TUYẾN', iconColor: 'text-emerald-600' },
    { label: 'THIẾT BỊ SẴN SÀNG', value: summary?.availableEquipments || 0, icon: Camera, color: 'text-indigo-600', bg: 'bg-indigo-50/50', growth: '98% CÔNG SUẤT', iconColor: 'text-indigo-600' },
    { label: 'ĐƠN CHỜ XỬ LÝ', value: summary?.pendingOrders || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50/50', growth: 'CẦN XỬ LÝ', iconColor: 'text-amber-600' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'RENTING': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
      'PENDING': 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      'CONFIRMED': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
      'LATE': 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
      'COMPLETED': 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
    };

    const statusMap: Record<string, string> = {
      'PENDING': 'CHỜ DUYỆT',
      'CONFIRMED': 'ĐÃ XÁC NHẬN',
      'RENTING': 'ĐANG THUÊ',
      'LATE': 'TRỄ HẠN',
      'COMPLETED': 'HOÀN TẤT',
      'CANCELLED': 'ĐÃ HỦY'
    };

    return (
      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl border ${styles[status] || styles['PENDING']}`}>
        {statusMap[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-20">

      {/* Hero Welcome Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-[48px] p-10 lg:p-16 border border-slate-100 dark:border-slate-700 shadow-[0_40px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/30 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-[2000ms]" />
          <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 dark:bg-slate-900/80 rounded-full w-fit border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,1)]" />
              <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">{dayjs().format('DD/MM/YYYY')} • HQ SYSTEM LIVE</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter uppercase">
                CHÀO MỪNG TRỞ LẠI,<br />
                <span className="text-blue-600 dark:text-blue-500">ADMIN QUẢN LÝ</span>
              </h1>
              <p className="text-xl font-bold text-slate-400 dark:text-slate-500 max-w-xl leading-relaxed uppercase tracking-tighter opacity-90">
                Hệ thống đã sẵn sàng. Có <span className="text-slate-900 dark:text-white underline decoration-blue-600 decoration-[6px] underline-offset-8 font-black">{summary?.activeOrders || 0} thiết bị</span> đang hoạt động.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[48px] p-12 text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden flex flex-col justify-between group border border-slate-800">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="p-4 bg-white/10 rounded-[22px] w-fit mb-10 border border-white/10"><TrendingUp className="w-7 h-7 text-blue-400" /></div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-3">DOANH THU THÁNG</h4>
            <p className="text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-6">{new Intl.NumberFormat('vi-VN').format(summary?.monthlyRevenue || 0)} <span className="text-xs font-black opacity-30 tracking-[0.2em] ml-1">VNĐ</span></p>
            <div className="mt-10 h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" style={{ width: `${Math.min(100, Math.floor(((summary?.monthlyRevenue || 0) / 100000000) * 100))}%` }} />
            </div>
            <div className="flex justify-between mt-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Tiến độ mục tiêu 100Tr</span>
              <span className="text-[10px] font-black uppercase text-blue-400">{Math.min(100, Math.floor(((summary?.monthlyRevenue || 0) / 100000000) * 100))}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white dark:bg-slate-800 p-10 rounded-[44px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700 hover:-translate-y-2 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-28 h-28 ${stat.bg} dark:bg-slate-700/50 rounded-bl-[50px] flex items-center justify-center transition-all duration-1000 group-hover:bg-blue-600 group-hover:scale-110`}>
              <stat.icon className={`w-9 h-9 ${stat.iconColor} group-hover:text-white transition-colors duration-500`} />
            </div>
            <div className="relative z-10 pt-4">
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mb-10 block">{stat.label}</span>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.value}</p>
              <div className="mt-10 flex items-center gap-2">
                <div className="p-1 px-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-black text-emerald-500 uppercase leading-none tracking-tighter">{stat.growth}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Master View Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 lg:p-14 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-2.5 h-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">HOẠT ĐỘNG MỚI NHẤT</h3>
            </div>
            <button className="px-8 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[11px] font-black uppercase tracking-widest transition-all">TẤT CẢ ĐƠN</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/40 dark:bg-slate-900/20">
                  <th className="px-14 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.25em]">THÔNG TIN KHÁCH HÀNG</th>
                  <th className="px-14 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.25em]">TRẠNG THÁI</th>
                  <th className="px-14 py-8 text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.25em] text-right">THANH TOÁN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-300">
                    <td className="px-14 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-400 dark:text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 uppercase text-lg">{order.customer?.name.charAt(0)}</div>
                        <div>
                          <p className="text-lg font-black text-slate-900 dark:text-white uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-none mb-2">{order.customer?.name}</p>
                          <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">MÃ ĐƠN: {order.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-14 py-10">{getStatusBadge(order.status)}</td>
                    <td className="px-14 py-10 text-right">
                      <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-2">{formatCurrency(order.totalAmount)}</p>
                      <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">THUÊ {order.totalDays} NGÀY</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-800 p-12 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2.5 h-full bg-blue-600 transition-all duration-500 group-hover:w-4" />
            <div className="flex flex-col gap-10 h-full">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-500/10"><Activity className="w-7 h-7" /></div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">VẬN HÀNH</h4>
              </div>
              <div className="space-y-10">
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-1.5 h-16 bg-blue-600 rounded-full group-hover:h-20 transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                  <div className="flex-1">
                    <p className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all uppercase tracking-tight">TỐI ƯU KHO SONY</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3 leading-relaxed uppercase tracking-wide opacity-80">Dòng A7IV đang cháy hàng. <br />Đề xuất bổ sung 02 lens 24-70 GM sớm.</p>
                  </div>
                </div>
                <div className="flex gap-6 group cursor-pointer">
                  <div className="w-1.5 h-16 bg-rose-500 rounded-full group-hover:h-20 transition-all shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                  <div className="flex-1">
                    <p className="text-base font-black text-slate-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-all uppercase tracking-tight">KIỂM TRA THIẾT BỊ</p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-3 leading-relaxed uppercase tracking-wide opacity-80">Mã #SN-192 (EOS R5) vừa <br />trả về có lỗi kẹt nút màn trập.</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-6 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-[28px] text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 transition-all mt-auto border border-slate-100 dark:border-slate-600 active:scale-95">TỰ ĐỘNG HÓA HỆ THỐNG</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
