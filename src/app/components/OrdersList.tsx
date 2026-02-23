import { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, FileText } from 'lucide-react';
import { orderApi } from '../../api';

export default function OrdersList() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.findAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'RENTING': return 'bg-emerald-500 shadow-emerald-500/20';
      case 'PENDING': return 'bg-amber-500 shadow-amber-500/20';
      case 'LATE': return 'bg-rose-500 shadow-rose-500/20';
      case 'CONFIRMED': return 'bg-blue-500 shadow-blue-500/20';
      case 'COMPLETED': return 'bg-slate-400 shadow-slate-400/20';
      default: return 'bg-slate-500 shadow-slate-500/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.customer?.name || '';
    const orderCode = order.code || '';
    const equipmentNames = order.orderItems?.map((item: any) => item.equipment.name).join(' ') || '';

    const matchesSearch =
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentNames.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">ĐANG TẢI DANH SÁCH ĐƠN HÀNG...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-24 lg:pb-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative z-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Quản lý đơn hàng</h2>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mt-4 opacity-70">Theo dõi trạng thái thuê máy và lịch sử giao dịch</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="KHÁCH, MÃ ĐƠN, THIẾT BỊ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-8 py-4.5 bg-slate-50 dark:bg-slate-900 border-none rounded-[22px] focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-black text-[13px] uppercase w-full sm:w-80"
              />
            </div>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`p-4.5 rounded-[22px] transition-all flex items-center justify-center border-2 ${showFilter ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-700 animate-in slide-in-from-top-4 duration-500">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 block">Lọc theo trạng thái</label>
            <div className="flex flex-wrap gap-3">
              {['all', 'PENDING', 'CONFIRMED', 'RENTING', 'LATE', 'COMPLETED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 ${filterStatus === status ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                  {status === 'all' ? 'Tất cả đơn' : status}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Orders List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-[48px] border border-slate-100 dark:border-slate-700 p-24 text-center">
            <p className="text-xl font-black text-slate-400 uppercase tracking-[0.2em] opacity-40">Không tìm thấy đơn hàng</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group bg-white dark:bg-slate-800 rounded-[48px] border border-slate-100 dark:border-slate-700 p-10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between gap-6 relative z-10">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`px-4 py-1.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-black text-[11px] text-slate-400 dark:text-slate-500 tracking-[0.15em] uppercase">ID: {order.code}</p>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase leading-none mb-6">{order.customer?.name}</h3>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {order.orderItems?.map((i: any, idx: number) => (
                      <span key={idx} className="bg-slate-50 dark:bg-slate-900 text-[10px] font-black text-slate-500 dark:text-slate-400 px-4 py-2 rounded-xl uppercase tracking-tighter border border-slate-100 dark:border-slate-700">
                        {i.equipment.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-[11px] font-black text-slate-400 bg-slate-50 dark:bg-slate-900 p-5 rounded-[28px] border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-900 dark:text-white uppercase tracking-tighter">{new Date(order.startDate).toLocaleDateString('vi-VN')}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span className="text-slate-900 dark:text-white uppercase tracking-tighter">{new Date(order.endDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="hidden sm:block w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                    <span className="uppercase tracking-[0.1em]">{order.totalDays} NGÀY THUÊ</span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full pt-2">
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-[10px] font-black text-blue-600/50 uppercase mt-2 tracking-widest">Tổng tiền</p>
                  </div>
                  <ChevronRight className="w-8 h-8 text-slate-200 dark:text-slate-700 group-hover:text-blue-600 group-hover:translate-x-3 transition-all duration-500" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Global Summary */}
      {filteredOrders.length > 0 && (
        <div className="bg-slate-900 rounded-[56px] p-12 text-white shadow-2xl shadow-slate-900/40 flex flex-col md:flex-row items-center justify-between gap-10 border border-slate-800">
          <div className="flex items-center gap-8">
            <div className="p-5 bg-white/10 rounded-3xl border border-white/10">
              <FileText className="w-9 h-9 text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Tổng số đơn lọc được</p>
              <p className="text-4xl font-black leading-none">{filteredOrders.length} <span className="text-sm font-bold opacity-30 tracking-[0.1em] ml-3">ĐƠN HÀNG</span></p>
            </div>
          </div>

          <div className="h-16 w-[2px] bg-white/10 hidden md:block" />

          <div className="text-center md:text-right">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Giá trị tích lũy</p>
            <p className="text-5xl font-black text-blue-400 leading-none tracking-tighter">
              {formatCurrency(filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0))}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
