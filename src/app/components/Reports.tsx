import { useState, useEffect } from 'react';
import { TrendingUp, Camera, Users, BarChart3, PieChart, ArrowUpRight, ArrowDownRight, Target } from 'lucide-react';
import { reportApi } from '../../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Reports() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportApi.getSummary().then(data => {
      setSummary(data);
      setLoading(false);
    });
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading || !summary) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">CHUẨN BỊ BÁO CÁO...</p>
    </div>
  );

  const revenueData = [
    { date: '17/02', revenue: 1200000, orders: 4 },
    { date: '18/02', revenue: 1900000, orders: 7 },
    { date: '19/02', revenue: 1500000, orders: 5 },
    { date: '20/02', revenue: 2200000, orders: 8 },
    { date: '21/02', revenue: 3000000, orders: 12 },
    { date: '22/02', revenue: 2500000, orders: 9 },
    { date: 'Hôm nay', revenue: summary.todayRevenue, orders: summary.activeOrders },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 lg:pb-0">

      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Báo cáo & Thống kê</h2>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 opacity-70">Phân tích hiệu suất kinh doanh và dòng tiền thời gian thực</p>
        </div>
        <div className="flex bg-white dark:bg-slate-800 p-2 rounded-[22px] border border-slate-100 dark:border-slate-700 shadow-sm">
          {['TÀI CHÍNH', 'THUÊ MÁY', 'TỔNG QUAN'].map((t, i) => (
            <button key={i} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xl translate-y-0' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'DOANH THU HÔM NAY', value: formatCurrency(summary.todayRevenue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50/50', growth: '+12%', up: true },
          { label: 'ĐƠN ĐANG HOẠT ĐỘNG', value: summary.activeOrders, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50/50', growth: '+8%', up: true },
          { label: 'ĐƠN CHỜ XÁC NHẬN', value: summary.pendingOrders, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50/50', growth: '-2%', up: false },
          { label: 'TỈ LỆ LẤP ĐẦY', value: '84.2%', icon: Camera, color: 'text-amber-600', bg: 'bg-amber-50/50', growth: 'MỤC TIÊU 95%', up: true }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-10 rounded-[44px] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6 group hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between">
              <div className={`p-4 ${item.bg} dark:bg-slate-700/50 ${item.color} rounded-[22px] border border-slate-50 dark:border-slate-700`}><item.icon className="w-7 h-7" /></div>
              <span className={`flex items-center gap-1.5 font-black text-[11px] ${item.up ? 'text-emerald-500' : 'text-rose-500'} uppercase tracking-[0.1em]`}>
                {item.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />} {item.growth}
              </span>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:text-blue-600 transition-colors">{item.value}</p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-4 opacity-80">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Revenue Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-[56px] border border-slate-100 dark:border-slate-700 shadow-sm p-12 lg:p-16 space-y-12">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">PHÂN TÍCH DÒNG DOANH THU</h3>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 opacity-70">CHU KỲ BÁO CÁO 2 TUẦN</p>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Doanh thu thuần</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-indigo-200 dark:bg-indigo-900" />
              <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Số lượng đơn</span>
            </div>
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenueRepV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" opacity={0.3} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94A3B8' }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#94A3B8' }} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ borderRadius: '28px', border: 'none', boxShadow: '0 40px 100px rgba(0,0,0,0.1)', padding: '24px', backgroundColor: '#FFF', textTransform: 'uppercase', fontWeight: 900 }}
                formatter={(v: any) => [formatCurrency(v), '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={6} fillOpacity={1} fill="url(#colorRevenueRepV)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target & Efficiency */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="bg-slate-900 rounded-[56px] p-14 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full translate-y-[-50%] translate-x-[50%] blur-[100px] group-hover:scale-125 transition-transform duration-[3000ms]" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[22px] bg-white/10 flex items-center justify-center border border-white/5 shadow-xl"><Target className="w-6 h-6" /></div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">MỤC TIÊU DOANH THU THÁNG 03</h4>
            </div>
            <div>
              <p className="text-6xl font-black tracking-tighter leading-none mb-10">152M <span className="text-sm font-black opacity-30 tracking-[0.3em] ml-2">VNĐ</span></p>
              <div className="space-y-6">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-white/50">
                  <span>Tiến độ hiện tại</span>
                  <span className="text-blue-400">68.4%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)]" style={{ width: '68%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[56px] p-14 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-[22px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/50"><PieChart className="w-6 h-6" /></div>
              <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">HIỆU SUẤT THIẾT BỊ</h4>
            </div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-5 py-2 rounded-xl uppercase tracking-widest border border-blue-100/30">TOP: SONY ALPHA SERIES</span>
          </div>

          <div className="space-y-8">
            {[
              { name: 'SONY A7 MARK IV', rate: 92, revenue: '42.5M' },
              { name: 'CANON EOS R5 BODY', rate: 78, revenue: '31.2M' },
              { name: 'SONY 24-70 GM II', rate: 64, revenue: '18.9M' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group/row p-1 px-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase mt-2 tracking-widest leading-none">{item.revenue} ĐÓNG GÓP</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-blue-600 leading-none">{item.rate}%</p>
                  <p className="text-[11px] font-black text-slate-400 uppercase mt-2 tracking-widest leading-none">TỈ LỆ THUÊ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
